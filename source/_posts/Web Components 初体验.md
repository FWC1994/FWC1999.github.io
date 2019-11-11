---
title: Web Components初体验
date: 2019-11-11 07:57:49
categories: 
- 前端
---
程序员这一群体可以说是最聪明的懒人，总是可以找到最合理的方式让自己的代码最大程度的复用，对于前端er来说，从长远来看建立组件库将会为你的工程项目节省很大的时间成本。但是目前大部分的组件库都是基于特定框架来实现的，如：vue的element ui和iview，react的antd等。这时作为前端游戏规则的制定者W3C坐不住了。制定了Web Components作为前端统一的组件化规范。
<!-- more -->

## 什么是Web Components

官方的描述为："Web Components are a new browser feature that provides a standard component model for the Web"即 Web Components是一个浏览器的新功能，为前端提供了一个标准的组件模型。

这个模型建立的为你的组件创建了一个完全密闭的环境，可以在前端任何地方通过自定义标签的方式引入，开发者不用担心css和js样式和变量的冲突。

## 核心技术

Web Components主要由三个主要技术组成：

- **Custom elements（自定义元素）**: 通过一组JavaScript创建一个自定义标签，并定义了这个标签的属性方法，用户可以在页面的其他位置使用对应组件的标签。

- **Shadow DOM（影子DOM）**: 通过一组JavaScript让你定义的元素可以拥有一个完全密闭的空间。而不用担心与文档的其他部分发生冲突。

- **HTML templates（HTML模板）**: template 和 slot 元素使您可以编写不在呈现页面中显示的标记模板。然后它们可以作为自定义元素结构的基础被多次重用

通常看了这些定义后，大部分人都是懵逼的可能明白了这个东西的大致的作用。但是对于该如何去开发还是一脸茫然，那就接着看一些demo吧。

## 一个简单的Web Components

``` html
<!-- index.html -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Simple template</title>
  <script src="main.js" defer></script>
</head>
<body>
  <h1>Simple template</h1>
  <!-- 定义组件template -->
  <template id="my-paragraph">
    <!-- 样式style标签需要写在内部 才能不被外部环境污染 -->
    <style>
      p {
        color: white;
        background-color: #666;
        padding: 5px;
      }
    </style>
    <!-- 定义slot -->
    <slot name="my-text">My default text</slot>
  </template>

  <!-- 使用自定义组件 -->
  <my-paragraph>
    <span slot="my-text">Let's have some different text!</span>
  </my-paragraph>
</body>
</html>

```

``` Javascript
// main.js
// 定义my-paragraph元素
customElements.define('my-paragraph',
  class extends HTMLElement {
    constructor() {
      super();

      const template = document.getElementById('my-paragraph');
      const templateContent = template.content;
      // 创建Shadow DOM节点 
      const shadowRoot = this.attachShadow({mode: 'open'});
      // 自定义节点template添加到影子节点内部
      shadowRoot.appendChild(templateContent.cloneNode(true));
    }
  }
);

```

这样我们就创建了一个Web Components,可以看到创建的Shadow有一个参数mode，可以指定为open、closed 表示外部是否可以通过JavaScript获取 Shadow 的dom节点。

## 兼容性

往往前端每推出一项新的技术，兼容性往往是检验这项技术能否实际应用的一项标准

- Firefox（版本63），Chrome和Opera中默认支持Web Components
- Safari支持许多Web Components功能，但少于上述浏览器
- Edge 的兼容正在实施中
- IE 。。。 估计是够呛

## 总结

不得不说W3C这种想要统一Web组件规范的初心是好的，也有这样的需求，但是从一些demo上来看创建一个组件的API设计的有些繁琐，与vue、react、angular各个框架内的结合还需要验证。默默关注发展吧。

