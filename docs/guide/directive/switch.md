# Switch 指令

开关式指令。这是「命令式指令」的一类特化，用于特定的存在类似**开启/关闭**的两种相反状态的指令。它通常同时提供 `开/关` 两个指令头。

```text
Q: #ban 114514191
A: 封禁用户 114514191 成功！
Q: #unban 114514191
A: 取消封禁用户 114514191 成功！ 
```

## 基本属性

Switch 指令拥有六个独有属性，它的定义如下：

```ts
type SwitchConfig = CommandCfg & {
  type: Switch["type"];
  mode: "single" | "divided";
  onKey: string;
  offKey: string;
  header: string;
  regexps: string[] | string[][];
};
```

### type

* 类型: `"switch"`

必填项，固定值 `switch`，用于标记这是一个 `Switch` 类型指令。

### mode

* 类型: `"single" | "divided"`
* 允许用户配置: `是`

表示开关类指令的构成模式。

* 设置为 `single` 时，表示单指令头模式。`onKey` 与 `offKey` 将被 `|` 连接作为可选单元，最终被组装为形如 `header (on|off)` 的表达式。
* 设置为 `divided` 时，表示拆分指令头模式。此时 `header` 配置将被忽略，开关关键词将作为 `header` ，最终将被组装为形如 `(onKey|offKey) prams` 的表达式。

### onKey

* 类型: [string][string]
* 允许用户配置: `是`

必填项，表示指令状态为「开」的关键词。

### offKey

* 类型: [string][string]
* 允许用户配置: `是`

必填项，表示指令状态为「关」的关键词。

### header

* 类型: [string][string]
* 允许用户配置: `是`

必填项，表示该指令的唯一指令头。类似 [Order.headers](./order.md#headers)，同样可以使用 `__` 来忽略指令起始符。

### regexps

* 类型: [string\[\]|string\[\]\[\]][string-array]
* 允许用户配置: `否`

必填项，与 [Order.regexps](./order.md#regexps) 基本一致。

特别的，`Switch` 指令还允许你在正则表达式中使用 `#{OPT}` 来标识开/关关键词的位置，如 `[ "#{OPT}", "\\d+" ]` ，这将导出如 `/#calc (add|sub) \d+/` 的指令。
`#{OPT}`标识在 `divided` 模式中不生效。

## 开关插槽

在 Switch 命令中

## 入口函数

Switch 指令的入口函数定义方式为：

```ts
import { defineDirective } from "@/modules/command/main";

export default defineDirective( "switch", i => {
  // 入口函数内容
} );
```

下面对参数 `i` 中与其他指令行为有所不同的属性做出说明：

### matchResult

其类型如下：

```ts
interface SwitchMatchResult {
    type: "switch";
    switch: string;
    match: string[];
    isOn: boolean;
}
```

由于 Switch 指令存在两种 `mode`，这里分别针对两种指令示例讨论；

`mode` 为 `single` 的指令示例：

```ts
const switchTest = {
    type: "switch",
    mode: "single",
    header: "open",
    regexp: [ "\\d{9}", "#{OPT}", "[\u4e00-\u9fa5]+" ],
    onKey: "on",
    offKey: "off",
    // ... 其他配置
};
```

此时用户输入: `#open 114514191 on 任意门`

`mode` 为 `divided` 的指令示例：

```ts
const switchTest = {
    type: "switch",
    mode: "divided",
    header: "",
    regexp: [ "\\d{9}", "[\u4e00-\u9fa5]+" ],
    onKey: "open",
    offKey: "close",
    // ... 其他配置
};
```

此时用户输入: `#open 114514191 任意门`

#### header

匹配到的指令头，当指令 `mode` 不同时有两种表现形式，根据上面提供的示例：

- `single`: 值为 `"#open"`
- `divided`: 值永远为空字符串 `""`

#### switch

匹配到的开关关键词，当指令 `mode` 不同时有两种表现形式，根据上面提供的示例：

- `single`: 值为 `"on"`
- `divided`: 值为 `"#open"`

#### match

与 [Order.matchResult.match](./order.md#match) 行为一致。需要注意的是，开关占位符 `${OPT}` 也会按照声明位置出现在结果数组中。根据上面提供的示例：

- `single`: 值为 `["114514191", "on", "任意门"]`
- `divided`: 值为 `["114514191", "任意门"]`

#### isOn

当前是否为开启状态，用于确认用户触发的是指令的哪一种状态。根据上面提供的示例：

- `single`: 此时用户输入的 switchKey 为 `on`，与 `onKey` 一致，isOn 值为 `true`
- `divided`: 此时用户输入的 switchKey 为 `open`，与 `onKey` 一致，isOn 值为 `true`

## 示例

下面是一个完整的 `Switch` 指令示例，其中分别给出了 `mode` 两种模式的配置方案：

```ts
/* 指令配置 */
/* mode - single */
const switchSingle: SwitchConfig = {
    type: "switch",
    mode: "single", 
    cmdKey: "silvery-star.switch-single", 
    desc: ["single模式", "[任意内容] #{OPT}"], 
    headers: "switch_single", 
    main: "achieves/switch", 
    onKey: "on",
    offKey: "off",
    regexps: [".+", "#{OPT}"],
    detail: "触发案例：#switch_single 空调 on"
};

/* mode - single */
const switchDivided: SwitchConfig = {
    type: "switch",
    mode: "divided", 
    cmdKey: "silvery-star.switch-divided", 
    desc: ["divided模式", "[任意内容]"], 
    headers: "", 
    main: "achieves/switch",
    onKey: "switch_divided_open",
    offKey: "switch_divided_close",
    regexps: [".+"],
    detail: "触发案例：#switch_divided_open 空调"
};

/* achieves/echo.ts */
import { defineDirective } from "@/modules/command/main";

export default defineDirective( "order", async i => {
    const isOn = i.matchResult.isOn;
    const [ device ] = i.matchResult.match;
    await i.sendMessage( `${ device }${ isOn ? "启动" : "关闭" }成功` );
} );
```


[number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number
[string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
[boolean]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean
[string-array]: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays