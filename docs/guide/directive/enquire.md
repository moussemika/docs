# Enquire 指令

问答式指令。旨在实现 **问答** 的场景，即：**用户触发 - BOT 给予提示 - 用户回答 - BOT 响应** 的场景。

```text
Q: #ps
A: 请发送你的账号 cookie 来绑定私人服务
Q: ltuid=15......
A: 绑定成功
// 或在一定时间未回复时
A: 操作超时
```

## 指令属性

Switch 指令拥有三个独有属性，它的定义如下：

```ts
export type EnquireConfig = CommandCfg & {
    type: Enquire["type"];
    headers: string[];
    timeout: number;
};
```

目前认为，问答式指令并没有参数输入的需求，因此未设置 `regexps` 配置项。

### type

* 类型: `"enquire"`

必填项，固定值 `enquire`，用于标记这是一个 `Enquire` 类型指令。

### headers

* 类型: [string\[\]][string-array]
* 允许用户配置: `是`

必填项，与 [Order.headers](./order.md#headers) 完全相同，不作赘述。

### timeout

* 类型: [number][number]
* 允许用户配置: `是`

必填项，控制“回答”的最长等待时间，单位**秒**。若填写 0 或小于 0 的值，将会被重置为默认的 `300s`。

## 入口函数

Enquire 指令的入口函数定义方式为：

```ts
import { defineDirective } from "@/modules/command/main";

export default defineDirective( "enquire", i => {
  // 入口函数内容
} );
```

下面对参数 `i` 中与其他指令行为有所不同的属性做出说明：

### matchResult

其类型如下：

```ts
export interface EnquireMatchResult {
    type: "enquire";
    header: string;
    status: "activate" | "confirm" | "timeout";
    timeout: number;
}
```

#### header

与 [Order.matchResult.header](./order.md#header) 行为一致。

#### status

具有三种状态：

* activate: 指令初次触发
* confirm: 用户回答
* timeout: 超时

在这三种事件出现时，均会携带对应的 `status` 执行入口函数。

#### timeout

指令超时时间。

### 覆盖终止回答默认行为

默认情况下，用户只需回答一次即可终止本次问答。指令也提供了一种方式来覆盖次默认行为： 当 [matchResult.status](#status) 的值为 `confirm` 时，在入口函数中执行 `return false` 来禁止终止问答默认行为。

通常这可以用来根据用户回答内容是否有效来决定是否结束问答。

当通过此种方式接受了用户消息时，将会重置超时等待时间。

## 示例

下面是一个完整的 Enquire 指令示例：

```ts
/* 指令配置 */
const qa: EnquireConfig = {
    type: "enquire",
    cmdKey: "adachi.test.enquire",
    desc: ["问答测试", ""],
    headers: ["qa"],
    main: "achieves/qa",
    timeout: 180,
    detail: "触发案例：#qa"
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
            const answer = "我回答了你的问题：" + i.messageData.raw_message;
            await i.sendMessage( answer );
        } catch {
            await i.sendMessage( "你的问题我无法回答，请重新提问" );
            return false; // 不终止会话，继续等待提问
        }
    }
} );
```


[number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number
[string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
[boolean]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean
[string-array]: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays