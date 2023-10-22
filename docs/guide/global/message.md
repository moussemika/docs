# message 工具类

尽管在 [client 工具类](../../api/global/client.md) 中提供各种消息发送相关的 api。但考虑种类繁杂、响应 bot 配置项（例如 `atUser`）等方面，我们需要对发送消息方法进一步的封装。

message 工具类就是用于处理这种情况，它可以自行创建发送消息方法，又或是直接向 `master` 发送消息。

具体 api 调用可以翻阅 [工具类 Message Api](../../api/global/message.md)

## 创建发送消息方法

工具类中提供了 `getSendMessageFunc()` 方法用于创建自定义发送消息方法。

被创建的自定义发送消息方法支持发送任意类型消息（包括合并转发消息），并会同步响应 `atUser` 配置项设置。

方法一经创建，其发送的目标就已经被固定，无法改变。仅支持传入待发送内容与与是否携带 `at` 消息。详情可以查看 [消息发送方法](../../api/message.md#getSendMessageFunc)

### 指定用户的私聊

示例：对 QQ 为 114514191 的用户，创建私聊发送消息方法

```ts
import bot from "ROOT";
import { MessageType } from "@/modules/message";

const sendMessageFunc = bot.message.getSendMessageFunc( 114514191, MessageType.Private );
```

### 指定群聊内的指定用户

示例：对群号为 100000001 群聊内的 QQ 为 114514191 用户，创建消息发送方法：

```ts
import bot from "ROOT";
import { MessageType } from "@/modules/message";

const sendMessageFunc = bot.message.getSendMessageFunc( 114514191, MessageType.Group, 100000001 );
```

### 指定群聊内 at 全体成员

示例：对群号为 100000001 的群聊，创建全体成员消息发送方法：

```ts
import bot from "ROOT";
import { MessageType } from "@/modules/message";

const sendMessageFunc = bot.message.getSendMessageFunc( "all", MessageType.Group, 100000001 );
```

## 向 bot 主人发送消息

通过 `sendMaster()` 方法可以快捷的向 bot 主人发送私聊消息。

```ts
import bot from "ROOT";

bot.message.sendMaster( "程序出错啦" );
```