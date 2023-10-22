# Client 核心类重写

v3 不再使用 `icqq` 作为底层通讯工具，改为对接外部 `gocq` 进行消息通讯。

我们在尽可能保证原来开发习惯的前提下对 `bot.client` 核心库进行了适配 go-cqhttp 的重写，现其核心代码位于 `src/module/lib` 下，其方法调用风格与 `oicq1` 类似。

你需要对核心库的导入方式进行一定程度的修改：

```ts
// v2
import * as sdk from "icqq";
// v3
import * as sdk from "@/module/lib";
```

具体方法调用可参考核心工具类 `src/module/lib/client.ts` 与 [go-cqhttp 帮助中心](https://docs.go-cqhttp.org/)。

下面对部分功能实现方式做出说明：

## 获取当前登陆账号

v3 删除了账号登陆配置，你需要通过 `client.uin` 来获取当前登录的账号。

## 调用 go-cqhttp api

尽管我们在 `src/module/lib/client.ts` 下尽可能对所有 go-cqhttp 的 api 提供了支持，但难以保证会存在更新不及时的情况。
你可以通过 `fetchGocq` 方法来自行调用 api。

下面给出调用获取陌生人信息 api 示例，该 api 的官网文档：[获取陌生人信息](https://docs.go-cqhttp.org/api/#%E8%8E%B7%E5%8F%96%E9%99%8C%E7%94%9F%E4%BA%BA%E4%BF%A1%E6%81%AF)

```ts
client.fetchGoCq( "get_stranger_info", { user_id: 114514191 } ).then( res => {
    console.log( res ); // 得到结果
} );
```

当然这里仅为了展示 `fetchGoCq` 的使用方法，目前官网的所有文档我们都提供了适配，可以直接通过下面的方法来获取陌生人信息：

```ts
client.getStrangerInfo( 114514191 ).then( res => {
    console.log( res ); // 得到结果
} );
```

## 监听 go-cqhttp 上报事件

你可以通过 `client.on()` 来监听 go-cqhttp 所发送的特定事件。你可以在 `src/module/lib/types/map/event.ts` 下查看所支持的全部事件类型。

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

## 获取可发送的数据格式

我们提供了 `segment` 工具对象来快速生成可发送的各种数据格式，并支持以数组的方式进行组合发送。详细可以参考 `src/modules/lib/element.ts`;

```ts
import * as sdk from "@/modules/lib";

client.sendPrivateMsg( 114514191, [
    sdk.segment.at( 114514190 ),
    "艾特你一下，wink~",
    sdk.segment.face( 1 )
] );
```

当然你也可以不借助 `segment`，自行组装支持发送的数据格式 `Sendable`。详情可参考 `src/modules/lib/types/element/send.ts`;

```ts
/** 可用来发送的类型集合 */
export type Sendable = string | MessageElem | (string | MessageElem)[];
```

## 一些其他的核心方法

- `sdk.toCqCode()`: 将 `MessageElem` 类型数组转变为 cqcode 码的格式。
- `sdk.toMessageRecepElem()`: 将 cqcode 码转换为事件接收到的格式的对象 `MessageRecepElem[]`;