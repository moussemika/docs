# 内置指令

严格来讲，所有指令都有插件提供。在 `Adachi-BOT` 中，内置了三个插件：`@help`、`@management`。
它们分别用于提供**使用帮助**、**bot 管理**的功能。

下面将分别对两个内置插件的指令做出说明（均以默认指令起始符 `#` 和默认指令名为例）

## @help 插件

### 帮助

```text
#help
#help -k
```

列举当前用户权限允许使用的全部指令，可通过修改 `config/directive.yml => helpMessageStyle` 来修改展示效果，
共有**文本**、**转发消息**和**图片**三种展示形式。

拥有可选参数 `-k`，可以查看所有指令的 `cmdKey` 值，供后续指令使用。

### 详情

```text
#detail 1
```

查看指令的详细信息，这些详细信息由插件开发者提供，若未提供则提示 “该指令暂无更多信息”

拥有参数 `指令序号`，填写 `help` 指令中提供的指令序号。

### 联系bot持有者

```text
#call bot出问题啦
```

通常由用户使用，可以通过此指令向 bot 主人 qq 发送反馈消息。例如

默认情况下，每人每天可以使用 `3` 次，通过 `config/directive.yml => callTimes` 修改次数。

## @management 插件

### 管理设置

```text
#manager 114514191
#unmanaged 114514191
```

设置/取消 bot 管理员， 管理员是仅次于 `master（bot主人）` 的权限身份。

默认情况下基本所有的管理命令均会对管理员开放，可通过 `commands.yml => 各指令的 auth 属性` 来修改这一默认行为。

### 封禁用户

```text
#ban u114514191
#ban g114514191
#unban u114514191
#unban g114514191
```

封禁或解禁用户/群组。被封今后的用户或群组无法再触发任何 bot 指令。

参数为用户 qq 或群号，当为用户 qq 号时，需要携带标识符 `u`，反之为 `g`。

### 指令权限

```text
#limit u114514191 adachi.call on
#limit u114514191 adachi.call off
#limit g114514191 adachi.call on
#limit g114514191 adachi.call off
```

放行或禁用用户/群组某一指令的使用权限。

具有三个参数：

- 目标用户 qq 或群号，同理使用 `u` 或 `g` 标识符区分
- 指令的 `cmdKey`，使用上面的帮助质量 `#help -k` 查看
- 开启或关闭键，on 为放行，off 为禁用

### 操作冷却

```text
#int u114514191 3000
#int g114514191 3000
```

设置目标用户/群组的指令响应间隔时间，在响应间隔时间内尝试触发指令则不会得到响应。

默认情况下，私聊的响应间隔时间为 2000ms，群聊为 1500ms。
通过配置项 `directive.yml => groupIntervalTime` 与 `directive.yml => privateIntervalTime` 可以分别设置私聊与群组的响应间隔时间。

而此指令可以单独针对具体用户/群组具体处理，其优先级高于群组与私聊的响应间隔时间。

具有两个参数：

- 目标用户 qq 或群号，同理使用 `u` 或 `g` 标识符区分
- 响应间隔时间，单位毫秒

### 刷新配置

```text
#refresh
```

热重载配置项，无需重启项目即可使对配置项的修改生效。

### 更新bot

```text
#upgrade
#upgrede -f
```

热更新 bot 源码，代替用户执行 `git pull` 操作。

具有可选参数 `-f`，默认情况下遇到代码冲突问题时，更新将会失败。携带 `-f` 则会强制覆盖更新，慎重使用。

> 该指令仅支持 pm2 与 docker 模式启动的 bot，`pnpm start` 方式启动的 bot 执行将会报错。

### 重启bot

```text
#restart
```

重启 bot。

> 该指令仅支持 pm2 与 docker 模式启动的 bot，`pnpm start` 方式启动的 bot 执行将会报错。

### 重载插件

```text
#reload
#reload music
```

重载插件源码。默认情况下对全部插件进行重载。

具有可选参数，用于指定具体重载的插件名称，携带参数后不再重载全部插件。

### 更新插件

```text
#upgrade_plugins
#upgrade_plugins music
#upgrade_plugins -f music
#upgrade_plugins -s music
#upgrade_plugins -f -s music
```

检查并热更新插件源码。默认情况下对全部插件进行热更新，并重载更新成功的插件。

具有三个参数：

- -f，可选，覆盖本地修改强制更新
- -s，可选，不会自动重载更新成功的插件
- 指定具体更新的插件名称，携带参数后不再尝试更新全部插件。