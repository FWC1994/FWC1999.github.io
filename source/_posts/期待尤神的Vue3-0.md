---
title: Vue 3.0离我们还有多远
date: 2018-10-06 11:36:29
tags: 
- 尤雨溪
- Vue 3.0
categories: 
- 前端
---
十一的长假已经接近尾声，假期除了各个旅游景点的火爆之外，对于广大前端开发者来说还是有一件令人兴奋和担忧的事情就是尤雨溪在[medium 个人博客](https://medium.com/the-vue-point/plans-for-the-next-iteration-of-vue-js-777ffea6fabf)上发布了 Vue 3.0 的开发路线，更可怕的还是将从头开始重写 3.0。
<!-- more -->
![](http://pg60vmpeq.bkt.clouddn.com/%E8%A1%A8%E6%83%85.jpg)
 都知道前端技术的发展日新月异，Vue近年来也已经发展成为了非常火的前端MVVM开发框架，那么Vue的作者尤雨溪到底是何许人也。
## 尤雨溪
尤雨溪家乡是江苏无锡，距离上海很近。在上海念了三年高中。高中毕业后去了美国念大学，期间用了两天时间打造了HTML5版的[Clear](http://clear.evanyou.me/)

2014年2月，开源了一个前端开发库Vue.js。[Vue 第一周的使用数据以及作者本人使用感受](http://blog.evanyou.me/2014/02/11/first-week-of-launching-an-oss-project/)

2016年9月3日，在南京的JSConf上，Vue作者尤雨溪正式宣布加盟阿里巴巴[Weex](https://www.oschina.net/p/weex)团队，尤雨溪称他将以技术顾问的身份加入 Weex 团队来做 Vue 和 Weex 的 JavaScript runtime 整合，目标是让大家能用 Vue 的语法跨三端。

## Vue 3.0
Vue2.0 已经发布了了两年了，整个Vue的生态系统也已经逐渐成熟，随着前端技术的不断发展ES2015也渐渐被各个浏览器所支持。Vue3.0也将充分利用这一语言的特性打造更加轻巧、快速、权威的vue内核。那么 Vue3.0 将会带来哪些改变呢

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

