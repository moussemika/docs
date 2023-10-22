# 创建一个插件

首先我们在 `src/plugins` 目录下创建一个 `example` 目录，这将是我们这个插件的根目录。

然后在根目录中，创建一个名为 `init.ts` 的文件，这是插件的入口文件，文件名称不允许修改，文件的内容如下：

```ts
// /src/plugins/example/init.ts
export default {
    name: "example",
    cfgList: [ {
        type: "order",
        cmdKey: "silvery-star.echo",
        desc: ["复读", "[任意内容]"],
        headers: ["echo"],
        async main( i ) {
            await i.sendMessage( i.messageData.raw_message );
        },
        regexps: [".+"]
    } ]
}
```

这是一个最简单的声明插件的例子，它声明了一个名为 `example` 的插件，同时包含了一个用于复读消息的 [Order类型](../directive/order.md) 指令，这个指令的所有行为均在 `main` 函数中编写。

如此就可以非常简单的实现一个 `echo` 指令复读的功能，你可以尝试启动项目并向 bot 发送 **[指令起始符](../../config/base.md#header) + `echo` + 任意内容**，例如 `#echo 复读这句话`， 查看 `echo` 指令能否正常工作

在此基础上，你可以继续阅读后面的文档来丰富你的插件功能。