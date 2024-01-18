---
sidebar: auto
---

# 部署 Adachi 所适配的实现端的正确姿势

Adachi-BOT 目前已经接入了 [onebot-11 标准](https://github.com/botuniverse/onebot-11)，基于 OneBot-11 标准的实现端均可以使用，可以在[这里](https://onebot.dev/ecosystem.html#onebot-%E5%AE%9E%E7%8E%B0-1)查看。

这里以 [go-cqhttp](https://docs.go-cqhttp.org/) 为例。

## qsign

qsign 是一个神奇的 Sign API，由 ~~[fuqiuluo/unidbg-fetch-qsign](https://github.com/fuqiuluo/unidbg-fetch-qsign)~~ 提供。  
原作者因不可抗力问题已删库，目前这个方式还能坚持多久还是未知数。

虽然讲的是实现端的部署，但 qsign 是一个绕不开的工具，不使用 `ntqq` 实现端或 `qsign` 时登录账号大概率会喜闻乐见的看到如下报错:

```text
登录失败: 请前往QQ官网im.qq.com下载最新版QQ后重试，或通过问题反馈与我们联系。 Code: 45
```

如果你使用的是 [OpenShamrock](https://github.com/whitechi73/OpenShamrock) 等基于 `ntqq` 的实现端，可跳过此节内容。

## 环境准备

1. 安装 `jdk1.8` 环境，这个百度都有。
2. 下载 [1.1.9](https://github.com/adachi-team/docs/releases/latest/download/1.1.9.zip) 版本的编译包，下载后解压至一个目录。（注：如果下载速度缓慢或无法下载，请使用 GitHub 下载代理工具）。

## 部署

打开 `txlib` 目录后这里有多个版本，`go-cqhttp v1.2.0` 仅支持使用 `8.9.63` 版本，其他的例如 [onebots](https://github.com/lc-cn/onebots) 则对版本无要求。

无特殊需要的情况下最稳定的版本依然是 `8.9.63`，个别 QQ 账号会提示版本过低，此时需要选择更高版本的 `txlib`。

这里以 `8.9.63` 版本为例，其他版本配置基本相同。

进入 `txlib\8.9.63` 目录，打开 `config.json` 进行修改。

- `server.port`: 修改为你希望 qsign 所运行的端口
- `key`: 修改为随意数字，不修改也行，记住它的值
- `auto_register`: 设置为 `true`

回到根目录，执行命令启动 qsign:

```bash
# linux
bin/unidbg-fetch-qsign --basePath=txlib/8.9.63
# windows
bin\unidbg-fetch-qsign.bat --basePath=txlib\8.9.63
```

未打印可见报错即表示启动成功。

## go-cqhttp

### 下载

`go-cqhttp` 目前最新版本为 `v1.2.0`，下载地址: https://github.com/Mrs4s/go-cqhttp/releases/tag/v1.2.0

需要根据自己环境在 `Assets` 中确定需要下载的编译包。下载完毕后解压至一个目录。

### 部署

切换到解压后的目录，执行命令运行 `go-cqhttp`

```bash
./go-cqhttp
# windows
go-cqhttp.exe
```

执行后将会提示选择需要的通讯方式，这里输入 `2` （正向 Websocket 通信）并回车.

等待片刻后程序将会退出，且在当前目录生成 `config.yml` 配置文件。我们需要对这个配置文件的部分内容进行编辑:

- `account.uin`: 待登录的 qq 号
- `account.password`: 待登录的 qq 密码
- `account.sign-server`: 填入上面 [qsign](#qsign) 部分中所部署的 qsign 服务地址与对应的 key，示例:
```yaml
sign-servers:
  - url: 'http://127.0.0.1:11451'  # 11451 改为刚刚配置的 qsign 服务端口
    key: '1919810'  # 上面 qsign config.json 中的 key 值
```
- `servers.ws.address`: 将 `0.0.0.0:8080` 中的 `8080`，修改为自己期望 go-cqhttp 运行的端口，这里以默认 `8080` 为例。

配置完毕后再次运行上面的启动命令，go-cqhttp 将会开始尝试登录。当显示下面的打印日志时，说明 qsign 已连接成功:

```text
[INFO]: 使用签名服务器 url=http://127.0.0.1:11451, key=1919810, auth=-
```

等待 QQ 成功登陆提示，若此时仍提示 `45 版本过低` 报错，说明此账号已经无法在 `8.9.63` 版本登录，需要 `qsign` 使用更高版本的 `txlib`。

由于 go-cqhttp 仅支持 `8.9.63`，因此需要选用其他的实现端，例如 [onebots](https://github.com/lc-cn/onebots)。

> Windows 用户可尝试使用 [qsign-onekey](https://github.com/rhwong/qsign-onekey) 来解决 go-cqhttp + qsign 的版本过低问题

登陆成功后，前往 `Adachi-BOT` 修改 `config -> base.yml` 配置项内容，以连接到 go-cqhttp 实现端:

```yaml
# go-cqhttp 默认 api 和 event 服务各自独立运行，因此此处两者均需要配置
# 将端口号改为上文中 go-cqhttp 所使用的 ws 端口
wsServer: 127.0.0.1:8080/event
wsApiServer: 127.0.0.1:8080/api
```

启动 Adachi-BOT，显示 `已连接到 xxx 事件服务器` 即代表连接成功。

## 其他实现端注意事项

其他实现端部署时各自参考对应的官方文档部署，部署成功后需要参考**日志打印**或**文档说明**获取到启动后的 `event` 与 `api` 服务地址，分别填入 Adachi-BOT 的 `wsServer` 与 `wsApiServer` 配置项中。

当实现端的 `event` 与 `api` 服务公用同一个地址时，仅填写 `wsServer`，`wsApiServer` 置空即可。

> 别人实现端就给了一个地址，那肯定就是 `event` 与 `api` 服务共用这一个了

示例：

- [onebots](https://github.com/lc-cn/onebots) 可以在启动成功后的日志中得到其 `api` 与 `event` 公用一个服务，服务地址为：`ip:端口号/icqq/qq号/V11`
- [OpenShamrock](https://github.com/whitechi73/OpenShamrock) 可在[官网](https://whitechi73.github.io/OpenShamrock/api/request-response.html#websocket-%E8%AF%B7%E6%B1%82)中得到其有两种服务配置方式:
  - `api` 与 `event` 服务共用，地址: `ip:端口号`
  - `event` 使用 `ip:端口号`，`api` 单独使用 `ip:端口号/api`

# linux 的后台静默部署

不管是 qsign 还是 OneBot 实现，部署后的命令行窗口都不可以关闭。对于 windows 来说这是无关痛痒的问题，但 linux 则需要采取一些小手段。

这里仅以 screen 为例来解决这个问题：

安装 screen（centOS）:

```bash
yum install screen
```

在启动 OneBot 实现或 qsign 之前，先执行命令：

```bash
screen -S 服务名称
```

之后会进入一个新的视窗，在此处执行 OneBot 实现或 qsign 的启动命令

之后通过快捷键 `ctrl+a+d` 快捷键退出当前视窗，以同种方式启动另一个服务

再次进入视窗时可以执行：

```bash
screen -r 服务名称
```

一些其他 screen 命令可以参考：[screen 命令](https://www.runoob.com/linux/linux-comm-screen.html)
