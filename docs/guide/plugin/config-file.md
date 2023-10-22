# 注册插件配置文件

通过 `PluginSetting.config.register` 方法，开发者可以实现在 `config` 目录下创建自己的配置文件，或与已存在的配置文件做深层对比来更新新增的配置项。

方法的详细内容可以查看 [config 工具类 Api-register](../../api/config.md#register)

## 示例

```ts
import bot from "ROOT";

// 在 config 目录下创建 test-plugin.yml 配置文件 或是与已存在的 test-plugin.yml 进行对比，返回更新后的配置项内容
const configData = bot.config.register( "test-plugin", { setting1: true, setting2: false }, config => {
    // 预防用户填写非 boolean 值
    if ( typeof config.setting1 !== "boolean" ) {
        config.setting = false;
    }
    return config;
} );
console.log( configData ); // { setting1: true, setting2: false }

// 注册刷新回调函数
let setting1 = configData.setting1;
configData.on( "refresh", ( newCfg, oldCfg ) => {
    setting1 = newCfg.setting1;
} );
```

若你不满足于自动推导得来的类型，或是你希望来进行一些关于初始值的限制与操作，该方法还支持传入第三个参数。

其接受一个 `config` 形参，即传入的配置对象，返回由你自行处理过的配置对象。

```ts
interface MyConfig {
    setting1: "msg" | "card";
    setting2: boolean;
}

// 在 config/test-plugin 目录下创建 main.yml 配置文件
const configData = <MyConfig>bot.config.register( "test-plugin/main", { setting1: "msg", setting2: false }, config => {
    if ( !["msg", "card"].includes( config.setting1 ) ) config.setting1 = "msg";
    return config;
} );
```

## configRegister

我们还为插件提供了更方便的配置文件注册方法，你可以在插件的 `mounted` 生命周期钩子中使用 `params.configRegister` 来快速在 `config/插件名` 目录中创建配置文件。

该方法参数传递方式与 `bot.config.register` 一致。

```ts
/* test-plugin 插件 */
export default definePlugin( {
    mounted( params ) {
        // 在 config 目录下创建 test-plugin/main.yml 配置文件
        const configData = params.configRegister( "main", { setting1: true, setting2: false } );
        console.log( configData ); // { setting1: true, setting2: false }
    }
} );
```