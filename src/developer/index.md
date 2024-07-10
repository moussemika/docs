# Adachi-Plugin 开发者文档

## 注册插件

`插件(Plugin)` 是由开发者创建的 `指令(Command)` 的集合。注册插件只需要在 `/src/plugins` 目录下创建一个文件夹，然后完成「声明」和「实现」两个步骤。

### 声明

声明插件只需在上文提到的文件夹中创建一个名为 `init.ts` 的文件，文件的格式如下：

```ts
// /src/plugins/example/init.ts
import {PluginSetting} from "@modules/plugin";
import {OrderConfig} from "@modules/command";

const echo: OrderConfig = {
    type: "order",
    cmdKey: "silvery-star.echo",
    desc: ["复读", "[任意内容]"],
    headers: ["echo"],
    regexps: [".+"]
};

// 不可 default 导出，函数名固定
export async function init(): Promise<PluginSetting> {
    return {
        pluginName: "example",
        cfgList: [echo]
    };
}
```

这是一个最简单的声明插件的例子，它声明了一个名为 `example` 的插件，同时定义了一个用于复读消息的 [Order类型](#order) 指令，下面我们来实现这个插件。

### 实现

每个指令都可以配置一个可选的 `main` 属性，表示实现这个指令的文件位置，或实现指令的函数，它的缺省值为 `index` ，即在 `init.ts` 的同一目录下的 `index.ts` 文件中实现，文件的格式如下：

```ts
// /src/plugins/example/index.ts
import {InputParameter} from "@modules/command";

// 不可 default 导出，函数名固定
export async function main(i: InputParameter): Promise<void> {
    await i.sendMessage(i.messageData.raw_message);
}
```

如此就可以非常简单的实现一个 `echo` 指令复读的功能。其中 [InputParameter](#inputparameter) 是 `main` 函数的入参对象，负责提供实现指令时可能需要使用到的工具和数据。

在此基础上，你可以通过下面提供的工具来实现功能各异的插件。

### 适配热更新插件指令

BOT 存在热更新插件指令 `upgrade_plugins`，如果你希望该指令能够作用于你的插件，就需要为插件声明添加 `repo` 属性。

```ts
return <PluginSetting>{
    pluginName: "example",
    cfgList: [echo],
    // repo 属性，仓库拥有者名称/仓库名称
    repo: "SilveryStar/example"
};
```

以上方式默认为 Master 分支，若你的插件并不在默认分支下，可使用对象的声明方式。

```ts
return <PluginSetting>{
    pluginName: "example",
    cfgList: [echo],
    // repo 属性
    repo: {
        owner: "SilveryStar", // 仓库拥有者名称
        repoName: "example", // 仓库名称
        ref: "main" // 分支名称
    }
};
```

### 适配 `web console` 订阅系统

如果你的插件存在用户私人订阅服务（即 BOT 将会定期主动向用户发送消息），我们强烈建议你能为插件抛出一个 `subInfo` 方法，来使 `web console` 能够更直观的为 BOT
持有则展示当前用户的订阅信息，以及支持**一键清除订阅**与**删除好友自动清除订阅**功能。该方法类型和实现方式如下：

```ts
export type SubInfo = {
    name: string; // 订阅名称
    users: number[]; // 用户 qq 号码列表
};

export type PluginSubSetting = {
    subs: (bot: BOT) => Promise<SubInfo[]>; // 订阅数据列表
    reSub: (userId: number, bot: BOT) => Promise<void>; // 清除订阅方法
}

export async function subInfo(): Promise<PluginSubSetting> {
    return {
        subs: subs,
        reSub: decreaseFriend
    }
}
```

## Global

### BOT

`BOT` 是 `Adachi-BOT v2.2.0+` 中定义全局工具类的接口，它被定义为：

```ts
interface BOT {
    readonly redis: Database;
    readonly config: BotConfig;
    readonly client: sdk.Client;
    readonly logger: log.Logger;
    readonly interval: Interval;
    readonly file: FileManagement;
    readonly auth: Authorization;
    readonly message: MsgManagement;
    readonly command: Command;
    readonly whitelist: WhiteList;
    readonly refresh: RefreshConfig;
    readonly renderer: BasicRenderer;
}
```

每个工具类的含义和包含的方法都会在后文中进行一一介绍。

这个接口实例整体会被传入 `init()`
，你可以通过 [解构对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#%E8%A7%A3%E6%9E%84%E5%AF%B9%E8%B1%A1)
的方式来获取其中的某个工具，以便进行声明插件的准备工作，如创建配置文件等。在代码的其他地方，你也可以通过下面的代码导入所有工具类。

```ts
import bot from "ROOT";
```

### InputParameter

指令实现的入参对象，被定义为：

```ts
type Message = oicq.PrivateMessageEventData |
    oicq.GroupMessageEventData;

type InputParameter = {
    sendMessage: SendFunc;
    messageData: Message;
    matchResult: MatchResult;
} & BOT;
```

#### `CommandFunc`

实际上，`main` 函数是这样被定义的：

```ts
type CommandFunc = (input: InputParameter) => void | Promise<void>;
```

换言之，在实现插件的函数内，你除了能获取所有的工具类，还能得到消息回复函数、消息事件数据和正则匹配结果。

## MessageScope

指令作用域，表示某条指令的可被触发范围，被定义为：

```ts
enum MessageScope {
    Neither,
    Group = 1 << 0,
    Private = 1 << 1,
    Both = Group | Private
}
```

## AuthLevel

权限等级，被定义为：

```ts
enum AuthLevel {
    Banned,
    User,
    Manager,
    Master
}
```

其中，`User` 是默认权限等级；`Master` 是持有者，最高权限等级。

## Command

事实上，指令才是 `Adachi-BOT` 设计中的「第一公民」。出于简化指令实现代码，强化用户配置的考虑，我们暂时将指令分为以下三种：`命令式(Order)` 、 `开关式(Switch)` 和 `询问式(Enquire)` 。

### CommandInfo

`CommandInfo` 表示了所有类型指令的公用配置属性，它的定义如下：

```ts
type CommandInfo = Required<Optional<BasicConfig>,
    "cmdKey" | "desc"> & { main?: string | CommandFunc };
```

这或许有些抽象，我们可以将其展开：

```ts
interface CommandInfo {
    cmdKey: string;
    desc: [string, string];
    detail?: string;
    auth?: AuthLevel;
    scope?: MessageScope;
    display?: boolean;
    ignoreCase?: boolean;
    main?: string | CommandFunc;
}
```

#### `cmdKey`

必填字段，[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) 类型。表示指令的 `key`
值，唯一指定，用于区分不同的指令。该值应简记为 `开发者.指令功能` 或 `插件名.指令功能` ，点号两侧均应使用 `kebab-case` ，如：`silvery-star.uid-query` 。

#### `desc`

必填字段，[[string, string]](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types) 类型。为对指令的基本描述。`desc[0]`
应为对指令作用的简短描述，四字最佳；`desc[1]` 应为指令的参数列表，视指令类型不同用不同的形式。

#### `detail`

选填字段，[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
类型，缺省值为 `"该指令暂无更多信息"` 。表示指令详细内容，当用户使用 `adachi.detail` 指令时将返回此字段。

#### `auth`

选填字段，[AuthLevel](#authlevel) 类型，缺省值为 `AuthLevel.User` 。表示允许使用该指令的最低权限。设置为 `AuthLevel.Banned` 时无效，被封禁用户无法使用任何指令。

#### `scope`

选填字段，[MessageScope](#messagescope) 类型，缺省值为 `MessageScope.Both` 。表示允许使用该指令的位置。

#### `display`

选填字段，[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) 类型，缺省值为 `true`
。表示是否在 `adachi.help` 返回内容中显示此指令。

#### `ignoreCase`

选填字段，[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) 类型，缺省值为 `true`
。表示正则匹配是否忽略大小写。

#### `main`

选填字段，[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
或 [CommandFunc](#commandfunc) 类型，缺省值为 `"index"` 。表示指令入口。

### Order

命令式指令。将指令分为「指令头」和「指令参数」两个部分，其中「指令头」用于区分不同的指令，「指令参数」用于进行功能的实现。它的定义如下：

```ts
type OrderConfig = CommandInfo & {
    type: "order";
    headers: string[];
    regexps: string[] | string[][];
    start?: boolean;
    stop?: boolean;
};
``` 

#### `type`

固定字段。

#### `headers`

必填字段，[string[]](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays)
类型。表示该指令的所有指令头，可由用户配置。所有的指令头前都会被添加上用户在 `setting.yml` 中配置的 `header` 属性，如果你想忽略它，请在你的指令头前添加双下划线 `__` 。

#### `regexps`

必填字段，[string[]](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays)
或 [string[][]](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays)
类型。表示该指令的所有正则匹配，不可由用户配置。该字段可以表示为一维或二维字符串数组，它们的含义分别是：

* 一维数组时，表示一个正则表达式。数组由「正则匹配单元」组成，如 `[ "(add|rem)", "\\d+" ]`
  ，在生成最终的正则表达式时，该指令头和该数组的所有元素被拼接起来，如 `/#example *(add|rem) *\d+/` 。
* 二维数组时，表示若干个正则表达式。数组由上一点提到的一维数组组成。

#### `start`

选填字段，[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) 类型，缺省值为 `true`
。表示是否要在最终正则表达式前添加 `^` 。

#### `stop`

选填字段，[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) 类型，缺省值为 `true`
。表示是否要在最终正则表达式后添加 `$` 。

#### `desc[1]`

必填字段，[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
类型。表示指令的参数列表，`Order` 型指令中，其中必填参数用 `[]` 包裹，选填参数用 `()` 包裹，如 `"r(次数)d[面数]k(前k大)"` 。

#### `messageDate.raw_message`

该值将会被去除指令头。注意，`ignoreCase` 设置为 `true` 时，`raw_message` 将为全小写字符串。

#### `OrderMatchResult`

`Order` 型指令，匹配成功后将返回给 `main` 函数匹配到的「指令头」。

```ts
interface OrderMatchResult {
    type: "order";
    header: string;
}
```

### Switch

开关式指令。这是「命令式指令」的一类特化。

```ts
type SwitchConfig = CommandInfo & {
    type: "switch";
    onKey: string;
    offKey: string;
    header: string;
    mode: "single" | "divided";
    regexp: string | string[];
    start?: boolean;
    stop?: boolean;
};
```

#### `type`

固定字段。

#### `onKey`

必填字段，[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
类型。表示指令状态为「开」的关键词。

#### `offKey`

必填字段，[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
类型。表示指令状态为「关」的关键词。

#### `header`

必填字段，[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
类型。表示该指令的唯一指令头，可由用户配置。指令头前都会被添加上用户在 `setting.yml` 中配置的 `header` 属性，如果你想忽略它，请在你的指令头前添加双下划线 `__` 。

#### `mode`

必填字段，["single" | "divided"](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)
类型。表示开关类指令的构成模式。

* 设置为 `single` 时，表示单指令头模式。开/关关键词将被 `|` 连接作为可选单元，最终被组装为形如 `header (on|off)` 的表达式。
* 设置为 `divided` 时，表示拆分指令头模式。此时 `header` 配置将被忽略，开关关键词将作为 `header` ，最终将被组装为形如 `(onKey|offKey) prams` 的表达式。

#### `regexp`

必填字段，[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
或 [string[]](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays)
类型。表示匹配的正则表达式不可由用户配置。该字段可以表示为字符串或一维字符串数组，它们的含义分别是：

* 字符串时，表示完整的表达式，将被直接拼接到指令头上。
* 一维数组时，同 [Order](#regexps) 指令中的 `regexps` 的一维数组清空。

特别的，`Switch` 指令还允许你在正则表达式中使用 `#{OPT}` 来标识开/关关键词的位置，如 `[ "#{OPT}", "\\d+" ]` ，这将导出如 `/#calc (add|sub) \d+/` 的指令。`#{OPT}`
标识在 `divided` 模式中不生效。

#### `start`

同 [Order - start](#start)

#### `stop`

同 [Order - stop](#stop)

#### `desc[1]`

在 `Switch` 类型中的指令描述中，你也可以使用 `#{OPT}` 来标识开/关关键词的位置。同样，该标识在 `divided` 模式中不生效。

#### `SwitchMatchResult`

```ts
interface SwitchMatchResult {
    type: "switch";
    switch: string;
    match: string[];

    isOn(): boolean;
}
```

`Switch` 型指令，匹配成功后将返回给 `main` 函数匹配到的关键词 `switch` ，关键词是否为 `onKey` 的函数 `isOn` 和剩余匹配结果列表 `match` 。

### Enquire

询问式指令。支持类似正常说话类型的指令解构。

```ts
interface RegUnit {
    regexp: string;
    senDesc: string;
}

type EnquireConfig = CommandInfo & {
    type: "enquire";
    sentences: string[];
    definedPair: Record<string, RegUnit>;
};
```

#### `type`

固定字段。

#### `sentences`

必填字段，[string[]](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays) 类型。表示「询问句式」。

#### `definedPair`

必填字段，[Record](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)<[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
, RegUnit> 类型。表示「句式单元」。这是 `Enquire` 类型指令的核心部分，通过开发者定义变量名和获取变量的正则表达式，来加强指令的可配置性。一个「句式单元」的组成如下：

* `camelCase` 的 `string` 类型变量作为 `key` ，这个 `key` 将被转化为 `SNAKE_CASE` 用于「询问句式」中，并被 `#{}`
  包裹，例如 `webConsole => #{WEB_CONSOLE}`。
* `RegUnit` 则是一个包含「正则匹配单元」和描述的对象，其中正则匹配单元将被替换到「询问句式」含标识符的位置，并被添加 `()` 包裹（所以你不需要为可选符号的外部添加括号）。

#### `desc[1]`

你不需要为 `Enquire` 类型配置 `desc[1]` ，保留空字符串即可。

#### `EnquireMatchResult`

```ts
interface EnquireMatchResult {
    type: "enquire";
    matchPair: Record<string, string>;
}
```

`Enqire` 型指令，匹配成功后将返回给 `main` 函数匹配到的所有「句式单元」表示的 `key` 和获取的 `value` 。

#### `#{HEADER}`

这是一个保留标识符，表示用户在 `setting.yml` 中配置的 `header` 属性，你也可以在 `sentences` 中直接使用它，无需定义。

#### Example

上面的内容并不容易让人理解 `Enquire` 指令的配置方法，下面将提供一个简单的实现 `Enquire` 指令的例子。

```ts
const simpleSentence: EnquireConfig = {
    type: "enquire",
    cmdKey: "tools.test",
    desc: ["简单句", ""],
    definedPair: {
        obj: {			// #{OBJ}
            regexp: "\\w+",
            senDesc: "宾语"
        },
        sub: { 			// #{SUB}
            regexp: "I|you|he|she",
            senDesc: "主语"
        },
        pred: { 		// #{PRED}
            regexp: "am|is|are",
            senDesc: "系动词"
        },
        verb: { 		// #{VERB}
            regexp: "\\w+",
            senDesc: "动词"
        },
        modalVerb: { 	// #{MODAL_VERB}
            regexp: "can|could|may|might",
            senDesc: "情态动词"
        }
    },
    sentences: [
        "#{SUB} #{PRED} #{OBJ}",
        // => /(I|you|he|she) (am|is|are) \w+/i
        "#{HEADER}#{MODAL_VERB} #{SUB} #{VERB} #{OBJ}"
        // => /#(can|could|may|might) (I|you|he|she) \w+ \w+/i
    ]
}
```

在这个例子中，我们定义了五个「句式单元」，并通过它们写了两个简单的询问句式，备注中写出了它们的导出正则。了解了定义后，实现就非常简单了：

```ts
import {InputParameter} from "@modules/command";

async function main(i: InputParameter): Promise<void> {
    console.log(i.matchResult);
}

/**
 * <= I am developer
 * => matchPair: { sub: "I", pred: "am", obj: "developer" }
 *
 * <= #Can you write code
 * => matchPair: {
 *        header: "#", modalVerb: "Can",
 *        sub: "you", verb: "write", obj: "code"
 *    }
 **/
```

## Database

`Adachi-BOT` 使用了 `Redis` 作为数据库并简单的封装了一些常用方法。

```ts
interface DatabaseMethod {
    // Common
    setTimeout(key: string, time: number): Promise<void>;

    deleteKey(...keys: string[]): Promise<void>;

    getKeysByPrefix(prefix: string): Promise<string[]>;

    // Hash
    setHash(key: string, value: any): Promise<void>;

    getHash(key: string): Promise<any>;

    delHash(key: string, ...fields: string[]): Promise<void>;

    incHash(key: string, field: string, increment: number): Promise<void>;

    existHashKey(key: string, field: string): Promise<boolean>;

    setHashField(key: string, field: string, value: string): Promise<void>
  
    getHashField(key: string, field: string): Promise<any>;

    // String
    setString(key: string, value: any, timeout?: number): Promise<void>;

    getString(key: string): Promise<string | null>;

    // List
    getList(key: string): Promise<string[]>;

    getListLength(key: string): Promise<number>;

    addListElement(key: string, ...value: any[]): Promise<void>;

    delListElement(key: string, ...value: any[]): Promise<void>;

    existListElement(key: string, value: any): Promise<boolean>;

    // Set
    getSet(key: string): Promise<string[]>;

    getSetMemberNum(key: string): Promise<number>;

    addSetMember(key: string, ...value: any[]): Promise<void>;

    delSetMember(key: string, ...value: any[]): Promise<void>;

    existSetMember(key: string, value: any): Promise<boolean>;
}
```

### Common

通用方法。

#### 键名约定

同 [cmdKey](#cmdkey) ，简记为 `开发者.数据作用` 或 `插件名.数据作用` ，点号两侧均应使用 `kebab-case` ，如：`silvery-star.user-bind-id` 。

#### `setTimeout`

**作用**

原型 [EXPIRE](https://redis.io/commands/expire) 。设置数据过期时间。

**参数列表**

* `key` 操作目标的键值
* `time` 目标的过期时间，单位 ms

#### `deleteKey`

**作用**

原型 [DEL](https://redis.io/commands/del) 。删除数据。

**参数列表**

* `...key` 待删除的数据的键值，可多个

#### `getKeysByPrefix`

**作用**

原型 [KEYS](https://redis.io/commands/keys) 。根据键值前缀获取数据库中满足条件的键的列表。

**参数列表**

* `prefix` 在数据库中匹配的键值前缀

### `String`

[字符串](https://www.runoob.com/redis/redis-strings.html) 相关方法。

#### `setString`

**作用**

原型 [SET](https://redis.io/commands/set) 。设置一个字符串类型的数据。

**参数列表**

* `key` 操作目标的键值
* `value` 设置的值，通常可以是 [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
  、[number](https://developer.mozilla.org/en-US/docs/Glossary/Number)
  或 [boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) 类型
* `timeout` 可选参数，数据过期时间，单位 ms ，默认不会过期

#### `getString`

**作用**

原型 [GET](https://redis.io/commands/get) 。获取一个字符串类型的数据。当键值不存在时，返回 `""` 。

**参数列表**

* `key` 操作目标的键值

### Hash

[哈希](https://www.runoob.com/redis/redis-hashes.html) 相关方法。

#### `setHash`

**作用**

原型 [HMSET](https://redis.io/commands/hmset) 。设置一个 Hash 类型的数据。

**参数列表**

* `key` 操作目标的键值
* `value` 设置的值，可以为 [Array](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays)
  和 [Object](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays) 两种类型：
    - `Array` 类型时，奇数位的元素为表示字段名的 `string` 类型的值，偶数位表示前一个元素的字段对应的值，如：`[ "k1", 1, "k2", "2" ]`
    - `Object` 类型时，传入一个对象，且它不应该嵌套数组或对象，如：`{ k1: 1, k2: "2" }`

#### `getHash`

**作用**

原型 [HGETALL](https://redis.io/commands/hgetall) 。获取一个 Hash
类型数据的所有字段以及值，返回为 [Object](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays) 类型。当键值不存在时，返回 `{}`
。

**参数列表**

* `key` 操作目标的键值

#### `delHash`

**作用**

原型 [HDEL](https://redis.io/commands/hdel) 。删除一个 Hash 类型数据的部分字段。

**参数列表**

* `key` 操作目标的键值
* `...fields` 待删除的字段名，可多个

#### `incHash`

**作用**

原型 [HINCRBY](https://redis.io/commands/hincrby) 及 [HINCRBYFLOAT](https://redis.io/commands/hincrbyfloat) 。给一个 Hash
类型数据的某字段加上某值。

**参数列表**

* `key` 操作目标的键值
* `field` 待操作的字段名
* `increment` 添加的值，可为整形或浮点型

#### `existHashKey`

**作用**

原型 [HEXISTS](https://redis.io/commands/hexists) 。判断一个 Hash 类型数据中是否包含某字段。

**参数列表**

* `key` 操作目标的键值
* `field` 待判断的字段名

#### `setHashField`

**作用**

原型 [hmset](https://redis.io/commands/hmset/) 。将一个 Hash 类型数据中的某一个字段设置为对应的值。

**参数列表**

* `key` 操作目标的键值
* `field` 待操作的字段名
* `value` 赋值的值

#### `getHashField`

**作用**

原型 [hget](https://redis.io/commands/hget/) 。用于返回一个 Hash 类型中指定字段的值。

**参数列表**

* `key` 操作目标的键值
* `field` 待操作的字段名

### List

[列表](https://www.runoob.com/redis/redis-lists.html) 相关方法。

#### `getList`

**作用**

原型 [LRANGE](https://redis.io/commands/lrange) 。获取一个完整的 List 类型数据。当键值不存在时，返回 `[]` 。

**参数列表**

* `key` 操作目标的键值

#### `getListLength`

**作用**

原型 [LLEN](https://redis.io/commands/llen) 。获取一个 List 类型数据的长度。当键值不存在时，返回 `0` 。

**参数列表**

* `key` 操作目标的键值

#### `addListElement`

**作用**

原型 [RPUSH](https://redis.io/commands/rpush) 。向一个 List 类型数据中添加若干数据。

**参数列表**

* `key` 操作目标的键值
* `...values` 待添加的数据，可多个

#### `delListElement`

**作用**

原型 [LREM](https://redis.io/commands/lrem) 。从一个 List 类型数据中删除若干数据。

**参数列表**

* `key` 操作目标的键值
* `...values` 待删除的数据，可多个

#### `existListElement`

**作用**

判断一个 List 类型数据中是否包含某数据。

**参数列表**

* `key` 操作目标的键值
* `value` 待判断的数据

### Set

[集合](https://www.runoob.com/redis/redis-sets.html) 相关方法。

#### `getSet`

**作用**

原型 [SMEMBERS](https://redis.io/commands/smembers) 。获取一个 Set 类型数据。当键值不存在时，返回 `[]` 。

**参数列表**

* `key` 操作目标的键值

#### `getSetMemberNum`

**作用**

原型 [SCARD](https://redis.io/commands/scard) 。获取一个 Set 类型数据中含有的成员的数量。当键值不存在时，返回 `0` 。

**参数列表**

* `key` 操作目标的键值

#### `addSetMember`

**作用**

原型 [SADD](https://redis.io/commands/sadd) 。向一个 Set 类型数据中添加若干数据。

**参数列表**

* `key` 操作目标的键值
* `...values` 待添加的数据，可多个

#### `delSetMember`

**作用**

原型 [SREN](https://redis.io/commands/srem) 。从一个 Set 类型数据中删除若干数据。

**参数列表**

* `key` 操作目标的键值
* `...values` 待删除的数据，可多个

#### `existSetMember`

**作用**

原型 [SISMEMBER](https://redis.io/commands/sismember) 。判断一个 Set 类型数据中是否包含某数据。

**参数列表**

* `key` 操作目标的键值
* `value` 待判断的数据

### client

如果上面的方法不足以实现你的需求，可以使用 `client` 获取数据库实例对象。

## BotConfig

`setting.yml` 内的配置数据，详见[配置](../config/base)。

## FileManagement

一套简单封装的文件管理方法。

```ts
type PresetPlace = "config" | "plugin" | "root";

interface ManagementMethod {
    // Common
    isExist(path: string): boolean;

    getFilePath(path: string, place?: PresetPlace): string;

    // File
    renameFile(fileName: string, newName: string, place?: PresetPlace): void;

    readFile(fileName: string, place: PresetPlace): string;

    // Dir
    createDir(dirName: string, place?: PresetPlace): boolean;

    getDirFiles(dirName: string, place?: PresetPlace): string[];

    // YAML
    createYAML(ymlName: string, data: any, place?: PresetPlace): boolean;

    loadYAML(ymlName: string, place?: PresetPlace): any;

    writeYAML(ymlName: string, data: any, place?: PresetPlace): void;

    updateYAML(ymlName: string, data: any, place?: PresetPlace, ...index: string[]): void;
}
```

### PresetPlace

表示用于定位目录的位置

* `root` 表示 `Adachi-BOT`
* `config` 表示 `Adachi-BOT/config` ，所有方法默认情况下都为此值
* `plugin` 表示 `Adachi-BOT/src/plugins`

### Common

#### `isExist`

判断某文件/目录是否存在，必须传入完整的路径（绝对路径）。

#### `getFilePath`

根据相对路径获取绝对路径。

### File

#### `renameFile`

更名文件，`fileName` 和 `newName` 均应为相对路径形式。

#### `readFile`

读取文件内容。

### Directory

#### `createDir`

创建目录。

#### `getDirFiles`

获取一个目录下的所有子级文件名。

### YAML

#### `createYAML`

创建 YAML 文件，并以 `data` 作为写入数据。

#### `loadYAML`

读取 YAML 文件，返回 [Object](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays) 类型数据。

#### `writeYAML`

覆盖写入 YAML 文件。

#### `updateYAML`

更新 YAML 文件。`index` 作为数据索引，将索引到的位置修改为 `data` 。

## BasicRenderer

`Adachi-BOT` 使用了 `puppeteer` 作为图片截图渲染工具，并简单封装了一些常用方法。

```ts
interface RenderSuccess {
    code: "ok";
    data: string;
}

interface RenderError {
    code: "error";
    error: string;
}

export type RenderResult = RenderSuccess | RenderError;

export interface PageFunction {
    (page: puppeteer.Page): Promise<Buffer | string | void>
}

export interface RendererMethods {
    asBase64(route: string, params?: Record<string, any>, viewPort?: puppeteer.Viewport | null, selector?: string): Promise<RenderResult>;

    asCqCode(route: string, params?: Record<string, any>, viewPort?: puppeteer.Viewport | null, selector?: string): Promise<RenderResult>;

    asForFunction(route: string, pageFunction: PageFunction, viewPort?: puppeteer.Viewport | null, params?: Record<string, any>): Promise<RenderResult>;
}

export interface RenderMethods {
    register(name: string, route: string, port: number, defaultSelector: string): Renderer;

    /* 浏览器相关 */
    closeBrowser(): Promise<void>;

    launchBrowser(): Promise<puppeteer.Browser>;

    restartBrowser(): Promise<void>;

    refresh(): Promise<string>;

    /* 截图 */
    screenshot(url: string, viewPort: puppeteer.Viewport | null, selector: string): Promise<string>;

    screenshotForFunction(url: string, viewPort: puppeteer.Viewport | null, pageFunction: PageFunction): Promise<string>
}
```

### RenderSuccess

成功截图返回的数据格式。

### RenderError

截图失败返回的数据格式

### RenderResult

截图返回的数据格式（成功或失败）

### PageFunction

手动自行编写 `puppeteer` 执行逻辑方法，来自行编写逻辑获取截图或其他你想借用 `Puppeteer` 进行的操作，接受一个 `puppeteer` 的 页面 `page`
对象，返回的数据将直接赋值给 `RenderSuccess` 中的 `data` 属性。

### ScreenshotRendererMethods

截图并将截图渲染成各种格式的方法集合，渲染类 `Renderer` 的实现了该接口。

#### `asBase64`

跳转打开一个指定的网页链接且传递相应参数，并对指定选择器截图，返回 `base64` 的图片格式。参数如下

* `router`: 要打开的网页路径（相对/绝对）
* `params`: 将会被转为合法的 URL 参数字符串 `paramStr`。
* `viewPort`: 浏览器设备参数，不传则不设置设备参数。
* `selector`: 用于选择截图目标的 css 选择器，默认为 `Renderer` 实例创建时传入的默认选择器。

当 `router` 为一个合法 URL 时，将直接使用 `router` 拼接 `paramStr` 生成链接地址。反正将 `router` 和 `paramStr` 与 `Renderer` 实例的默认本地路径 `httpBase`
拼接。

#### `asCqCode`

跳转打开一个指定的网页链接且传递相应参数，并对指定选择器截图，返回可直接发送的 `[CQ]` 消息格式。参数于方法 `asBase64` 相同。

#### `asForFunction`

跳转打开一个指定的网页链接且传递相应参数，并执行自定义的 `Puppeteer` 执行逻辑方法。`route`、`viewPort` 与 `params`参数同上，`pageFunction` 即 `PageFunction`
类型的自定义处理方法。

### RenderMethods

`Adachi-BOT` 使用了 `Puppeteer` 作为截图渲染工具并简单的封装了一些常用方法。

#### `register`

注册获取一个渲染实例，该实例实现了 `ScreenshotRendererMethods` 接口，可使用接口内的图片渲染方法。参数如下

* name: 渲染实例名称，暂时无用
* route: 渲染实力的基础路由
* port: 渲染实例的本地路径的端口号
* defaultSelector: 渲染实例的默认选择器

`port` 和 `route` 将生成渲染实例的默认本地路径 `httpBase`，即 `http://localhost:${ port }${ route }`。

#### `closeBrowser`

关闭所有页面并销毁当前打开的浏览器。

#### `launchBrowser`

启动浏览器，若当前已存在启动的浏览器则抛出错误信息：**浏览器已经启动**。

#### `restartBrowser`

关闭所有页面并销毁当前打开的浏览器后重启浏览器，并重置当前截图次数。

#### `screenshot`

打开指定 `url` 的网址，通过 `viewPort` 来设置页面参数，并对指定的 css 选择器 `selector` 所选中的元素进行截图，返回截图所得图片的 `base64` 格式。

#### `screenshotForFunction`

打开指定 `url` 的网址，通过 `viewPort` 来设置页面参数，并执行自定义的 `PageFunction` 类型的自定义处理方法，抛出经过 `toString` 处理的该方法返回的数据。

## Authorization

权限管理方法。

```ts
interface AuthorizationMethod {
    set(userID: number, level: AuthLevel): Promise<void>;

    get(userID: number): Promise<AuthLevel>;

    check(userID: number, limit: AuthLevel): Promise<boolean>;
}
```

## MsgManagement

消息管理方法。

```ts
interface MsgManagementMethod {
    getSendMessageFunc(userID: number, type: MessageType, groupID?: number): SendFunc;

    sendMaster(content: string): Promise<void>;
}
```

## RefreshConfig

可热更新的配置文件类，用于定义配置文件的热更新方法。

```ts
interface RefreshCatch {
    log: string;
    msg: string;
}

type RefreshTarget =
    { [key: string]: any } &
    { refresh(): Promise<string> };

interface RefreshConfigMethod {
    registerRefreshableFile(
        fileName: string, target: RefreshTarget, place?: PresetPlace
    ): void;

    registerRefreshableFunc(target: RefreshTarget): void;
}
```

### `RefreshCatch`

刷新时错误返回类型。在出现错误时需 `throw` 一个该类型的对象。

### `RefreshTarget`

配置文件类。我们要求你使用类来定义配置文件，且类中必须包含返回值为 [Promise\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
的公有函数 `refresh` 。下面以 `Cookies` 为例，介绍书写的格式：

```ts
class Cookies {
    private index: number;
    private cookies: string[];
    private length: number;

    constructor() {
        this.cookies = bot.file.loadYAML("cookies").cookies;
        this.index = 0;
        this.length = this.cookies.length;
    }

    public async refresh(): Promise<string> {
        try {
            this.cookies = bot.file.loadYAML("cookies").cookies;
            this.index = 0;
            this.length = this.cookies.length;
            return "cookies 重新加载完毕";
        } catch (error) {
            throw <RefreshCatch>{
                log: (<Error>error).stack,
                msg: "cookies 重新加载失败，请前往控制台查看日志"
            };
        }
    }
}
```

### `registerRefreshableFile`

**作用**

注册一个可刷新的配置文件，当 BOT 持有者使用 `adachi.refresh` 指令时，重新读取所有被注册的文件。

**参数列表**

* `fileName` 注册的配置文件的文件名
* `target` 实现 `RefreshTarget` 接口的类的实例对象，如 `new Cookies()`
* `place` 可选参数，见 [PresetPlace](#presetplace)

### `registerRefreshableFunc`

**作用**

注册一个可刷新的对象，当 BOT 持有者使用 `adachi.refresh` 指令时，重新加载该对象。

**参数列表**

* `target` 实现 `RefreshTarget` 接口的类的实例对象，如 `new Cookies()`

## Path Alias

`Adachi-BOT` 设有三个路径别名

- `@` -> `./src/`
- `#` -> `./src/plugins/`
- `ROOT` -> `app.ts`

导入路径名应尽可能简洁，并尽量避免多层 `../` 的出现。对于文件 `A.ts` ：

- 若 `B.ts` 与 `A.ts` 处于同级目录或 `B.ts` 在 `A.ts` 的同级文件夹的子级目录中，则应该使用 `./` 来引用
- 若 `B.ts` 在 `A.ts` 的祖级目录中，则应该使用 `@` 或 `#` 来引用