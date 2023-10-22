# mail 工具类

由于 bot 发送消息是基于**在线**的前提下进行的，某些情况可能需要 `bot` 无论在什么状态下都能发送通知。
mail 工具类则负责处理这部分功能，功能实现基于第三方包 [nodemailer](https://github.com/nodemailer/nodemailer)。

具体 api 详情可以翻阅 [工具类 Message Api](../../api/global/mail.md)

> 本工具类只有在用户配置 `mail.yml` 后才能正常工作。 

## 创建发送邮件方法

通过 `getSendMessageFunc()` 方法可以创建一个固定发送目标的邮件发送方法。

### 指定单个用户

示例：对邮箱地址为 `114514191@xx.com` 的收件人，创建邮件发送方法

```ts
import bot from "ROOT";
import { MessageType } from "@/modules/message";

const sendMailFunc = bot.mail.getSendMailFunc( "114514191@xx.com" );
```

### 设置收件人名称

示例 将上文示例中的收件人命名为 `仙贝`：

```ts
import bot from "ROOT";
import { MessageType } from "@/modules/message";

const sendMailFunc = bot.mail.getSendMailFunc( {
    name: "仙贝",
    address: "114514191@xx.com"
} );
```

### 指定多个收件人

示例：指定接收人为 `114514191@xx.com` 与 `1145141919@xx.com`，创建邮件发送方法：

```ts
import bot from "ROOT";
import { MessageType } from "@/modules/message";

const sendMailFunc = bot.mail.getSendMailFunc( [ {
    name: "仙贝1",
    address: "114514191@xx.com"
}, {
    name: "仙贝2",
    address: "1145141919@xx.com"
} ] );
```

## 向 bot 主人发送邮件

通过 `sendMaster()` 方法可以快捷的向 bot 主人发送邮件。此方法调用方式与 `getSendMailFunc()` 所创建的邮件发送方法完全一致。

```ts
import bot from "ROOT";

bot.mail.sendMaster( {
    subject: "这是一个标题",
    text: "这是邮件文本内容"
}, retry, retryWait * 60 * 1000 );
```