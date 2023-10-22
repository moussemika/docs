# Order 指令

命令式指令。将指令分为「指令头」和「指令参数」两个部分，其中「指令头」用于区分不同的指令，「指令参数」用于进行功能的实现。通常用于最普遍的**触发-响应**场景。

```text
Q: #bind 114514191
A: 绑定成功！
```

## 指令属性

Order 指令拥有三个独有属性，它的定义如下：

```ts
type OrderConfig = CommandCfg & {
    type: Order["type"];
    headers: string[];
    regexps: string[] | string[][];
};
``` 

### type

* 类型: `"order"`

必填项，固定值 `order`，用于标记这是一个 `Order` 类型指令。

### headers

* 类型: [string\[\]][string-array]
* 允许用户配置: `是`

必填项。表示该指令的所有指令头。

需要注意的是，所有的指令头的前面都会被添加上[指令起始符](../../config/base.md#header) ， 如果你不希望某一个指令头被自动追加[指令起始符](../../config/base.md#header)，请在该指令头前放添加双下划线 `__` 。

```ts
const helpCmd = {
    // ...
    headers: [
        "__菜单"
    ]
}
```

### regexps

* 类型: [string\[\]|string\[\]\[\]][string-array]
* 允许用户配置: `否`

必填项，表示该指令的所有正则匹配。该字段的值允许为一维或二维字符串数组，它们的含义分别是：

* 一维数组时，表示一个正则表达式。数组由「正则匹配单元」组成，如 `[ "(add|rem)", "\\d+" ]`，
  在生成最终的正则表达式时，该指令头和该数组的所有元素被拼接起来，如 `/#example *(add|rem) *\d+/` 。
* 二维数组时，表示若干个正则表达式。数组由上一点提到的一维数组组成。

## 入口函数

Order 指令的入口函数定义方式为：

```ts
import { defineDirective } from "@/modules/command/main";

export default defineDirective( "order", i => {
  // 入口函数内容
} );
```

下面对参数 `i` 中与其他指令行为有所不同的属性做出说明：

### matchResult

其类型如下：

```ts
interface OrderMatchResult {
    type: "order";
    header: string;
    match: string[];
}
```

#### header

匹配到的指令头，如当用户输入 `#info 行秋` 时，此处 `header` 为 `#info`。

#### match

匹配到的参数结果，与指令定义的正则（`regexps`）中参数的位置一一对应，当用户未输入指令的某个可选参数时，该参数所在的数组位置的值为 空字符串`""`。给出以下示例：

```ts
const information: OrderConfig = {
    type: "order",
    headers: [ "info" ],
    regexps: [ "[\\w\\u4e00-\\u9fa5]+", "(-skill)?" ],
    // ...
};
```

当用户输入 `#info 行秋` 与 `#info 行秋 -skill` 时，`matchResult.match` 的值分别为如下结果：

```yaml
# 用户输入：#info 行秋
- [ "行秋", "" ]
# 用户输入：#info 行秋 -skill
- [ "行秋", "-skill" ]
```

## 示例

下面是一个完整的 `Order` 指令示例：

```ts
/* 指令配置 */
const qa: OrderConfig = {
  type: "order",
  cmdKey: "silvery-star.echo",
  desc: ["复读", "[任意内容]"],
  headers: ["echo"],
  main: "achieves/echo",
  regexps: [".+"],
  detail: "触发案例：#echo 今天是一个当复读机的好日子"
};

/* achieves/echo.ts */
import { defineDirective } from "@/modules/command/main";

export default defineDirective( "order", async i => {
    await i.sendMessage( i.messageData.raw_message );
} );
```


[number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number
[string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
[boolean]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean
[string-array]: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays