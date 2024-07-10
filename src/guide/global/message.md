# message 工具类

尽管在 [client 工具类](../../api/global/client) 中提供各种消息发送相关的 api。但考虑种类繁杂、响应 bot 配置项（例如 `atUser`）等方面，我们需要对发送消息方法进一步的封装。

message 工具类就是用于处理这种情况，它可以自行创建发送消息方法，又或是直接向 `master` 发送消息。

具体 api 调用可以翻阅 [工具类 Message Api](../../api/global/message)

## 创建发送消息方法

工具类中提供了 [createMessageSender()](../../api/global/message#createmessagesender) 方法用于创建自定义发送消息方法。

被创建的自定义发送消息方法支持发送任意类型消息（包括合并转发消息），并会同步响应 `atUser` 配置项设置。

方法一经创建，其发送的目标就已经被固定，无法改变。仅支持传入待发送内容与是否 at 群内目标（群聊限定，私聊时不起作用）。

### 指定用户的私聊

示例：对 QQ 为 114514191 的用户，创建私聊发送消息方法

```ts
import bot from "ROOT";
import { MessageType } from "@/modules/message";

const sendMessageFunc = bot.message.createMessageSender( MessageType.Private, 114514191 );
sendMessageFunc( "吃了吗您" );
```

### 指定群聊内发送普通消息

示例：对群号内为 100000001 的群聊，创建普通消息发送方法：

```ts
import bot from "ROOT";
import { MessageType } from "@/modules/message";

const sendMessageFunc = bot.message.createMessageSender( MessageType.Group, 100000001 );
sendMessageFunc( "吃了吗您" );
````

### 指定群聊内的指定用户

示例：对群号为 100000001 群聊内的 QQ 为 114514191 用户，创建消息发送方法：

相比上方示例来说，只需填写第三个参数即可。

```ts
import bot from "ROOT";
import { MessageType } from "@/modules/message";

const sendMessageFunc = bot.message.createMessageSender( MessageType.Group, 100000001, 114514191 );
```

被创建的消息方法调用时，默认情况下将会参照 `config.atUser` 配置项，来决定是否自动 at 群内目标用户。此行为可通过为生成的方法传入第二个参数来手动覆盖。

```ts
// 此时不论 config.atUser 的值如何，均不会 at 群内目标用户，仅发送普通群聊消息
sendMessageFunc( "吃了吗您", false );
```

### 指定群聊内 at 全体成员

示例：对群号为 100000001 的群聊，创建全体成员消息发送方法：

```ts
import bot from "ROOT";
import { MessageType } from "@/modules/message";

const sendMessageFunc = bot.message.createMessageSender( MessageType.Group, 100000001, "all" );
sendMessageFunc( "吃了吗您" );
```

## 向 bot 主人发送消息

通过 `sendMaster()` 方法可以快捷的向 bot 主人发送私聊消息。

```ts
import bot from "ROOT";

bot.message.sendMaster( "程序出错啦" );
```