---
sidebar: auto
---

# 部署 Adachi 所适配的 go-cqhttp 的正确姿势

## go-cqhttp

Adachi-BOT 目前与 [go-cqhttp](https://docs.go-cqhttp.org/) 单独对接。鉴于 qq bot 的当前环境，未来可能实现对 `matrix` 协议的对接。

### 下载

go-cqhttp 目前存在两个版本，稳定版和开发版，下载地址分别如下：

- 稳定版：[v1.1.0](https://github.com/Mrs4s/go-cqhttp/releases/tag/v1.1.0)
- 开发版：[v1.2.0](https://github.com/Mrs4s/go-cqhttp/releases/tag/v1.2.0)

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
- `account.sign-server`: 两版本的 go-cqhttp 的此配置项不同，暂时不进行修改，下面 [qsign](#qsign) 部分将会说明。
- `servers.ws.address`: 将 `0.0.0.0:8080` 中的 `8080`，修改为自己期望 go-cqhttp 运行的端口，需要与 `Adachi-BOT` 的配置项 `base.yml => wsServer` 的端口所对应。

配置完毕后再次运行上面的启动命令。go-cqhttp 将会开始尝试登录，此时根目录下会生成一个 `device.json` 设备文件，对于稳定版 `go-cqhttp`，文档下方将会用到这个文件。

现在回到正在进行登录的命令行窗口，如果不出意外，那么就一定会出意外了。你将会喜闻乐见的在窗口中看到一行：

```text
登录失败: 登录失败，请前往QQ官网im.qq.com下载最新版QQ后重试，或通过问题反馈与我们联系。 Code: 45
```

那么就得不得不配置下面的 `qsign` 了。 ~~如果你真的运气很好登陆成功了，那么也可以忽略这一步，只是这种幸运不会持续太久就是了~~

## qsign

qsign 是一个神奇的 Sign API，由 ~~[fuqiuluo/unidbg-fetch-qsign](https://github.com/fuqiuluo/unidbg-fetch-qsign)~~ 提供。  
原作者因不可抗力问题已删库，目前这个方式还能坚持多久还是未知数。

## 环境准备

1. 安装 `jdk1.8` 环境，这个百度都有。
2. 针对上面 go-cqhttp 的稳定版和开发版，这里我们会用到的两个版本的编译包：[1.1.0](https://github.com/adachi-team/docs/releases/latest/download/1.1.0.zip)、[1.1.9](https://github.com/adachi-team/docs/releases/latest/download/1.1.9.zip)。对应关系为 `稳定版 => 1.1.0`、`开发版 => 1.1.9`，根据需求取其一即可，下载后解压至一个目录。（注：如果下载速度缓慢或无法下载，请使用GitHub下载代理工具）。

## 部署

1.1.0 和 1.1.9 的部署方式不尽相同，这里分开说明。

### 1.1.0

首先进入 `txlib\8.9.63` 目录，将 `config.json => server.port` 修改为你希望 qsign 所运行的端口。

然后回到根目录，执行命令启动 qsign:

```bash
# windows 下将所有 / 改为 \
bin/unidbg-fetch-qsign.bat --host="0.0.0.0" --port=11451 --count=3 --library=txlib/8.9.63 --android_id=45d4fa9c393ed6fb
```

需要对命令中的一些部分稍作修改：

- `server.port`: 改为刚刚在 `config.json` 中设置的内容
- `count`: 并发数，如果希望多个 go-cqhttp 连接，则设置高一些
- `android_id`: 打开上面 go-cqhttp 稳定版中根目录中生成的 `device.json`，找到 `android_id` 属性，将属性值填入此处

启动成功后，回到 go-cqhttp 的目录，打开 `config.yml`，修改 `account.sign-server` 的内容：

```yaml
# 11451 改为刚刚配置的 qsign 服务端口
sign-server: 'http://127.0.0.1:11451'
```

### 1.1.9

同样进入 `txlib\8.9.63` 目录，打开 `config.json` 进行修改。

- `server.port`: 修改为你希望 qsign 所运行的端口
- `key`: 修改为随意数字，不修改也行，记住它的值
- `auto_register`: 设置为 `true`

回到根目录，执行命令启动 qsign:

```bash
# windows 下将所有 / 改为 \
bin/unidbg-fetch-qsign.bat --basePath=txlib/8.9.63
```

启动成功后，回到 go-cqhttp 的目录，打开 `config.yml`，修改 `account.sign-server` 的内容：

```yaml
sign-servers:
  - url: 'http://127.0.0.1:11451'  # 11451 改为刚刚配置的 qsign 服务端口
    key: '1919810'  # 上面 qsign config.json 中的 key 值
```

## linux 的后台静默部署

不管是 qsign 还是 go-cqhttp，部署后的命令行窗口都不可以关闭。对于 windows 来说这是无关痛痒的问题，但 linux 则需要采取一些小手段。

这里仅以 screen 为例来解决这个问题：

安装 screen（centOS）:

```bash
yum install screen
```

在启动 go-cqhttp 或 qsign 之前，先执行命令：

```bash
screen -S 服务名称
```

之后会进入一个新的视窗，在此处执行 go-cqhttp 或 qsign 的启动命令

之后通过快捷键 `ctrl+a+d` 快捷键退出当前视窗，以同种方式启动另一个服务

再次进入视窗时可以执行：

```bash
screen -r 服务名称
```

一些其他 screen 命令可以参考：[screen 命令](https://www.runoob.com/linux/linux-comm-screen.html)

## 后续留言

配置完毕后，再次启动 go-cqhttp 就可以正常登陆了。~~如果还是 45 报错，那么换号或者与 qqbot 说再见吧~~

通常情况下建议部署开发版，稳定版由于仅能使用 `1.1.0` 版本的 `qsign`，较容易被冻结。一旦冻结两次后基本就会永久 `45`，这个号彻底和 qq bot 说再见了。   
而开发版相对来说存活更长久一些。

但不管是哪一种，qq bot 都在生命倒计时了，只能说有缘再见了。
