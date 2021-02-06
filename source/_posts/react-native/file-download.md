---
title: React Native 实现文件下载
date: 2021-02-05 00:00:00
categories: 
- React Native
---

App中进行文件下载的场景很常见，如音视频软件对资源进行离线缓存，或者Android手机中下载Apk安装包升级等等场景都会涉及到文件下载。翻遍了React Native下载相关的开源库，没有一套完整的方案可以实现文件的下载、暂停、继续下载，并记录下载状态这样的功能。经过一番调研，在技术上通过RN是可以实现这一功能的。

<!-- more -->
## 核心技术方案
实现上有两个关键的技术点：
1. 如何在本地管理和维护下载状态，用于在下载列表中展示和管理当前下载任务。
2. 下载、暂停、退出APP后再次打开如何继续下载。

### Async Storage
【开源地址】https://github.com/react-native-async-storage/async-storage

AsyncStorage是一个简单的、异步的、持久化的 Key-Value 存储系统，从前端的角度来理解就相当于是LocalStorage，AsyncStorage中保存的数据不会因为退出、升级操作而丢失，所以可以作为一种持久化保存的技术方案。

### RN-Fetch-Blob 
【开源地址】https://github.com/joltup/rn-fetch-blob

RN-Fetch-Blob可以支持文件的上传和下载，并提供了一系列文件操作的API，更重要是针对大文件可以支持流式下载，将已下载的部分临时存储在本地，这一特性是实现中断后继续下载的关键。

### Request Header Range参数
【参考资料】https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Range_requests

HTTP Request的Header中可以设置一个Range参数，即对于一个HTTP请求，可以设置Header Range: `bytes=${preSize}-`，请求返回的结果是一个206 Partial Content 的状态码，内容就是对应大小范围内资源。

## 实现思路
看了上面的几个核心技术方案，我们实现的思路已经很明确了。下载中断后再次下载时只需要获取已下载临时文件的大小，然后设置下载下载的Range: `bytes=${preSize}-`，下载完成后将临时文件以追加的方式合并至目标文件，这样就最终的结果就可以拼接成一个完整的文件。
![](../../../images/article/react-native/8.jpg)

下载的任务列表、状态和进度等信息可以通过AsyncStorage进行持久化存储，并在UI层次进行展示。再次打开APP如果存在状态是未完成的任务，在wifi环境下就可以继续下载了。

## 关键代码示例
### 预处理阶段
在下载前预创建目标文件，并将已有的临时文件写入到目标文件中，这样得到的新文件的大小作为本地请求Range参数的起始点，当然第一次开始是preSize的大小是0。
```
// 目标地址
const filePath = 'xxxxx`; 
// 临时文件
const tmpFilePath = 'xxxxx.tmp' 

// 预创建文件
if (!await fs.exists(filePath)) {
    await fs.createFile(filePath, '', 'utf8');
}

// 将临时文件合并至正式文件
if (await fs.exists(tmpFilePath)) {
    let tmpFile = await fs.stat(tmpFilePath);
    tmpFile && await fs.appendFile(filePath, tmpFilePath, 'uri');
    // 删除临时文件
    await fs.unlink(tmpFilePath)
}

// 获取已下载文件大小 确定继续下载文件的范围
let fileStat = await fs.stat(filePath);
const preSize = fileStat.size;
```

### 下载阶段
下载阶段可以设置RNFetchBlob对应参数fileCache和Header信息
```
RNFetchBlob.config({
    path: tmpFilePath,
    fileCache: true, // 流式下载
}).fetch('GET', url, {
    Range: `bytes=${preSize}-` // 从未下载部分开始下载
}).progress((received, total) => {
    console.log('progress', received / total)
}).then((result) => {
  // 下载成功
}).catch((error) => {
  // 下载失败
})
```

### 下载后处理
下载后需要最后将文件追加至目标文件，并最好对最终文件的大小进行校验，和清除临时文件
```
await fs.appendFile(filePath, res.path(), 'uri');
fs.unlink(tmpFilePath); 

fileStat = await fs.stat(filePath);
// 校验文件大小
if(fileStat.size !== FILE_SIZE){
    // 删除错误文件  
    fs.unlink(fileStat.path)；
}else{
    // 下载成功
}
```

## 可能遇到的问题
### RN-Fetch-Blob 将错误的请求信息存入文件
RN-Fetch-Blob处理文件时不会识别请求的状态吗，如果资源文件的地址范围的是非资源文件而是一些4xx、5xx的异常状态码时，它会简单粗暴地将报错信息直接写入文件，不会报错。

### 请求的范围越界问题
举个例子如果目标文件的大小是1024个字节，那么有效的范围是Range: bytes=0-1023，如果出现范围越界的问题接口将返回416 Requested Range Not Satisfiable （请求的范围无法满足）状态码 。同样RN-Fetch-Blob也会把这一状态码的报错信息直接写入文件而不会报错。

### 下载是内存占用过高问题
RN-Fetch-Blob虽然采用流式下载，但是下载过程中文件却也会占用大量的内存资源，过大的文件，可能因为内存占用过高而导致异常，可以将下载任务按照指定的大小拆分多个下载任务，每个任务指定不同的Range Header，最后拼接在一起，这样就可以避免单个大文件下载占用较大的内存问题。

### IOS 沙盒路径问题
这里遇到了一个很严重的问题，IOS APP更新后发现所有已下载的文件都找不到了。原来文件下载后通过AsyncStorage存储了文件完整的绝对路径，而IOS每次更新后都会变化新的沙盒根目录，所以导致原本保存的文件路径不存在，解决办法就是每次重新沙盒根目录。

## 参考资料
- [HTTP Header Range](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Range)
- [Use rn-fetch-blob to download](https://viblo.asia/p/use-rn-fetch-blob-to-download-background-and-resume-a-file-in-react-native-on-ios-and-android-3P0lP4Wvlox)
- [iOS沙盒路径变化的说明详解](https://www.shuzhiduo.com/A/amd0MX7Wzg/)