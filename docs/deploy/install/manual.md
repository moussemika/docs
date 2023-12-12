# 手动部署

::: tip
如果你希望在 Windows 中部署，[这篇文章](./windows.md)可能是更好的选择
:::

## 前置

首先你需要启动一个适配 OneBot v11 的实现端，例如[go-cqhttp](https://docs.go-cqhttp.org/)、[lc-cn/onebots](https://github.com/lc-cn/onebots)，更多的可在 [OneBot 生态](https://onebot.dev/ecosystem.html#onebot-11-10-cqhttp) 查看。

在实现端中开启 **正向 websocket**，配置 **正向 websocket** 服务地址。并检查是否正常启动了 `redis` 数据库。

## 拉取项目源码

切换到你所希望存放 bot 的目录，拉取项目源码

```bash
git clone https://mirror.ghproxy.com/https://github.com/SilveryStar/Adachi-BOT.git
```

进入项目根目录，安装项目依赖

```bash
cd Adachi-BOT
pnpm install
```

## 初始化

于根目录下执行命令来启动并初始化项目

```bash
pnpm start
```

在看到终端打印配置文件创建成功的提示后，项目根目录下将会生成一个 `config` 目录，这是 `Adachi-BOT` 的配置文件所在目录。

打开 `config/base.yml`，修改 `master` 为主人 qq 号码，并根据实现端所提供的**正向 websocket 服务**地址，按需填入 `wsServer` 与 `wsApiServer`。

一般情况下，其他配置文件内容无需修改。你同样可以参考 [配置项](../../config/base.md) 来酌情修改。

## 启动项目

再次于根目录下执行启动命令

```bash
pnpm start
```

一切正常的话，终端将会持续打印日志。并将在主人 qq 中收到 bot qq 发来的上线成功提醒。

## 后台托管启动

使用上述方式启动的项目，终端一经关闭 bot 服务则被停止。改为执行如下命令来实现后台托管启动

```bash
pnpm serve
```

之后就可以安全将终端关闭，且不会影响 bot 的正常运行。
且此种启动方式允许使用 **restart(重启)**、**upgrade(更新)** 等快捷指令。

下面提供了几种在此模式下的帮助命令

```bash
# 查看终端日志
pm2 log adachi-bot
# 重启项目 
pnpm restart
# 停止项目
pnpm stop
```
