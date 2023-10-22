# 指令 Enquire 重写

鉴于 v2 的 `Enquire` 使用场景比较稀少，v3 对 `Enquire` 指令进行了重写，现在它除了名称相同以外与 v2 完全没有联系。

新版的 `Enquire` 指令旨在实现 **问答** 的场景，如下：

```text
Q: #ps
A: 请发送你的账号 cookie 来绑定私人服务
Q: ltuid=15......
A: 绑定成功
// 或在一定时间未回复时
A: 操作超时
```

新版 `Enquire` 的定义如下：

```ts
export type EnquireConfig = CommandCfg & {
    type: Enquire["type"];
    headers: string[];
    timeout: number;
};
```

这样可能有些难以理解，我们可以把他解释为下面的结构：

```ts
interface EnquireConfig {
    type: "enquire";
    cmdKey: string;
    main: string | CommandEntry;
    desc: [ string, string ];
    headers: string[];
    timeout: number;
    detail?: string;
    auth?: AuthLevel;
    scope?: MessageScope;
    display?: boolean;
    ignoreCase?: boolean;
    start?: boolean;
    stop?: boolean;
    priority?: number;
}
```

可以看出，其相对 `Order` 来说，移除了 `regexps` 属性，新增了 `timeout` 属性。

目前认为，问答式指令并没有参数输入的需求，因此移除了 `regexps` 配置。
而 `timeout` 属性则用来控制“回答”的最长等待时间，单位**秒**。若你填写 0 或小于 0 的值，将会被重置为默认的 `300s`。

enquire 的入口函数定义与其他指令类似，仅修改类型参数即可：

```ts
export default defineDirective( "enquire", async i => {
    // 指令逻辑
} );
```

与其他指令对比，入口函数携带的 `i.matchResult` 发生了变化，格式如下：

```ts
export interface EnquireMatchResult {
    type: "enquire";
    header: string;
    status: "activate" | "confirm" | "timeout";
    timeout: number;
}
```

其中 `timeout` 为回答等待超时时间；`status` 三种状态分别对应：初次触发、用户回答、超时，在这三种事件出现时，均会携带对应的 `status` 执行入口函数。

默认情况下，用户只需回答一次即可终止本次问答。指令也提供了一种方式来覆盖次默认行为： 当 `status` 的值为 `confirm` 时，使入口函数执行 `return false` 来禁止终止问答。
通常这可以用来根据用户回答内容是否有效来决定是否结束问答。

下面是一个 `enquire` 指令完整的案例：

```ts
/* 指令配置 */
const qa: EnquireConfig = {
    type: "enquire",
    cmdKey: "adachi.test.enquire",
    desc: [ "问答测试", "" ],
    headers: [ "qa" ],
    main: "achieves/qa",
    timeout: 180
};

/* achieves/qa.ts */
export default defineDirective( "enquire", async i => {
    if ( i.matchResult.status === "activate" ) {
        await i.sendMessage( "请发送你的问题" );
        return;
    }
    if ( i.matchResult.status === "timeout" ) {
        await i.sendMessage( "操作已超时，会话终止" );
        return;
    }
    if ( i.matchResult.status === "confirm" ) {
        try {
            // 通过 i.messageData.raw_message 获取用户发送内容
            const answer = await answerQuestion( i.messageData.raw_message );
            await i.sendMessage( answer );
        } catch {
            await i.sendMessage( "你的问题我无法回答，请重新提问" );
            return false; // 不终止会话，继续等待提问
        }
    }
} );
```