# 重构的 Config 核心类

v3 中对 bot 配置项工具类 `Config` 进行了重构，分别为：结构变更、配置项变更 与 新方法追加。

## 结构变更

为了解决 v2 中 bot 配置项结构混乱问题，v3 修改了配置项对象的结构。

现在结构如下：

```javascript
config = {
    base: {
        wsServer: "127.0.0.1:11451",
        master: 987654321,
        inviteAuth: 2,
        logLevel: "info",
        atUser: false,
        atBOT: false,
        addFriend: true,
        renderPort: 80
    },
    directive: {
        header: [ "#" ],
        groupIntervalTime: 1500,
        privateIntervalTime: 2000,
        helpMessageStyle: "message",
        fuzzyMatch: false,
        matchPrompt: true,
        callTimes: 3,
        countThreshold: 60,
        ThresholdInterval: false
    },
    db: {
        port: 56379,
        password: ""
    },
    mail: {
        host: "smtp.qq.com",
        port: 587,
        user: "123456789@qq.com",
        pass: "",
        secure: false,
        servername: "",
        rejectUnauthorized: false,
        logoutSend: false,
        sendDelay: 5,
        retry: 3,
        retryWait: 5
    },
    autoChat: {
        enable: false,
        type: 1,
        audio: false,
        secretId: "",
        secretKey: ""
    },
    whiteList: {
        enable: false,
        user: [ "（用户QQ）" ],
        group: [ "（群号）" ]
    },
    banScreenSwipe: {
        enable: false,
        limit: 10,
        duration: 1800,
        prompt: true,
        promptMsg: "请不要刷屏"
    },
    banHeavyAt: {
        enable: false,
        limit: 10,
        duration: 1800,
        prompt: true,
        promptMsg: "请不要同时at太多人"
    },
    webConsole: {
        enable: true,
        password: "",
        tcpLoggerPort: 54921,
        logHighWaterMark: 64,
        jwtSecret: getRandomString( 16 )
    }
} 
```

你需要参照这个结构来修改对 `bot.config` 内属性的调用。

## 配置项变更

由于接入 OneBot 标准等需要，对属性进行了一定的增加删除。

### 删除配置项

- `qrcode`、`number`、`password`、`platform`、`ffmpegPath`、`ffprobePath`: 接入 OneBot 标准后，bot 框架本身不再提供账号登陆、ffmpeg 音视频解析等功能
- `helpPort`、`webConsole.consolePort`: 共用 server 服务后，help 组件与 webconsole 不再需要单独占用端口
- `useWhitelist`: 已存在新的 `whiteList` 配置项对象，不再需要该属性

### 新增配置项

- `base.wsServer`: OneBot 实现所提供 event 事件上报的正向 websocket 地址，格式 `ip:端口/地址`。
- `base.wsApiServer`: OneBot 实现所提供 api 调用的正向 websocket 地址，格式 `ip:端口/地址`，当置空时，默认使用 `base.wsServer`。
- `base.renderPort`: 现 express server 服务已整合为同一个，该配置项用于 server 服务所占用的端口。若使用 `docker` 启动，则修改此项后应同步更改 `docker-compose.yml` 中 `port` 的第二个值。
- `whiteList`: `whiteList` 工具类合并后的产物，用于定义**白名单的开启与关闭**与**白名单所限制的成员列表**

### 值改变配置项

**directive.header**

v3 对多指令起始符提供了支持，因此此处从 `string` 类型的值变更为一个字符串数组 `string[]`。

```yaml
# v2
header: "#"
# v3
header:
    - "#"
    - "/"
```

以上述配置为例，在 v3 中对于指令 `help`，不论是使用 `#help` 还是 `/help` 都会正常触发指令。您可以通过这种方式来解决用户错误输入 `#` 与 `＃` 的问题。 

同时，我们对该配置项的值进行了**特殊符号转义**，您现在可以在其中配置绝大多数的字符了，而不用担心使用部分正则表达式特殊字符引起的程序错误。

```yaml
# v2
header: "^" # 无法正常工作
# v3
header:
    - "^" # ok
    - "$" # ok
```

## 新方法追加

### `on` 与 `clear`

每一个**配置项对象**均拥有事件绑定方法 `on` 与事件清空方法 `clear`。方法定义如下：

```ts
type EventType = "refresh";
type EventHandle<T> = ( newCfg: T, oldCfg: T ) => any;

interface ConfigInstance {
    on( type: EventType, handle: EventHandle<T> );
    clear( type?: EventType );
}
```

**on( type, handle )**

可用来注册与配置项对象加载相关的回调事件。

- type: 事件类型，目前仅支持 `refresh`，即**当次配置项对象触发刷新配置事件（即执行 `#refresh` 指令）时**
- handle: 事件触发回调函数，接受两个形参：`newCfg` 与 `oldCfg`，分别表示刷新前后的**配置项值**（不包括 `on`、`clear` 等方法）。

使用方式如下：

```ts
// 当执行 #refresh 时，若 base.yml 内容存在更新，则触发回调函数
bot.config.base.on( "refresh", ( oldCfg, newCfg ) => {
    console.log( oldCfg, newCfg );
} );
```

> 值得注意的是，你完全可以在的回调函数中直接使用 config 配置项对象本身（如 `bot.config.base`）来作为新值使用。因为当执行回调函数时，配置项对象自身的值已经提前完成了更新。这在某些需要传递完整 config 类型的场景下格外有用。

**clear( \[type] )**

- type: 要清空的事件类型，目前仅支持 `refresh`。若不传递则为清空全部注册事件。

使用方式如下：

```ts
// 清空 base 的 refresh 注册事件
bot.config.base.clear( "refresh" );
// 清空 base 的全部注册事件
bot.config.base.clear();
```

### register

请参考 [注册插件配置文件](../../guide/plugin/config_file#注册插件配置文件);