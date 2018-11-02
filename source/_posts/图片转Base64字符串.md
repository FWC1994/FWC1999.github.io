---
title: 图片转Base64字符串
date: 2018-11-02 00:41:00
tags: 
- Base64
categories: 
- 前端
---
有些时候，我们需要将图片转换成base64字符串的形式直接插入到前端页面中或者保存起来，所以在这里总结一下图片转base64的方法以及如何对图片进行一定的压缩处理
<!-- more -->
## base64编码原理
Base64本质上是一种将二进制数据转成文本数据的方案。对于非二进制数据，是先将其转换成二进制形式，然后每连续6比特（2的6次方=64）计算其十进制值，总而言之就是每3个原始字符编码成4个字符，如果原始字符串长度不能被3整除，怎么办？使用0来补充原始字符串
以字符串以Hello！！为例，其转换过程为：
![](http://pg60vmpeq.bkt.clouddn.com/base64%E5%8E%9F%E7%90%86.jpg)
Hello!! Base64编码的结果为 SGVsbG8hIQAA 。最后2个零值只是为了Base64编码而补充的，在原始字符中并没有对应的字符，那么Base64编码结果中的最后两个字符 AA 实际不带有效信息，所以需要特殊处理，以免解码错误。

标准Base64编码通常用 = 字符来替换最后的 A，即编码结果为 SGVsbG8hIQ==。因为 = 字符并不在Base64编码索引表中，其意义在于结束符号，在Base64解码时遇到 = 时即可知道一个Base64编码字符串结束。

如果Base64编码字符串不会相互拼接再传输，那么最后的 = 也可以省略，解码时如果发现Base64编码字符串长度不能被4整除，则先补充 = 字符，再解码即可。

解码是对编码的逆向操作，但注意一点：对于最后的两个 = 字符，转换成两个A 字符，再转成对应的两个6比特二进制0值，接着转成原始字符之前，需要将最后的两个6比特二进制0值丢弃，因为它们实际上不携带有效信息。
[原文地址](https://www.cnblogs.com/christychang/p/5988384.html)
## 图片转base64字符串
将图片转成base64原理上就是将图片绘制在canvas，然后再通过canvas的toDataURL方法画布转成base64字符串的过程
具体代码如下：
```javascript
function image2Base64(imgFile, callback){
    var reader = new FileReader()
    reader.readAsDataURL(imgFile)
    var that = this
    reader.onload = function () {
        var result = this.result
        var img = new Image()
        img.src = result
        img.onload = function(){
            // 创建用于压缩图片的canvas
            var canvas = document.createElement("canvas")
            var ctx = canvas.getContext('2d')
            var width = img.width
            var height = img.height
            canvas.width = width
            canvas.height = height
            //透明背景
            ctx.fillStyle="rgba(255,255,255,0)"; 
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(img, 0, 0, width, height)
            // 第二个参数为1 不进行压缩处理
            var base64 = canvas.toDataURL('image/png', 1)
            callback(base64)
        }                                     
    }
}
```

## 总结
将图片装换成base64进行保存有利有弊，好处是可以直接将base64字符串保存到页面中避免了网络传输所损耗的时间。
缺点是很明显将二进制文件转换成base64字符串会增加文件的大小。

所以通常情况下会把一些图表类型的小图片文件转换成base64进行直接显示。

