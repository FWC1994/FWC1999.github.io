---
title: Promise.all前端http请求并发控制
date: 2019-10-23 07:20:29
tags: 
- Promise
- Javascript
categories: 
- 前端
---
浏览器对于同一个域名下的请求的并发有一定的限制，这个限制一般在2-8个左右。不同浏览器，不同http协议允许的网络请求资源数是不一样的。一旦某域名同一时间的并发请求数量过多会导致后面的请求pending住，影响正常的网站交互和性能。所以对于一些高并发http请求的场景做并发控制是十分有必要的。
<!-- more -->

## 场景

- 文件切片上传
针对较大文件的上传需要采用分片上传的方式，将一个文件切割成小的分片然后分批上传。
- nodejs 爬虫
为了避免爬虫被识别封IP，往往要控制爬虫的请求并发量，毕竟"偷拿"别人东西还是要低调点


## Promise.all实现并发控制
Promise.all可以将多个Promise实例包装成一个新的Promise实例，即可以同时发送多个http请求然后所有的请求都返回后才会返回一个数组，利用Promise.all 和异步函数的递归调用就可以实现并发控制。实现代码如下：
``` javascript
let jobList = [1,2,3,4,5,6,7,8,9,10] // 待处理异步任务
const LIMIT = 2 // 并发数限制

// 任务处理异步函数
function asyncHandle(val){
    return new Promise((resolve, reject) => {
        // 此处处理异步业务逻辑
        setTimeout(() => { 
            resolve(val)
        },  Math.random()*2000)
    })
}

// 流程控制异步函数
function asyncFun(val) {
    return asyncHandle(val).then((res) => {
        console.log(`正在执行的任务:${val}`)
        if(jobList.length > 0){
            return asyncFun(jobList.shift())
        }else{
            return val
        }
    })
}

let asyncPool = []
// 初始化第一批任务列表 TODO: 判断jobList长度是否大于LIMIT
for(let i = 0; i < LIMIT; i++){
    let job = jobList.shift()
    asyncPool.push(asyncFun(job))
}

Promise.all(asyncPool).then((res) => {
    console.log('done!',res)
}).catch((e) => {
    console.error(e)
})
```

运行结果：
```
正在执行的任务:1
正在执行的任务:2
正在执行的任务:3
正在执行的任务:5
正在执行的任务:4
正在执行的任务:6
正在执行的任务:8
正在执行的任务:7
正在执行的任务:10
正在执行的任务:9
done!
Array(2) [9, 10]
```
从结果可以看出尽管执行了10个异步函数，但最终Promise.all最终的返回结果中只有两个，这取决于并发的个数，异步函数的返回结果为每个任务执行"线程"最终的结果。不过也可以通过另外一个变量收集每个异步函数的执行结果。

## 其他方案
另外有一些npm 的库可以使用
- [tiny-async-pool](https://www.npmjs.com/package/tiny-async-pool)
- [tiny-async-pool](https://www.npmjs.com/package/es6-promise-pool)
- [p-limit](https://www.npmjs.com/package/p-limit)


