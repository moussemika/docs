---
sidebar: auto
---

# 基本配置

项目首次运行时，会在 `config` 目录下生成一系列配置文件，本文将对除 `commands.yml` 外的配置项做出相关解释。
`commands.yml` 的相关配置说明请参考 [指令配置](/config/commands.html)。

## base.yml

bot 运行相关的基本配置。

### wsServer

* 类型: [string][string]
* 缺省值: `127.0.0.1:11451`

`go-cqhttp` 所提供的正向 `websocket` 服务地址，在 `go-cqhttp` 的配置文件中查看。

### master

* 类型: [number][number]
* 缺省值: `987654321`

BOT 持有者（或称主人）的 QQ 账号，唯一指定，拥有 BOT 最高权限。

### inviteAuth

* 类型: `1|2|3`
* 缺省值: `2`

邀请 BOT 入群时，BOT 自动接受入群邀请的权限等级，每个权限等级的对应如下：

* 1: 仅自动接收 **BOT 持有者**的入群邀请。
* 2: 自动接受 **BOT 管理员** 与 **BOT 持有者**的入群邀请。
* 3: 自动接受**被封禁用户外**的所有人的入群邀请。

### logLevel

* 类型: `all|trace|debug|info|warn|error|fatal|mark|off`
* 缺省值: `info`

日志输出等级，等级从前往后依次递减。日志输出会过滤掉比所设置等级更高的等级日志，`all` 输出全部日志，`off` 不输出任何日志。

### atUser

* 类型: [boolean][boolean]
* 缺省值: `false`

BOT 在响应指令时，是否需要 at 用户。部分指令的响应无视本项配置。

### atBOT

* 类型: [boolean][boolean]
* 缺省值: `false`

是否需要在使用指令时 @BOT 账号，只在群聊中生效。@BOT 必须在最前面，例如 `@Adachi-BOT #help`。

### addFriend

* 类型: [boolean][boolean]
* 缺省值: `true`

是否强制要求添加好友后才能使用 BOT，开启后未添加好友时 BOT 将不会响应并提示对方请先添加好友。

### renderPort

* 类型: [number][number]
* 缺省值: `80`

BOT 启动所依赖端口（网页控制台、公共路由等）。

若使用 `docker` 启动，则修改此项后应同步更改 `docker-compose.yml` 中 `port` 的第二个值。

## directive.yml

指令发送的相关配置。

### header

* 类型: `string[]`
* 缺省值: `[ "#" ]`

指令起始符。用于标识 BOT 指令的特殊符号，可配置多项，

例如：当 `header` 数组包含 `#` 时，需使用 `#help` 来触发帮助指令，`help` 会被忽略。如果不想在指令前添加特殊符号，请设置为空数组 `[]` 。

### groupIntervalTime

* 类型: [number][number]
* 缺省值: `1500`

群聊中指令操作冷却时间，单位为毫秒(ms)，不支持小数。

### privateIntervalTime

* 类型: [number][number]
* 缺省值: `2000`

私聊中指令操作冷却时间，单位为毫秒(ms)，不支持小数。

### helpMessageStyle

* 类型: `message|forward|xml|card`
* 缺省值: `message`

帮助信息样式，每个配置的对应解释如下：

* `message` 样式为所有指令以单条消息直接发送。
* `forward` 样式为每条指令为单条消息，并整合为合并转发的形式发送。
* `xml` 样式为所有指令以 xml 卡片的形式进行发送，此方式有一定封号风险，不建议大群使用。
* `card` 以图片形式发送，此种方式发送速度略慢于上面三种，但比较直观。

### fuzzyMatch

* 类型: [boolean][boolean]
* 缺省值: `false`

启用中文模糊匹配。开启后 BOT 会对中文指令进行模糊匹配，要求必须以 `header` 开头且中文指令不得拆开。 

例如在 `header` 配置为 `[ "#" ]` 时，对于`攻略（角色名）`指令，有如下情况：

* `#攻略行秋`、`#攻略 行秋`: 正常触发
* `#行秋攻略`、`#行攻略秋`: 被解析为 `#攻略 行秋` 并正常触发
* `#行攻秋略`: 无法触发，指令头不能被拆分
* `行秋#攻略`: 无法触发，必须以 `#` 起始

需要注意的是，此项与无指令头中文指令（例如 `__攻略` 或 `header` 置空）会发证某些奇妙的化学反应，导致误触率极高.

还是以`攻略（角色名）`指令为例，在 `header` 配置为 `[]` 时，，有如下情况：

* `这个攻略不太靠谱`: 被解析为 `攻略 这个不太靠谱`，并触发指令，导致 BOT 响应：`未找到角色 这个不太靠谱`。

因此如果你有使用无指令头中文指令的需求，请慎重开启此项。

### matchPrompt

* 类型: [boolean][boolean]
* 缺省值: `true`

启用参数校验提示。开启后若指令参数错误，BOT 将会给予提示。

### callTimes

* 类型: [number][number]
* 缺省值: `3`

指令 **联系bot持有者** 每个人一天内可使用的最大次数。

### countThreshold

* 类型: [number][number]
* 缺省值: `60`

用户在一小时使用指令的次数的阈值，按整点计算，如 `13:00~14:00` 。如果用户在过去一小时内使用指令的次数超过了该值，BOT 会向持有者发送私聊信息，提示所有超量使用的用户和使用次数，以便持有者对超量使用指令的用户进行处理。

### ThresholdInterval

* 类型: [boolean][boolean]
* 缺省值: `false`

开启后当用户使用超过 `countThreshold` 所设置的阈值时，本小时内 BOT 将不再响应其指令。

## db.yml

`redis` 数据库相关配置。

### port

* 类型: [number][number]
* 缺省值: `6379`

数据库端口。

> 注意，Docker 启动时修改此值，需同时将 `redis.conf` 中的 `port` 修改为与此处相同的值。

### password

* 类型: [string][string]
* 缺省值: `""`

数据库密码。非必填项，依照个人需求设置。

## mail.yml

用于主动发送邮件的相关功能，使用 `SMTP` 协议发送邮件。

### host

* 类型: [string][string]
* 缺省值: `"smtp.qq.com"`

邮箱服务的主机名或 IP 地址，例如qq服务为smtp.qq.com。

### port

* 类型: [number][number]
* 缺省值: `587`

邮箱服务的端口，配置项 `secure` 关闭时默认 `587`，反之 `465`。

### user

* 类型: [string][string]
* 缺省值: `"123456789@qq.com"`

邮箱账号。

### pass

* 类型: [string][string]
* 缺省值: `""`

邮箱密码，各平台互不相同，如qq邮箱为授权码，请参考各自平台进行配置

### secure

* 类型: [boolean][boolean]
* 缺省值: `false`

是否开启安全连接，参考 `port` 解释。

### servername

* 类型: [string][string]
* 缺省值: `""`

验证主机名，`host` 设置为**IP地址**时可选的 TLS 验证主机名。仅 `secure` 开启时有效。

### rejectUnauthorized

* 类型: [boolean][boolean]
* 缺省值: `false`

证书校验。仅 `secure` 开启时有效。

建议关闭，开启可能会存在认证问题。

### logoutSend

* 类型: [boolean][boolean]
* 缺省值: `false`

是否开启离线发送邮件功能。开启后当 BOT 意外掉线时，自动向 Master 的 QQ 邮箱发送邮件提醒。

### sendDelay

* 类型: [number][number]
* 缺省值: `5`

BOT 离线多久后发送提醒邮件，期间 BOT 恢复上线则不会继续发送邮件，单位 **分钟**。仅 `logoutSend` 开启时有效。

### retry

* 类型: [number][number]
* 缺省值: `3`

离线邮件发送失败时重新尝试发送的次数。仅 `logoutSend` 开启时有效。

### retryWait

* 类型: [number][number]
* 缺省值: `5`

离线邮件发送失败后延迟多久重新尝试发送，单位 **分钟**。仅 `logoutSend` 开启时有效。

## webConsole.yml

网页控制台相关配置。

### enable

* 类型: [boolean][boolean]
* 缺省值: `true`

是否启用 `Web Console` 即网页控制台功能，开启后将停止终端的日志打印行为。

### tcpLoggerPort

* 类型: [number][number]
* 缺省值: `54921`

`log4js` 日志输出端口，除非端口冲突否则不需要改动。

#### logHighWaterMark

* 类型: [number][number]
* 缺省值: `64`

控制日志单次读取的数据量，单位 `kb`，不填或置 0 时默认 `64`，越大读取越快，内存占用越高，反之同理。

#### jwtSecret

* 类型: [string][string]
* 缺省值: `""`

JWT 验证秘钥，默认随机生成，可以随意输入长度为 6~16 的仅由字母和数字组成的字符串，最好不要有特殊含义。

该密钥还用于初次打开网页控制台时创建初始账号，请注意不要泄露该密钥。

## autoChat.yml

自动聊天配置，可以通过群聊中 `@BOT` 或私聊发送非指令语句来触发自动对话（当开启 `atBOT` 时，群聊中 `@BOT` 无效）。

### enable

* 类型: [boolean][boolean]
* 缺省值: `false`

是否启用自动聊天功能。

### type

* 类型: `1|2|3`
* 缺省值: `1`

聊天 api 所使用的平台，不同值指代的平台如下：

* 1: 青云客
* 2: 腾讯NLP（腾讯自然语言处理）
* 3: 小爱同学

### audio

* 类型: [boolean][boolean]
* 缺省值: `false`

是否开启语音发送功能，仅 `type` 为 `3` 时可用。

### secretId

* 类型: [string][string]
* 缺省值: `""`

前往腾讯云开通 NLP 后获取，仅 `type` 为 `2` 时可用。

### secretKey

* 类型: [string][string]
* 缺省值: `""`

前往腾讯云开通 NLP 后获取，仅 `type` 为 `2` 时可用。

## whiteList.yml

白名单配置，使 BOT 仅对白名单内的用户或群组作出响应。

### enable

* 类型: [boolean][boolean]
* 缺省值: `false`

是否启用白名单模式。

### user

* 类型: `number[]`
* 缺省值: `[]`

BOT 响应的目标用户列表，未配置任何用户时，默认不做使用限制。

### group

* 类型: `number[]`
* 缺省值: `[]`

BOT 响应的目标群组列表，未配置任何群组时，默认不做使用限制。

## banScreenSwipe.yml

群聊刷屏控制相关配置，用于处理群聊中的恶意刷屏行为（BOT 需要为管理员）。

### enable

* 类型: [boolean][boolean]
* 缺省值: `false`

是否启用刷屏控制。

### limit

* 类型: [number][number]
* 缺省值: `10`

连续发送消息几次后触发封禁。

### duration

* 类型: [number][number]
* 缺省值: `1800`

禁言时长，单位为秒。

### prompt

* 类型: [boolean][boolean]
* 缺省值: `true`

触发判定后是否给予相关用户提示信息。

### promptMsg

* 类型: [string][string]
* 缺省值: `请不要刷屏`

触发判定后给予相关用户的提示信息内容，仅 `prompt` 开启时有效。

## banHeavyAt.yml

群聊过量 at 处理相关配置，用于处理群聊中的at大量群员的恶意行为（BOT 需要为管理员）。

### enable

* 类型: [boolean][boolean]
* 缺省值: `false`

是否启用过量 at 处理控制。

### limit

* 类型: [number][number]
* 缺省值: `10`

一条消息中超过多少个 `@` 消息后触发封禁。

### duration

* 类型: [number][number]
* 缺省值: `1800`

禁言时长，单位为秒。

### prompt

* 类型: [boolean][boolean]
* 缺省值: `true`

触发判定后是否给予相关用户提示信息。

### promptMsg

* 类型: [string][string]
* 缺省值: `请不要同时at太多人`

触发判定后给予相关用户的提示信息内容，仅 `prompt` 开启时有效。


[number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number
[string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
[boolean]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean