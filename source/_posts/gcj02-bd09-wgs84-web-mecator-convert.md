---
title: 火星坐标、百度坐标、WGS-84坐标相互转换及墨卡托投影坐标转经纬度
date: 2016-09-19 14:45:00
tags: 
- 火星坐标 
- 百度坐标
- WGS-84坐标
categories: 
- WebGIS
---

在WebGIS相关的开发中初学者经常弄不清楚百度坐标、WGS-84坐标、火星坐标之间的关系。本人开始也是一知半解，就在网上查阅了一些资料，通过这篇文章相信你会对这三个坐标系将会有更深刻的认识。
并且在后面提供了几种坐标系之间的JavaScript转换方法。
<!-- more -->

## 火星坐标
　　火星坐标是国家测绘局为了国家安全在原始坐标的基础上进行偏移得到的坐标，基本国内的电子地图、导航设备都是采用的这一坐标系或在这一坐标的基础上进行二次加密得到的。

火星坐标的真实名称应该是GCJ-02坐标。最近在知乎上看到关于火星坐标的话题都是充满争议的[知乎文章](https://www.zhihu.com/topic/19649758/top-answers)，感兴趣的同学可以去详细了解一下。

　　基本上所有的国内的电子地图采用的都是火星坐标系甚至Google地图中国部分都特意为中国政府做了偏移。

## 百度坐标
火星坐标是在国际标准坐标WGS-84上进行的一次加密，由于国内的电子地图都要至少使用火星坐标进行一次加密，百度直接就任性一些，直接自己又研究了一套加密算法，来了个
二次加密，这就是我们所熟知的百度坐标(BD-09)，不知道以后其他的公司还会不会有三次加密，四次加密。。。

　　当然只有百度地图使用的是百度坐标

## WGS-84坐标
WGS-84坐标是一个国际的标准，一般卫星导航，原始的GPS设备中的数据都是采用这一坐标系。

　　国外的Google地图、OSM等采用的都是这一坐标。

## 坐标转换
在网上能找到很多关于坐标转化的代码，我把它们整理了一下并改成了JavaScript版本的。
- 百度坐标转火星坐标

```javascript
/*百度坐标转火星坐标*/
x_pi=3.14159265358979324 * 3000.0 / 180.0;
function baiduTomars(baidu_point){
    var mars_point={lon:0,lat:0};
    var x=baidu_point.lon-0.0065;
    var y=baidu_point.lat-0.006;
    var z=Math.sqrt(x*x+y*y)- 0.00002 * Math.sin(y * x_pi);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    mars_point.lon=z * Math.cos(theta);
    mars_point.lat=z * Math.sin(theta);
    return mars_point;
}
```

- 火星坐标转百度坐标

```javascript
x_pi=3.14159265358979324 * 3000.0 / 180.0;
function marsTobaidu(mars_point){
    var baidu_point={lon:0,lat:0};
    var x=mars_point.lon;
    var y=mars_point.lat;
    var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
    var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
    baidu_point.lon = z * Math.cos(theta) + 0.0065;
    baidu_point.lat = z * Math.sin(theta) + 0.006;
    return baidu_point;
}
```

- 地球坐标系(WGS-84)转火星坐标系(GCJ)

```javascript
var pi = 3.14159265358979324;
var a = 6378245.0;
var ee = 0.00669342162296594323;
/*判断是否在国内，不在国内则不做偏移*/
function outOfChina(lon, lat)
{
    if ((lon < 72.004 || lon > 137.8347)&&(lat < 0.8293 || lat > 55.8271)){
        return true;
    }else {
        return false;
    }
}
function transformLat(x,y)
{
    var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * pi) + 320 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0;
    return ret;
}

function transformLon(x,y)
{
    var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * pi) + 40.0 * Math.sin(x / 3.0 * pi)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(x / 12.0 * pi) + 300.0 * Math.sin(x / 30.0 * pi)) * 2.0 / 3.0;
    return ret;
}

function transform(wgLat,wgLon)
{
    var mars_point={lon:0,lat:0};
    if (outOfChina(wgLat, wgLon))
    {
        mars_point.lat = wgLat;
        mars_point.lon = wgLon;
        return;
    }
    var dLat = transformLat(wgLon - 105.0, wgLat - 35.0);
    var dLon = transformLon(wgLon - 105.0, wgLat - 35.0);
    var radLat = wgLat / 180.0 * pi;
    var magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    var sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
    dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
    mars_point.lat = wgLat + dLat;
    mars_point.lon = wgLon + dLon;
}
```

- 经纬度转墨卡托投影坐标

```javascript
/*经纬度转墨卡托投影坐标*/
function lonlatTomercator(lonlat) {
    var mercator={x:0,y:0};
    var x = lonlat.x *20037508.34/180;
    var y = Math.log(Math.tan((90+lonlat.y)*Math.PI/360))/(Math.PI/180);
    y = y *20037508.34/180;
    mercator.x = x;
    mercator.y = y;
    return mercator ;
}
```

- 墨卡托投影坐标转经纬度坐标

```javascript
function mercatorTolonlat(mercator){
    var lonlat={x:0,y:0};
    var x = mercator.x/20037508.34*180;
    var y = mercator.y/20037508.34*180;
    y= 180/Math.PI*(2*Math.atan(Math.exp(y*Math.PI/180))-Math.PI/2);
    lonlat.x = x;
    lonlat.y = y;
    return lonlat;
}
```