---
title: 开始 React Native 开发之旅
date: 2020-10-22 00:00:00
categories: 
- React Native
---

随着移动互联网时代的到来，各式各类网页上的内容，聚焦到一个一个手机上的App中，而且更新迭代的速度也是越来越快。在传统的纯原生的开发方式下，需要Android和IOS两个团队分别进行相同的开发内容，而且版本发布需要等待应用审核的周期，速度十分受限。因此衍生出了一些跨端开发的方案：
<!-- more -->

- 基于WebView的Hybrid App（混合应用），利用原生Android和IOS的Web View组件加载前端的资源，开发效率很高，但在一些操作体验上没有原生的应用流畅。
- 利用中间层将前端代码编译成原生代码，如 React Native 与Weex，可以实现近原生体验的App。
- Flutter重写渲染引擎，Google出品，使用的是Dart语言，对于原生开发的或者前端开发都具有一定的上手难度(前端角度)。
在最初的技术选型阶段，从目前的流行程度来看主要围绕React Native和Flutter之中调研，最后优于前端技术栈主要是React，团队成员上手较为容易，且支持热更新特性，最终选择了React Native。

## React Native简介

![](../../../images/article/react-native/1.png)

React Native是Facebook与2015年3月发布的专注于移动端App发开的框架，框架在React框架的基础上，底层通过对IOS和Android平台原生代码的封装和调用，通过一套前端的代码就可以生成Android和IOS应用，在性能和体验上远胜于基于H5开发方式。

React Native最新版本为0.63，最低支持IOS10、Android4.1，到目前为止Github Star数量已经达到90.8K，而且React Native周边的一些工具库也是非常很完善，要实现一个App所需要的一些基本功能，都有相应的解决方案。

目前京东、QQ空间、手机QQ（Android）、手机百度等App均使用了React Native作为技术方案，当然也有一些曾经的重要的贡献者Airbnb放弃了React Native而重新回到了原生的开发中,放弃的原因可以阅读[《Airbnb: React Native 从选择到放弃》](https://juejin.cn/post/6844903623080542216)。

## React Native开发体验总结
基于React Native框架，我们团队重构了微师App，因为一些功能目前阶段还只能在原生端进行实现，所以采用了React Native 打包JSBundle后集成是原生代码的混合开发模式。不得不说相较与之前Webview的方式，新版App在用户体验上有了很大的提升，可扫码下载体验。
![](../../../images/article/react-native/2.png)

总体来说React Native具有以下优点：

1. 应用用户体验接近于原生开发
2. 社区活跃，基本遇到的问题 都能找到相应的解决方案
3. 支持热更新，快速迭代
4. 使用 React 对于前段开发者较为友好

但是也存在以下不可回避的问题：

1. 开发者除了React Native开发的技能，在一些混合开发场景下还需要掌握一定的Android和IOS开发技能
2. React Native原生动画实现起来较为复杂，且流畅度不是很高

我们的经验是，当发现一些开源组件有一些奇奇怪怪的问题，或者需要一些成熟的解决方案的时候，要利用好github这一资源，在Issue中，大部分的问题可能其他人早就遇到并有解决方案了。另外，要与公司内原生Android和IOS的同事，处好关系。因为对这项目的进行你会发现，很多地方任然要回归到原生的方案进行解决~

## 开始 React Native 开发之旅
这篇文章仅仅介绍一些React Native的介绍，和团队在使用中切实的一些体会，后续将会以系列的博客的形式，由浅入深，从原理、基础组件、布局到本地存储、热更新等分享React Native开发过程的一些技术点。