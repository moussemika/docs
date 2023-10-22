# Client

Client 工具类负责与 [go-cqhttp][go-cqhttp] 直接对接，基本所有涉及对 bot 账号相关的操作都需要通过此类来实现。

可以通过翻阅 [工具类 Client API](../../api/global/client.md) 来查看工具类所包含的所有方法。

下面对部分功能实现方式做出说明。

## 获取账号相关内容

* uin: 当前登录的账号 QQ 号
* fl: 好友列表，`Map<number, FriendInfo>` 类型
* gl: 群聊列表，`Map<number, GroupInfo>` 类型

## 调用 go-cqhttp api

我们对 [go-cqhttp][go-cqhttp] 所提供的绝大多数 api 进行了适配，并在 `client` 工具类中给出了方法来供开发者调用。 可以通过翻阅 [] 来查看所支持的所有方法。

这里给出调用获取陌生人信息 api 示例：

```ts
client.getStrangerInfo( 114514191 ).then( res => {
    console.log( res ); // 得到结果
} );
```

## 自定调用 go-cqhttp api

尽管我们尽可能对所有 [go-cqhttp][go-cqhttp] 的 api 提供了支持，但难免有存在更新不及时的情况。
你可以通过 `client.fetchGocq()` 方法来自行调用 api，该方法接受两个参数，分别为 [go-cqhttp][go-cqhttp] 对应 api 的**终结点名称**与**所需参数**。

同样还是调用获取陌生人信息 api 示例，该 api 的官网文档：[获取陌生人信息](https://docs.go-cqhttp.org/api/#%E8%8E%B7%E5%8F%96%E9%99%8C%E7%94%9F%E4%BA%BA%E4%BF%A1%E6%81%AF)

```ts
client.fetchGoCq( "get_stranger_info", { user_id: 114514191 } ).then( res => {
    console.log( res ); // 得到结果
} );
```

## 监听 go-cqhttp 上报事件

你可以通过 `client.on()` 来监听 [go-cqhttp][go-cqhttp] 所发送的特定事件。你可以在 `src/module/lib/types/map/event.ts` 下查看所支持的全部事件类型。

下面是监听 群聊撤回 事件的示例：

```ts
client.on( "notice.group.recall", data => {
    console.log( "data" ); // 事件上报数据
} );
```

可以使用 `client.once()` 来进行一次性事件触发监听，使用方式与 `client.on()` 完全相同。

你同样可以通过 `client.off()` 来注销事件监听，但需要提供与注册事件完全相同的回调函数。

```ts
function callback( data: GroupRecallNoticeEvent ) {
    console.log( data );
};

client.on( "notice.group.recall", callback );
client.off( "notice.group.recall", callback );
```

[go-cqhttp]: https://docs.go-cqhttp.org/