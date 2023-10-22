# 工具类 Command Api

## 工具类相关

### 属性

- `raws`: 指令配置项列表
- `cmdKeys`: 指令键值列表

### get()

```ts
interface Command {
    get( auth: AuthLevel, scope: MessageScope ): BasicConfig[];
}
```

- `auth` 权限等级
- `scope` 使用位置
- 返回值: [指令实例](#指令实例)列表

限制指令权限、指令范围，获取所匹配的[指令实例](#指令实例)列表。当未匹配到任何相关指令实例时，返回空数组。

### getSingle()

```ts
interface Command {
    getSingle( key: string, auth: AuthLevel, scope: MessageScope ): BasicConfig | undefined;
}
```

- `key` 指令的 `cmdKey` 值
- `auth` 权限等级，默认为 `AuthLevel.User`
- `scope` 使用位置，默认为 `MessageScope.Both`
- 返回值: [指令实例](#指令实例)

限制指令权限、指令范围，根据具体的 `cmdKey` 值获取相关的[指令实例](#指令实例)。当未匹配到任何相关指令实例时，返回 `undefined`。

### getUnion()

```ts
interface Command {
    getUnion( auth: AuthLevel, scope: MessageScope.Group | MessageScope.Private ): RegExp;
}
```

- `auth` 权限等级
- `scope` 使用位置
- 返回值: 正则表达式

根据指定范围和权限等级获得所有相关指令，并生成一个能够匹配这些指令的正则表达式。

### cmdRunError()

```ts
interface Command {
    cmdRunError( run: ( ...arg: any[] ) => any, userID: number, groupID: number ): Promise<void>;
}
```

- `run` 自定义方法
- `userID` 错误提示消息发送目标的用户 qq
- `groupID` 错误提示消息发送目标的用户所在群聊，当为私聊时，传递 `-1`

执行所接受的自定义方法。当方法执行错误时，捕获错误输出到日志，并向目标用户发送指令异常的消息提示。

### reload()

```ts
interface Command {
    reload(): Promise<void>;
}
```

重载指令列表，配合 `#reload` 指令使用开发者无需也不应该手动调用此方法。

当启动浏览器出错时，返回 `null`。

### refresh()

```ts
interface Command {
    refresh(): Promise<string>;
}
```

- 返回值: 刷新成功后的输出语句

重载指令列表，配合 `#refresh` 指令使用。开发者无需也不应该手动调用此方法。

### checkOrder()/checkSwitch()/checkEnquire()

- `cmd` [指令实例](#指令实例)
- 返回值: 是否为对应类型的[指令实例](#指令实例)

判断目标是否为对应类型的[指令实例](#指令实例)，本质为以诸如 `cmd.type === "order"` 的方式进行判断，仅为 `typescript` 支持而存在。

## 指令实例

下面一些方法的输出结果将以下面的指令对象为例：

```ts
const alias = {
    type: "switch",
    mode: "single",
    cmdKey: "silvery-star.alias-customize",
    desc: [ "修改别名", "#{OPT} [本名] [别名]" ],
    header: "alias",
    regexps: [ "#{OPT}", "[\\u4e00-\\u9fa5]+", "[\\w\\u4e00-\\u9fa5]+" ],
    main: "achieves/alias",
    onKey: "add",
    offKey: "rem",
};
```

### 基本类型定义

```ts
interface Unmatch {
    type: "unmatch";
    missParam: boolean;
    header?: string;
    param?: string;
}

type MatchResult = cmd.OrderMatchResult |
    cmd.SwitchMatchResult |
    cmd.EnquireMatchResult |
    Unmatch;

interface MatchResultMap {
    order: cmd.OrderMatchResult;
    switch: cmd.SwitchMatchResult;
    enquire: cmd.EnquireMatchResult;
}

type CommandFunc<T extends keyof MatchResultMap> = ( input: InputParameter<T> ) => any;
/* 指令入口对象 */
type CommandEntry = CommandFunc<"order"> | CommandFunc<"switch"> | CommandFunc<"enquire">;

/* 指令配置项 */
type ConfigType = cmd.OrderConfig |
    cmd.SwitchConfig |
    cmd.EnquireConfig;

interface FollowInfo {
    headers: string[];
    param: string;
}
```

### 指令属性

```ts
class BasicConfig {
    abstract type: "order" | "switch" | "enquire"; // 指令类型
    abstract run: CommandEntry; // 入口函数
    readonly auth: AuthLevel; // 权限
    readonly scope: MessageScope; // 使用范围：群聊/私聊
    readonly cmdKey: string; // 唯一 key 值
    readonly detail: string; // 详情
    readonly display: boolean; // 是否在 #help 中展示
    readonly ignoreCase: boolean; // 是否忽略大小写
    readonly enable: boolean; // 是否启用
    readonly raw: ConfigType; // 配置项完整对象
    readonly desc: [string, string]; // 描述内容
    readonly pluginName: string; // 所属插件名
    readonly priority: number; // 优先级大小
}
```

### match()

```ts
interface BasicConfig {
    match( content: string ): MatchResult;
}
```

- `content` 匹配目标内容
- 返回值: 匹配结果

使用指令实例自身的正则约束，对给定内容进行匹配。根据指令实例的类型不同（`order`、`switch` 或 `enquire`），返回不同的匹配结果。

### write()
    
```ts
interface BasicConfig {
    write(): any;
}
```

- 返回值: 指令的属性对象

得到由一些指令属性（`auth`、`scope` 等）所组成的基本对象。

### getFollow()

```ts
interface BasicConfig {
    getFollow(): FollowInfo;
}
```

- 返回值: 指令格式相关信息对象

得到一个对象，其包含了格式化后的指令使用格式的相关信息。主要用作在诸如帮助文档中展示，提示用户指令的使用格式。

```ts
detail.getFollow(); // { header: [ "#alias" ], param: "[add|rem] [本名] [别名]"  }
```

### getDesc()

```ts
interface BasicConfig {
    getDesc( headerNum?: number ): string;
}
```

- `headerNum` 可选，最终字符串中的指令头数量，多个指令头以 `|` 拼接。若不传递，则默认展示全部的指令头。
- 返回值: 序列化后的指令格式字符串

得到一个序列化后的指令格式字符串。主要用作在诸如帮助文档中展示，提示用户指令的使用格式。

```ts
detail.getDesc(); // "#alias [add|rem] [本名] [别名]"
```

### getCmdKey()

```ts
interface BasicConfig {
    getCmdKey(): string;
}
```

- 返回值: 序列化后的 `cmdKey` 字符串

得到一个序列化后的 `cmdKey` 字符串，用于 `#help -k` 中展示。

```ts
detail.getCmdKey(); // "修改别名 -- silvery-star.alias-customize"
```