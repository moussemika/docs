# Client 核心类重写

v3 不再内置底层通讯工具库，改为对接外部 [OneBot](https://onebot.dev/) 实现来进行消息通讯，目前暂时仅支持 OneBot `v11`。可于 [OneBot 生态](https://onebot.dev/ecosystem.html#onebot-11-10-cqhttp) 中查看可以使用的相关实现端。

我们在尽可能保证原来开发习惯的前提下对 `bot.client` 核心库进行了重写，现其核心代码位于 `src/module/lib` 下，其方法调用风格与 `oicq@v1` 类似。

你需要对核心库的导入方式进行一定程度的修改：

```ts
// v2
import * as sdk from "icqq";
// v3
import * as sdk from "@/module/lib";
```

client 核心类相关内容可以参考 [Client](../../guide/global/client.md)。

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
