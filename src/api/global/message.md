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

> 该方法由于参数混乱且行为容易让开发者产生迷惑，已被弃置，将在未来的版本中移除，请使用 [createMessageSender](#createmessagesender) 方法代替

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
    - `allowAt` 可选，默认 `true`，发送位置为群聊时是否 at 发送目标。只有显式传入 `false` 时才会覆盖 `config.atUser` 配置项

创建一个目标固定的发送消息方法。

## createMessageSender() <Badge type="tip" text="3.3.2+" />

```ts
interface MessageManagementMethod {
    createMessageSender( type: MessageType.Private, userID: number ): SendFunc;
    createMessageSender( type: MessageType.Group, groupID: number, userID?: number | "all" ): SendFunc;
}
```

以函数重载方式定义，根据传入的 `type` 参数不同，接受不同的参数。

- 重载1：私聊消息发送方法
  - `type` 固定为 `MessageType.Private` 或 `1`
  - `userID` 发送目标用户 id
- 重载2：群聊消息发送方法
  - `type` 固定为 `MessageType.Group` 或 `0`
  - `groupID` 群聊 id
  - `userID` 可选，发送目标用户 id 或 `all`，在群聊发送消息时默认情况下会 at 目标用户或全体成员。若不传递则仅发送普通群聊消息。
- 返回值：发送消息方法
    - `content` 发送内容
    - `allowAt` 可选，默认为 `config.atUser` 所配置的值，发送位置为群聊时是否 at 发送目标。可以手动传入 `true` 或 `false` 覆盖行为

创建一个目标固定的发送消息方法，旨在替代 `getSendMessageFunc()` 的混乱参数类型。  
与 `getSendMessageFunc()` 方法不同的是，该方法创建的群聊发送消息方法可以自行定义是否 at 群内目标，而不需要考虑 `config.atUser` 配置项的值。

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