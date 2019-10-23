---
title: 常用postgresql语句
date: 2019-01-11 11:45:49
tags: Postgresql
categories: 
- 数据库
---

总结工作中常用Postgresql语句
<!-- more -->

## 基本查询语句

- 查询所有数据库 

```
\l
```

- 查看指定数据库大小

```
select pg_size_pretty(pg_database_size('g-default'));
```

- 查看所有数据库大小

```
select pg_database.datname, pg_size_pretty(pg_database_size(pg_database.datname)) AS size from pg_database;
```

- 查看数据库所有模式

```
select * from pg_namespace;
```

- 查看指定表大小

```
select pg_size_pretty(pg_relation_size('app.data_viz'));
```

- 查看指定表的索引

```
select relname, indexrelname, idx_scan, idx_tup_read, idx_tup_fetch from pg_stat_user_indexes where relname = 'core.setting' order by  idx_scan asc, idx_tup_read asc, idx_tup_fetch asc;
```

- 查看所有索引

```
select * from pg_stat_user_indexes order by idx_scan asc, idx_tup_read asc, idx_tup_fetch asc;
```


## 数据库对象尺寸函数

| 函数名 | 返回类型 | 描述 |
| :------:| :------: | :------: |
| pg_column_size(any) | int | 存储一个指定的数值需要的字节数（可能压缩过） |
| pg_database_size(oid) | bigint | 指定OID的数据库使用的磁盘空间 |
| pg_database_size(name) | bigint | 指定名称的数据库使用的磁盘空间 |
| pg_indexes_size(regclass) | bigint | 关联指定表OID或表名的表索引的使用总磁盘空间 |
| pg_relation_size(relation regclass, fork text) | bigint | 指定OID或名的表或索引，通过指定fork('main', 'fsm' 或'vm')所使用的磁盘空间 |
| pg_relation_size(relation regclass) | bigint | pg_relation_size(..., 'main')的缩写 |
| pg_size_pretty(bigint) | text | Converts a size in bytes expressed as a 64-bit integer into a human-readable format with size units |
| pg_size_pretty(numeric) | text | 把以字节计算的数值转换成一个人类易读的尺寸单位 |
| pg_table_size(regclass) | bigint | 指定表OID或表名的表使用的磁盘空间，除去索引（但是包含TOAST，自由空间映射和可视映射） |
| pg_tablespace_size(oid) | bigint | 指定OID的表空间使用的磁盘空间 |
| pg_tablespace_size(name) | bigint | 指定名称的表空间使用的磁盘空间 |
| pg_total_relation_size(regclass) | bigint | 指定表OID或表名使用的总磁盘空间，包括所有索引和TOAST数据 |

