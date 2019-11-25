---
title: 搭建基于Vue的Mapbox GL开发框架
date: 2018-11-18 15:36:45
tags: 
- Mapbox GL
- Vue
categories: 
- WebGIS
---
接触一些前端的WebGIS Javascript开发SDK,都是大同小异，但是一接触到Mapbox，就被其精美的在线地图，流畅的前端体验，强大的可视化渲染能力所吸引。Mapbox GL使用WebGL渲染地图和图层，这也使得大量数据的可视化在前端的渲染成为了可能，并且具有优秀的体验。所以决定研究一下Mapbox GL的相关开发，并通过博客的形式记录自己的学习历程。
<!-- more -->
## 创建Vue项目开发框架
通过[Vue-CLI](https://cli.vuejs.org/zh/guide/) 创建一个vue webpack 开发模板框架
至于的相关使用 看官网即可
```sh
vue init webpack mapboxgl-learn
```

## 安装Mapbox GL依赖
在项目根目录执行
```sh
npm install --save mapbox-gl
```
## 添加mapboxgl全局变量
为了开发的方便通过webpack添加mapboxgl全局变量
在webpack.base.conf.js文件中通过ProvidePlugin添加自动加载模块
```js
plugins: [
    new webpack.ProvidePlugin({
        'mapboxgl': 'mapbox-gl'
    })
],
```
## 显示地图
- 引入mapbox gl css
在main.js 动态引入css文件 否则一些组件 或默认的样式将无法显示

```js
import '../node_modules/mapbox-gl/dist/mapbox-gl.css'
```

- 配置token

```js
mapboxgl.accessToken = 'pk.eyJ1IjoiMTU4MTA1NzQ4NDUiLCJhIjoiY2ppMmZvc3Z6MDEyZjNxbXVvamZrc2l4eCJ9.L
```
- 创建组件并构造地图
直接贴代码了
```vue
<template>
	<div class="map-container" id = "map"></div>
</template>

<script>
export default {
    name: 'ShowMap',
    data () {
        return {
            map: null,
        }
    },
    mounted() {
        this.initMap()
    },
    methods: {
        initMap: function() {
            this.map = new mapboxgl.Map({
                container: 'map', // container id
                style: 'mapbox://styles/mapbox/dark-v9',
                center: [116.406658,39.912363], // starting position [lng, lat]
                zoom: 9, // starting zoom
            })
        }
    }
}
</script>


<style scoped>
.map-container{
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
}
</style>

```
- 效果如下
![](https://yuyi-blog-resource.oss-cn-beijing.aliyuncs.com/images/1C04F188-542F-4222-810F-7739E932A916.png)