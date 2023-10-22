# file 工具类

`Adachi-BOT` 简单的封装了一些常用方法用于操作文件与路径，内置于 `file` 工具类中。

可以通过翻阅 [工具类 File API](../../api/global/file.md) 来查看工具类所包含的所有方法。

## 基本路径

基本所有 `file` 工具类的方法均存在一个可选的 `place` 基本路径参数，路径将以该参数作为基地址获取。

在工具类中内置了三个基本路径：

- `root` 项目根目录 `/`
- `config` 配置文件目录 `/config`
- `plugin` 插件目录 `/src/plugins`

## 同步方法与异步方法

基本所有方法均存在**同步**和**异步**两种类型。同步方法在命名上比异步方法多了一个 `sync`，例如 `isExist` 与 `isExistSync`。

其中异步方法均为返回 `Promise` 类型的方法。

而同步方法在执行时，会阻塞整个程序。因此建议执行较大内存开销的操作，尽可能使用异步方法。

```ts
import bot from "ROOT";

// 同步
const data = bot.file.loadYAMLSync( "adachi.yml", "config" );
// 异步
bot.file.loadYAML( "adachi", "config" ).then( data => {
    // ...
} )
```

## 获取工具类示例

本工具类并不依赖任何其他工具类，因此它是可以单独使用的。

当开发者无法保证代码执行时 `bot` 全局工具类能否加载完毕时，可以选择直接获取 `file` 实例使用。

```ts
import FileManagement from "@/modules/file";

// 获取 file 工具类实例
const fileInstance = FileManagement.getInstance();
fileInstance.loadYAMLSync( "adachi" );
```