---
pageClass: global-main
---

# 全局工具类

在框架中我们提供了一个全局工具类，它被定义为:

```ts
export interface BOT {
    readonly redis: Database;
    readonly config: BotConfig;
    readonly client: core.Client;
    readonly logger: Logger;
    readonly interval: Interval;
    readonly file: FileManagement;
    readonly auth: Authorization;
    readonly message: msg.default;
    readonly mail: MailManagement;
    readonly command: Command;
    readonly renderer: BasicRenderer;
}
```

这个接口实例整体会被传入**插件生命周期钩子函数**与**指令入口函数**，你可以通过 [解构对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#%E8%A7%A3%E6%9E%84%E5%AF%B9%E8%B1%A1) 的方式来获取其中的某个工具，以便进行声明插件的准备工作，如创建配置文件等。

## 使用工具类

下面以 `logger` 工具类为例：

```ts
export default {
    cfgList: [ {
        // ...（其他指令配置）
        main( { logger } ) {
            logger.info( "我在指令入口函数中打印了一行日志" );
        }
    } ],
    // ...（其他插件配置）
    mounted( { logger } ) {
        logger.info( "我在插件生命周期钩子函数中打印了一行日志" );
    }
}
```

在代码的其他地方，你也可以通过下面的代码导入所有工具类：

```ts
import bot from "ROOT";
```

> 请务必注意代码的执行顺序，避免在工具类创建完毕之前使用 `bot` 中提供的工具类。如果你无法确定代码执行的时机，那么将其放在 `mounted` 钩子函数中执行是最好的选择。

## 工具类列表

<ul class="tool-list">
    <li class="tool-item">
        <h3>redis</h3>
        <p>简单封装了一些操作 bot 数据库的方法</p>
        <a href="./redis.html">详情 →</a>
    </li>
    <li class="tool-item">
        <h3>config</h3>
        <p>用于获取 bot 配置文件内容</p>
        <a href="./config.html">详情 →</a>
    </li>
    <li class="tool-item">
        <h3>client</h3>
        <p>用于获取 bot 配置文件内容，或是生成插件的配置文件</p>
        <a href="./client.html">详情 →</a>
    </li>
    <li class="tool-item">
        <h3>logger</h3>
        <p>bot 所使用的日志打印工具，本质为经过预设处理的 log4js 对象</p>
        <a href="https://github.com/log4js-node/log4js-node" target="_blank">详情 ↗</a>
    </li>
    <li class="tool-item">
        <h3>interval</h3>
        <p>负责操作 bot 指令响应的时间间隔</p>
        <a href="./interval.html">详情 →</a>
    </li>
    <li class="tool-item">
        <h3>file</h3>
        <p>简单封装了一些对本文文件进行操作的工具方法</p>
        <a href="./file.html">详情 →</a>
    </li>
    <li class="tool-item">
        <h3>auth</h3>
        <p>操作用户权限的工具类</p>
        <a href="./auth.html">详情 →</a>
    </li>
    <li class="tool-item">
        <h3>message</h3>
        <p>负责 bot 主动发送消息的工具类</p>
        <a href="./message.html">详情 →</a>
    </li>
    <li class="tool-item">
        <h3>mail</h3>
        <p>负责 bot 主动发送邮件的工具类</p>
        <a href="./mail.html">详情 →</a>
    </li>
    <li class="tool-item">
        <h3>command</h3>
        <p>用于操作 bot 指令系统，或获取指令相关信息</p>
        <a href="./command.html">详情 →</a>
    </li>
    <li class="tool-item">
        <h3>renderer</h3>
        <p>控制 bot 的自定义图片渲染器</p>
        <a href="./renderer.html">详情 →</a>
    </li>
</ul>