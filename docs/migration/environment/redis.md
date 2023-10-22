# redis 版本变更

由于 `redis` 第三方包版本升级，现要求 `redis` 版本至少为 `v4+`。

## linux 安装

linux 可通过官方仓库直接进行安装: [redis 官方仓库](https://github.com/redis/redis/releases)

## windows 安装

windows 官方仓库版本较低，可通过此地址下载较高版本 `redis`: [tporadowski-redis](https://github.com/tporadowski/redis/releases)

## docker 安装

如果你的设备上安装了 docker，也可以直接通过 `docker` 进行安装：

```bash
docker run -d -p 6379:6379 --name bot-redis -v /usr/data/redis:/data redis --appendonly yes
```