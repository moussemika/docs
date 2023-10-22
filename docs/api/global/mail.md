# 工具类 Mail Api

## 基本类型定义

```ts
type SendFunc = ( mailOptions: mail.SendMailOptions, retry?: number, retryWait?: number ) => Promise<void>;
```

## getSendMessageFunc()

```ts
interface MailManagementImplement {
    getSendMailFunc( address: mail.SendMailOptions["to"] ): SendFunc;
}
```

- `address` 收件人地址信息
- 返回值：邮件发送方法
  - `mailOptions` 发送内容
  - `retry` 可选，失败重试次数，默认 `3`
  - `retryWait` 可选，失败重试间隔，单位 `s`，默认 `120`

创建一个目标固定的邮件发送方法。参数 `address` 使用 [nodemailer](https://github.com/nodemailer/nodemailer) 内置类型，可直观表示为如下类型：

```ts
type AddressOption = {
  name: string;
  address: string;
} | string | undefined;
```

得到的邮件发送方法中的参数 `mailOptions` 同样使用了 [nodemailer](https://github.com/nodemailer/nodemailer) 内置类型，篇幅较多此处不便说明，可前往官方文档或阅读源码类型了解。

## sendMaster()

```ts
interface MsgManagementMethod {
    sendMaster: SendFunc;
}
```

- `mailOptions` 发送内容
- `retry` 可选，失败重试次数，默认 `3`
- `retryWait` 可选，失败重试间隔，单位 `s`，默认 `120`

向 bot 主人账号发送邮件，类型与 `getSendMailFunc()` 得到的邮件发送方法使用方式完全一致。