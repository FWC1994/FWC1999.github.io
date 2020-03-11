---
title: Mapbox GL加载在线瓦片地图
date: 2018-11-18 17:26:45
tags: 
- Mapbox GL
categories: 
- WebGIS
---
由于Mapbox 国内的服务器实在是很不稳定，在某些网络环境下总是无法访问其在线地图，所以需要需要脱离Mapbox平台不在依赖代码里面的accessToken，加载其他的在线瓦片底图。
<!-- more -->
## 修改style配置
Mapbox GL的map对象中的style是一个必需属性，demo中的 
- mapbox://styles/mapbox/streets-v10
- mapbox://styles/mapbox/outdoors-v10
都是一个url形式，其实这个参数也可以传入一个json对象，这个对象定义了地图的可视化样式。我们通过改造这个对象来实现加载其他在线地图的功能
通过Mapbox GL 文档中对于[style reference](https://www.mapbox.com/mapbox-gl-js/style-spec/)的说明作出如下改动:
```js
this.map = new mapboxgl.Map({
    container: 'map', // container id
    style: {
    "version": 8, // Style specification version number. Must be 8.
    "name": "customMap",// A human-readable name for the style.
    "sources": {}, // Data source specifications.
    "layers": [] //Layers will be drawn in the order of this array.
    },
    center: [116.406658,39.912363], // starting position [lng, lat]
    zoom: 9, // starting zoom
})
```
这样设置的目的是为了让地图初始化的时候不去加载任何的图层
## 添加raster资源
Mapbox GL提供了一种Source类型 raster 可以让我们添加瓦片
```js
this.map.addSource('geoq-map-source',
    {
        "type": "raster",
        'tiles': [
            "https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}"
        ],
        'tileSize': 256
    },
)
```
## 添加图层
```js
this.map.addLayer({
    "id": "geoq-map-layer",
    "type": "raster",
    "source": "geoq-map-source",
    "minzoom": 0,
    "maxzoom": 22
})
```
## 添加效果
![](https://yuyi-blog-resource.oss-cn-beijing.aliyuncs.com/images/geoq-blue.jpg)

