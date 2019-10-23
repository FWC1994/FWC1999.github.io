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
一个典型的场景就是文件上传。针对较大文件的上传需要采用分片上传的方式，讲一个文件切割成小的分片然后分批上传。

## Promise.all实现并发控制
Promise.all可以将多个Promise实例包装成一个新的Promise实例，即可以同时发送多个http请求然后所有的请求都返回后才会返回一个数组，那么如何用Promise.all做这种并发的控制呢？直接贴上代码吧
``` javascript

```

## Vue 3.0变化
- 高级API的变更
除了渲染函数和作用域插槽语法之外的所有内容都将保持不变，这无疑对于广大开发者是一个好消息。

- 源码结构调整
代码模块间解耦，以便使代码更方便进行维护，Vue3.0将会重写，但是源码依然使用TypeScript作为开发语言，相信 TypeScript 的类型系统和 IDE 的支持将让新的代码贡献者更容易做出有意义的贡献。
![新的源代码结构](https://cdn-images-1.medium.com/max/1600/1*H8yM0usFhWYlY6GV2wcrEw.png)

- 改进观察机制
Vue 3.0采用基于代理的观察模式，并提供了相应的API，是状态观察更加清晰明确，可调式

-  其他运行时改进

- 编译器改进
    1. [tree-shaking](https://webpack.docschina.org/guides/tree-shaking/)输出友好
    2. AOT 优化
    3. 错误信息优化
    4. 支持[Source Map](http://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html)
- 支持IE11
## 任重而道远
从尤雨溪的文章中可以看出Vue3.0目前还处于一个规划的阶段，还有一些新的特性还需要进一步验证才能确定下来。但是已经有了一个较为清晰的版本发布的计划，相信在不远的2019年尤神一定会如约带给我们一个惊喜。

