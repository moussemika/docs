# 工具类 Message Api

## 基本类型定义

```ts
enum MessageType {
    Group,
    Private,
    Unknown
}

type SendFunc = ( content: core.Sendable | core.ForwardElem, allowAt?: boolean ) => Promise<number>;
```

## getSendMessageFunc()

```ts
interface MsgManagementMethod {
    getSendMessageFunc( userID: number | "all" | string, type: MessageType, groupID?: number ): SendFunc;
}
```

- `userID` 发送目标用户 QQ 号，目标为艾特全体成员时传入 `all`
- `type` 发送位置（用户 / 群聊）
- `groupID` 可选，群号，当 `type` 为群聊时需要传入
- 返回值：发送消息方法
  - `content` 发送内容
  - `allowAt` 可选，默认 `true`，发送位置为群聊时是否 at 发送目标。

创建一个目标固定的发送消息方法。

## sendMaster()

```ts
interface MsgManagementMethod {
    sendMaster( content: core.Sendable ): Promise<number | null>;
    sendMaster( content: core.ForwardElem ): Promise<core.SendForwardMessage | null>;
}
```

- `content` 发送内容
- 返回值: 所发送的消息 id

向 bot 主人 qq 发送私聊消息。

当传入普通消息类型时，将得到一个 `number` 类型的消息 id 返回值。
若传入合并转发消息类型，则将得到一个包含消息 id `message_id` 和 转发消息 id `forward_id` 的对象。