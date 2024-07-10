# InputParameter

指令入口函数的入参对象，被定义为：

```ts
type Message = oicq.PrivateMessageEventData |
    oicq.GroupMessageEventData;

type InputParameter = {
    sendMessage: SendFunc;
    messageData: Message;
    matchResult: MatchResult;
} & BOT;
```

可见，在入口函数内，你除了能获取所有的[全局工具类](../global/index)，还能得到消息回复函数、消息事件数据和正则匹配结果。

## sendMessage

该方法为一个快捷的发送消息方法，用于快速想触发指令的目标发送消息。

事实上，该方法正是由 [getSendMessageFunc](../../api/global/message#getsendmessagefunc) 方法生成的，生成方式如下：

```ts
// 私聊触发指令场景
sendMessage = bot.message.getSendMessageFunc( userID, msg.MessageType.Private );
// 群聊触发指令场景
sendMessage = bot.message.getSendMessageFunc( userID, msg.MessageType.Group, groupID );
```

因此，你可以向 `sendMessage` 传入两个参数，即：消息内容、是否 at 目标用户，其中第二个参数仅在传入 `false` 时才会覆盖 `config.atUser` 配置项。

> 我们将会在未来使用更加清晰的 [createMessageSender](../../api/global/message#createmessagesender) 方法创建此方法，由此产生的细微区别（第二个参数的覆盖问题）可能需要开发者在未来的版本中进行适配。

## messageData

从实现端接收到的聊天数据对象，包含了用户的消息内容、发送者信息等，以及快速回复等等的快捷操作，其类型定义如下

```ts
export type Message = core.PrivateMessageEvent | core.GroupMessageEvent;
```

私聊和群聊场景下这个对象的内容有所不同，开发者可以通过判断 `messageData.message_type` 来针对性的根据不同场景来处理对应指令行为。

```ts
if ( messageData.message_type === "private" ) {
    // 私聊场景下的指令处理，此时 ts 会自动将类型认定为 PrivateMessageEvent
} else {
    // 群聊场景下的指令处理，此时 ts 会自动将类型认定为 GroupMessageEvent
}
```

## matchResult

该属性用于获取指令正则匹配的结果信息。其值为一个对象，包含诸如：指令头信息、参数匹配信息等。指令的类型不同，对象的属性也会有所不同。

详细内容可以参照各类型指令中的相关说明：[Order](./order#matchresult)、[Switch](./switch#matchresult)、[Enquire](./enquire#matchresult)。