---
layout: git
title: 文件名大小写不敏感
date: 2019-10-16 08:34:14
categories: 
- Git
---

最近在开发的时候遇到了一个问题，在修改了文件名称的大小后提交到git仓库，但是其他人在拉取后仍然是之前的名称导致项目内的一些资源引入报错，非常奇怪。最后发现原来是git对于文件名称大小写不敏感的问题导致的，真的是害人不浅。
<!-- more -->

## 为什么git对文件名不敏感

Window和Macos操作系统的文件系统就是不区分文件大小写的,为了兼容。

## 解决办法

- 使用git命令改变配置让其识别大小写

```git
git config core.ignorecase false
```

- 使用git mv命令重命名指定文件

```git
git mv fileName newFileName
```
