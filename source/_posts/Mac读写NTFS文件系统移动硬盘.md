---
title: Mac读写NTFS文件系统移动硬盘
date: 2019-12-03 12:00:49
tags: 
- Mac
- NTFS
categories: 
- Linux
---
NTFS是windows操作系统专用的文件系统格式，所以在Mac连接NTFS格式的U盘或移动硬盘只能读不能写。要想在Mac上面毫无障碍的读写NTFS格式移动硬盘通常是安装NTFS 支持软件如：Paragon NTFS for Mac、Tuxera NTFS for Mac、NTFS for Mac 助手等，但是这些软件都是收费的。作为一名程序员怎么可能为了使用某个辅助软件而去充值呢-v-，经过搜索发现Mac系统是支持对NTFS格式文件进行读写的，但是由于微软的限制，水果公司把这个功能隐藏了，通过命令行的方式可以重新打开该功能。

<!-- more -->

<style>
img {
  width: 400px;
}
</style>

## Mac挂载NTFS硬盘
Mounty for NTFS是一个macOS读写NTFS硬盘的开源工具，经过尝试不太好用，但是查看说明发现里面所做的工作就是将连接的NTFS格式硬盘以读写的模式挂载到磁盘的一个目录上。

- 查看磁盘名称

```
df -h
```

- 根据空间的大小和顺序找出连接的移动硬盘

```
Filesystem      Size   Used  Avail Capacity iused               ifree %iused  Mounted on
/dev/disk1s1   113Gi   91Gi   19Gi    83% 1911124 9223372036852864683    0%   /
devfs          189Ki  189Ki    0Bi   100%     654                   0  100%   /dev
/dev/disk1s4   113Gi  2.0Gi   19Gi    10%       2 9223372036854775805    0%   /private/var/vm
map -hosts       0Bi    0Bi    0Bi   100%       0                   0  100%   /net
map auto_home    0Bi    0Bi    0Bi   100%       0                   0  100%   /home
/dev/disk1s3   113Gi  499Mi   19Gi     3%      32 9223372036854775775    0%   /Volumes/Recovery
/dev/disk2s1   466Gi  169Gi  296Gi    37%  218903           310729882    0%   /Users/xxx/Disk
```

- 先将该磁盘从系统中卸载

```
sudo umount /dev/disk2s1
```

- 在本地新建挂载目录

```
mkdir ~/mnt
```

- 将移动硬盘挂载到挂载目录

```
sudo mount -t ntfs -o rw,auto,nobrowse /dev/disk2s1 ~/mnt
```

- 查看结果

打开开挂载的目录就能正常的添加和删除文件了
```
open ~/mnt
```

## 参数说明
- -t ntfs # 执行要挂载的分区文件系统格式
- -o # 执行挂载的选项
- rw # read-write，以读写的方式挂载
- auto # 自动检测文件系统,此参数可以省略
- nobrowse # 这个选项非常重要，因为这选项指明了在finder里不显示这个分区，只有打开了这个选项才能将磁盘以读写的方式进行挂载
- /dev/disk2s1 # 要挂载的分区，也就是我们在mount命令中看到的盘符
- ~/mnt # 挂载点











