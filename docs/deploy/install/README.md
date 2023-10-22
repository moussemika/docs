# 环境准备

## git

百度即可，不必多说

## nodejs

要求版本至少为 16+，[安装地址](https://nodejs.org/en)

```bash
# 设置 npm 国内镜像源
npm config set registry https://registry.npmmirror.com
# 全局安装 pnpm
npm i pnpm -g
# 全局安装 pm2（可选）
npm i pm2 -g
# 设置 pnpm 国内镜像源
pnpm config set registry https://registry.npmmirror.com
```

## redis

要求版本至少为 5.x

### linux 安装

linux 可通过官方仓库直接进行安装: [redis 官方仓库](https://github.com/redis/redis/releases)

### windows 安装

windows 官方仓库版本较低，可通过此地址下载较高版本 `redis`: [tporadowski-redis](https://github.com/tporadowski/redis/releases)

### docker 安装

如果你的设备上安装了 docker，也可以直接通过 `docker` 进行安装：

```bash
docker run -d -p 6379:6379 --name bot-redis -v /usr/data/redis:/data redis --appendonly yes
```

## go-cqhttp

adachi-bot 目前针对 [go-cqhttp](https://docs.go-cqhttp.org/) 进行了对接，需要通过 [go-cqhttp](https://docs.go-cqhttp.org/) 开启**正向 ws 通讯**来得以正常工作。

::: tip
这个[空间隙缝](../../extra/README.md)一样的东西刚刚钻进去一个永远十七岁的少女，要不要进去看看？
:::