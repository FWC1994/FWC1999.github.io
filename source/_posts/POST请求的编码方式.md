---
title: POST请求的编码方式
date: 2020-02-25 08:03:45
tags: 
- POST
categories: 
- 前端
---
postman我想每个人都使用过，最近在使用的时候考虑到一个问题，postman在发POST请求的时候可以选择form-data、x-www-form-urlencode、raw、binary多种类型，那么这几种类型有什么区别呢？发送的数据在后端解析的时候看到的是什么样子的？
<!-- more -->
## 背景知识
我们都知道GET和POST是HTTP协议中两个非常常见的请求方式，GET方式是将传递的数据通过URL的方式发送至服务端，但是由于不同的浏览器和服务端对于URL的长度都是有一定的限制的，所以GET方式能传递的数据也是有限的。POST方式发送的数据则是放到HTTP请求头消息体中，所以能够发送更多的数据，所以需要通过请求头中的content-type来告诉服务端，通过什么样的方式来识别消息体中的数据。POST请求常见的几种消息体是:
1. application/x-www-form-urlencoded
2. multipart/form-data
3. application/json

## 编码方式对比
### x-www-form-urlencode
这是最常见一种POST提交数据的方式，浏览器的原生 form 表单如果不指定enctype默认使用的就是x-www-form-urlencode。这种方式的优点是提交数据是对参数中key和value都进行URL编码，所以大部分的服务端都能很好的兼容。我们看到的请求的content-type和参数时这样的：
```
content-type: application/x-www-form-urlencoded

key1=value1&key2=value2&key3=value3
```
目前发现的一点点不好的地方就是经过编码后的数据，nodejs服务端koa2解析出来的value都是字符串类型的，所以需要对获取到的数据进一步进行解析处理。

### multipart/form-data
这种提交数据的方式通常用来进行文件上传，浏览器的原生 form 也支持这种格式，只需要将enctype属性设置为multipart/form-data即可。我们看到的请求的content-type和参数时这样的：
```
content-type: multipart/form-data; boundary=----WebKitFormBoundarymCFJteOJYRhT1E1B

------WebKitFormBoundaryu58HK8Afw4BLZzLJ
Content-Disposition: form-data; name="file"; filename="2020-02-14.geojson"
Content-Type: application/octet-stream


------WebKitFormBoundaryu58HK8Afw4BLZzLJ--
```

### application/json
这种方式是将要传递给后端的数据以json字符串的格式进行传输，目前后端对于json的解析已经非常容易，使用application/json的好处就是对于较复杂的参数能够保存对应的树状结构，对于开发者来说相对更加友好，传递的数据中不论是数组还是对象都能够很好地解析出来。像axios这样的前端请求库默认情况下就是使用这种类型的消息体。
```
content-type: application/json;charset=UTF-8

{"key": "value"}
```

## 如何选择合适的编码方式
对于这么多的编码方式到底，在实际开发中使用哪种呢~~，对于后端来说，开发的接口肯定要考虑接口的通用性。最后能支持多种content-type类型，避免前端调用的同学由于不知详情导致调用失败。





