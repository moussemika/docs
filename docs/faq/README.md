---
sidebar: auto
---

# 常见问题解答

## 登录报错「群消息发送失败，请检查消息内容」？

QQ 账号在服务器上异地登录易被风控，需要挂机几小时到几天不等，同时注意账号等级过低也会导致该错误。

## 登录报错「当前上网环境异常」？

下载 [链接](https://github.com/mzdluo123/TxCaptchaHelper/releases)中的 apk 文件，在安卓真机上完成滑动验证获取 ticket。

## 登录成功后立刻被踢下线，提示密码已被泄露？

这种情况多为账号等级较低或帐号不活跃导致，修改密码后再次尝试即可。

## 部署后发消息机器人没有回复？

1. `npm run login` 命令仅用于生成 `Docker` 启动所需的设备文件，不具备回复功能，请使用 `npm start` 或 `npm run serve` 。
2. `header` 为空或 # 或 & 时，需要添加双引号，即 `"" "#" "&"` 。
3. 打开 `web console` 查看日志是否存在报错信息，若 `web console` 也无法打开，使用 `pm2 log adachi-bot`（docker
   使用 `docker-compose -tf --tail 100`）
   查看是否有报错信息，若报错信息无法自己解决，可携带报错信息截图向我们的 [官方频道](https://qun.qq.com/qqweb/qunpro/share?_wv=3&_wwv=128&inviteCode=ZcZDq&from=246610&biz=ka)
   反馈。

## 启动时报错「YAMLReferenceError: Aliased anchor not found」？

`header` 为星号时，需要添加双引号 `"*"` 。

## 使用 mys/uid/char/caby/laby 命令时报错「Please login」？

在 `config/cookies.yml` 中填写 Cookies 后，这些命令才能正常使用。此外，应注意该文件的格式：

```yaml
# 正确
cookies:
  - foo

# 错误
cookies: foo
```

## 如何获得米游社 Cookies ？

### PC端

直接访问 [观测枢大地图](https://webstatic.mihoyo.com/ys/app/interactive-map/index.html)（请勿从米游社社区进入），登录后账户点击 F12 ，选中 `Console` 或控制台，输入 `document.cookie` ，回车即可获取。

### 安卓

推荐使用 `via` 浏览器，`edge` 和 `chrome` 也可以使用。浏览器直接访问 [观测枢大地图](https://webstatic.mihoyo.com/ys/app/interactive-map/index.html)（请勿从米游社社区进入），在地址栏粘贴如下代码后回车即可复制 cookie 到剪贴板。

```js
javascript:(function () {
    const textArea = document.createElement('textarea');
    textArea.value = document.cookie;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    alert('已复制cookies到剪贴板');
    document.body.removeChild(textArea)
}())
```

::: tip
获取的 `cookie` **必须** 包含 `cookie_token` 字段才可用于米游社签到。  
如果通过上述的方法获得的 `cookie` 不符合条件，这种多为登录时间过久导致，可以尝试开启浏览器的 **无痕模式** 或 **
隐身模式** 再次尝试，或者尝试退出登录后重新登陆获取 `cookie`。  
`cookie` 获取后不能有任何的**退出登录**操作，否则会当场失效。
:::

粘贴后请留意最前方的 `javascript:` 是否还存在，部分浏览器会自动吞掉这个头导致代码执行失败。

## `git pull` 无法正常更新版本？

如果在使用 `git pull` 后出现如 `error: Your local changes to the following files would be overwritten by merge:`
的错误时，使用下面的命令进行更新：

```bash
git reset --hard
git pull
```

## 命令报错「You can access the genshin game records of up to 30 other people」？

每个 Cookies 每天只能查询 30 次，对于人员较多的群聊，需要使用更多的 Cookies。

## 启动时报错「Error: connect ECONNREFUSED 127.0.0.1:xxxx」？

`Redis` 数据库未启动，建议使用 `Docker` 运行数据库容器：

1. 安装 `Docker` ，见 [菜鸟教程](https://www.runoob.com/docker/centos-docker-install.html)
2. 创建一个存放数据的目录，如 `/usr/data/redis`
3. 运行命令 `docker run -d -p 56379:6379 --name bot-redis -v /usr/data/redis:/data redis --appendonly yes`

## BOT 启动后群聊有反应私聊无回应，终端或日志未输出私聊记录？

检查本地时间是否为标准时间，与真实时间相差较大即会发生这种情况。

## 绑定私人服务后，签到提示尚未登陆 ？

所得的 cookie 缺乏签到所需的必要字段，这种多为登陆时间过久导致，可尝试退出登录后重新登陆获取 `cookie`。

## 使用指令更新、重启等操作时提示 Error: process or namespace not found？

`win-start` 启动方式无法使用上述操作，请改为 `npm start` 方式启动。