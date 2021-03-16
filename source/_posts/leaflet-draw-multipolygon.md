---
title: Leaflet.draw 无法编辑multipolygon类型多边形 解决方法
date: 2018-06-20
id: 'leaflet-draw-multipolygon'
tags: 
- Leaflet
categories: 
- WebGIS
---

## 问题说明
在做面要素的编辑的时候，当对multiploygon类型的面要素进行编辑的时候，出现如下错误：
```
TypeError: Cannot read property 'lat' of null
```
通过查看github issues发现Leaftlet.Draw插件并不支持multipolygon类型的要素
https://github.com/Leaflet/Leaflet.draw/issues/268

<!-- more -->

## 解决方法
通过测试发现可以通过将multipolygon拆分成多个polygon要素的方法可以解决这个问题
```
function multiPolygon2polygons (multiPolygon){
    if(multiPolygon.type !== 'MultiPolygon'){
        return
    }
    var polygons = [];
    multiPolygon.coordinates.forEach((item)=>{
        var polygon = {
            type: "Polygon",
            coordinates: []
        };
        polygon.coordinates = item;
        polygons.push(polygon)
    });
    return polygons;
}
```

有时候原始数据可能还是需要保存成multipolygon类型的数据 这时就需要再讲拆分的polygons合并成一个multipolygon

合并方法如下：
```
function polygons2MultiPolygon(geoJson) {
    var newGeoJson = {
        type: "FeatureCollection",
        features: [{geometry: {coordinates: [], type: "MultiPolygon"}, type: "Feature", properties: {}}]
    };
    geoJson.features.forEach((item) => {
        if(item.geometry.type === "Polygon"){
            newGeoJson.features[0].geometry.coordinates.push(item.geometry.coordinates);
        }else{
            item.geometry.coordinates.forEach((item) => {
                newGeoJson.features[0].geometry.coordinates.push(item);
            })
        }
    })
    return newGeoJson;
}
```