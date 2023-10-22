# 指令

指令是 `Adachi-BOT` 设计中的「第一公民」，它以**对象**的形式在插件配置项 `cfgList` 中声明：

```ts
// /src/plugins/example/init.ts
import { definePlugin } from "@/modules/plugin";

export default definePlugin( {
    pluginName: "example",
    cfgList: [
        // 指令对象 1
        // 指令对象 2
    ]
} );
```

指令目前存在以下三种：`命令式(Order)` 、 `开关式(Switch)` 和 `问答式(Enquire)`，三种指令共享部分相同的配置属性，又各自存在自己独特的配置项。

## 通用配置项

位于 `src/modules/command/main.ts` 的 `CommandCfg` 表示了所有类型指令的公用配置属性，它的定义如下：

```ts
interface CommandCfg {
    cmdKey: string;
    desc: [ string, string ];
    main?: string | CommandEntry;
    detail?: string;
    auth?: AuthLevel;
    scope?: MessageScope;
    display?: boolean;
    ignoreCase?: boolean;
    priority?: number;
    start?: boolean;
    stop?: boolean;
}
```

下面将对每个属性进行逐一解释。

> 允许用户配置的属性将会被输出到 `command.yml`，你在此处的配置将会被视为初始值。

### cmdKey

* 类型: [string][string]
* 允许用户配置: `否`

必填项，表示指令的 `key`值，唯一指定，用于区分不同的指令。该值应简记为 `开发者.指令功能` 或 `插件名.指令功能` ，点号两侧均应使用 `kebab-case` ，如：`silvery-star.uid-query` 。

### desc

* 类型: [\[string, string\]](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types)
* 允许用户配置: `否`

必填项，对指令的基本描述。`desc[0]` 为对指令作用的简短描述，四字以内最佳；`desc[1]` 为指令的参数列表，视指令类型不同存在以下不同的形式：

- order: 必填参数用 `[]` 包裹，选填参数用 `()` 包裹，如 `"r(次数)d[面数]k(前k大)"`
- switch: 除 order 格式外，还可以使用 `#{OPT}` 来标识开/关关键词的位置。同样，该标识在 `divided` 模式中不生效
- enquire: 置空 `""`，因为 `enquire` 指令不存在指令参数

### main

* 类型: [string][string] | [CommandEntry](#commandfunc)
* 缺省值: `index`
* 允许用户配置: `否`

指令入口，为 [string][string] 类型时，视为文件路径地址，将会查找此路径相对于**插件目录**的目标文件，并将文件中默认导出的方法视为指令入口函数。

为 [CommandEntry](#commandfunc) 类型时，直接作为入口函数加载。

这是指令中最重要的属性，当用户发送的消息与对应指令的正则相匹配时，就会触发对应指令的入口函数，来运行指令所实现的功能。

> 通常情况下，建议使用入口文件的类型（即在此处配置文件路径）编写指令入口函数。这是为了代码直观程度考虑，除非你的指令实现的功能所占用代码篇幅非常小。

### detail

* 类型: [string][string]
* 缺省值: `"该指令暂无更多信息"`
* 允许用户配置: `否`

表示指令详细内容，当用户使用 `adachi.detail` 指令时将返回此字段。

### auth

* 类型: [AuthLevel](#authlevel)
* 缺省值: `AuthLevel.User`
* 允许用户配置: `是`

选填字段，[AuthLevel](#authlevel) 类型，缺省值为 `AuthLevel.User` 。表示允许使用该指令的最低权限。设置为 `AuthLevel.Banned` 时无效，被封禁用户无法使用任何指令。

### scope

* 类型: [MessageScope](#messagescope)
* 缺省值: `MessageScope.Both`
* 允许用户配置: `是`

允许使用该指令的位置（仅群聊 / 仅私聊 / 无限制）。

### display

* 类型: [boolean][boolean]
* 缺省值: `true`
* 允许用户配置: `是`

表示是否在 `adachi.help` 返回内容中显示此指令。

### priority

* 类型: [number][number]
* 缺省值: `0`
* 允许用户配置: `是`

表示指令的优先级大小，当两个指令因为配置重复等原因同时触发时，会根据此属性值的大小来决定触发对象。在编写原生框架指令的增强版本时该属性尤为有效，可用来覆盖原生框架指令。

### ignoreCase

* 类型: [boolean][boolean]
* 缺省值: `true`
* 允许用户配置: `否`

表示正则匹配是否忽略大小写。

> 需要注意的是，开启此选项后指令所接收到的用户输入内容将全部被转为小写内容，可能会导致内容的误识别。

### start

* 类型: [boolean][boolean]
* 缺省值: `true`
* 允许用户配置: `否`

生成的正则表达式是否在头部携带 `^`，即必须以此内容起始。

### end

* 类型: [boolean][boolean]
* 缺省值: `true`
* 允许用户配置: `否`

生成的正则表达式是否在尾部携带 `$`，即必须以此内容结束。

## 指令入口函数

即指令配置项 `main` 中所配置的内容，根据 `main` 配置项的类型，入口函数有内联和外联两种编写方式：

内联方式：

```ts
// 指令配置对象
const echo = {
  // ...
  main: i => {
      // 入口函数内容
  }
};
```

外联方式；

```ts
// 指令配置对象
const echo = {
  // ...
  main: "achieves/echo"
};

// 插件根目录/achieves/echo.ts
export default i => {
  // 入口函数内容
}
```

不论哪种方式，入口函数均接受一个 `InputParameter` 类型的入参对象，负责提供实现指令时可能需要使用到的工具和数据，详情可以查看 [InputParameter](#InputParameter)。

### typescript 类型支持

开发者可以通过 `defineDirective` 宏函数对指令入口函数进行一层包装，来获取完善的 Typescript 类型支持。
该宏函数接受两个参数：指令类型（`"order" | "switch" | "enquire"`）与指令入口函数。

内联方式：

```ts
import { defineDirective } from "@/modules/command/main";
// 指令配置对象
const echo = {
  // ...
  main: defineDirective( "order", i => {
      // 入口函数内容
  } )
};
```

外联方式；

```ts
// 指令配置对象
const echo = {
  // ...
  main: "achieves/echo"
};

// 插件根目录/achieves/echo.ts
import { defineDirective } from "@/modules/command/main";

export default defineDirective( "order", i => {
  // 入口函数内容
} );
```

> 在后面文档中将统一使用 **外联 + Typescript** 方式进行说明。

[number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number
[string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
[boolean]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean
[string-array]: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays