# config 工具类

bot 在启动之初会在 `config` 目录下创建一系列配置文件。而该工具类所做的就是获取这些配置文件内容，并使开发者能够较为方便的实时获取它们。

工具类本质为一个对象，包含一个 `register()` 方法与多个与配置文件名同名的属性。如 `config.base` 对应 `base.yml`、`config.directive` 对应 `directive.yml`。

具体 api 调用可以翻阅 [工具类 Config Api](../../api/global/config.md)

## 配置文件对象

每与配置文件名同名的属性均为一个[配置文件对象](../../api/global/config.md#配置文件对象)。

### 配置文件内容

以获取配置文件 `base.yml` 中的 `master` 号码为例，调用方式：

```ts
import bot from "ROOT";

bot.config.base.master;
```

其他配置文件的详细内容参考 [基本配置](../../config/base.md)

### 注册配置文件重载事件监听

开发者可能期望当配置文件发生变化时执行一些自己的操作。例如某个属性值依赖于配置文件的 `master` 属性，那么当 `master` 发生变化时，理应同步更改这个属性值。

那么可以通过配置文件对象携带的 `on()` 方法，来监听配置文件内容的变化。

```ts
// 以 base.yml 举例
bot.config.base.on( "refresh", ( newCfg, oldCfg ) => {} );
```

该事件当且仅当**文件内容发生变化**并**执行了`#refresh`指令**时触发，并默认情况下向发送指令方发送提示 `xxx.yml 重新加载完毕`。

其中回调函数参数 `newCfg` 与 `oldCfg` 分别表示刷新前后的配置项值。

当回调函数返回 `string` 类型的值时，将替代默认的刷新成功的打印文本（如果你不希望发送任何提示消息，则返回 `""`）。

下面是一个示例，用于监控 `base.yml` 中的 `master` 内容变更，并同步到自定义的参数 `botMaster`。且当 `master` 内容变更时，发送响应消息 `bot 主人账号重载成功`，反之不发送任何内容。

```ts
import bot from "ROOT";

let botMaster = bot.config.master;
bot.config.base.on( "refresh", ( newCfg, oldCfg ) => {
    if ( newCfg.master !== oldCfg.master ) {
        botMaster = newCfg.master;
        return "bot 主人账号重载成功";
    }
    return "";
} );
```

### 清除配置文件重载事件监听事件

可以通过配置文件对象携带的 `clear()` 方法，来清除配置文件重载事件监听事件。

```ts
import bot from "ROOT";

bot.config.base.clear( "refresh" );
```

> 注意：这将会清除掉 bot 对应配置文件对象的重载事件，对应配置文件将无法正常响应 `#refresh` 重载指令。若非你有特殊要求（例如重写框架的重载逻辑），否则我们不建议开发者操作该方法。

## 注册插件配置文件

可通过 `register()` 方法来为插件注册并创建一个配置文件，具体请查看 [注册插件配置文件](../../guide/plugin/config-file.md#注册插件配置文件)。