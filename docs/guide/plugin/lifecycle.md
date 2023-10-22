# 生命周期钩子

插件存在两个生命周期钩子：`mounted` 与 `unmounted`，均可以在插件配置对象中定义，支持同步或异步方法。他们使插件开发者可以在特定阶段运行自己的代码。

## 全部钩子函数

### mounted

bot 在启动后，将会依次加载所检测到的所有插件。待所有插件入口配置读取完毕后，将会依次执行每个插件的 `mounted` 钩子函数。

在插件重载时也会执行此钩子函数。

> 我们强烈推荐你在 `mounted` 生命周期钩子函数中进行原来的插件的初始化行为。这样可以有效的避免一些加载顺序导致的变量未定义情况，例如其他文件在通过 `import bot from "ROOT"` 使用框架库时提示 `bot 未定义`。

### unmounted

当插件重载时，会先执行此钩子函数。

> 由于重载会重新执行插件入口代码，请务必在此钩子函数中释放会多次重复加载的开销代码，或是监听的端口。

## 钩子函数参数

每一个钩子函数均接受类型为 `PluginParameter` 的形参，包含 `BOT` 核心类与额外的配置项注册方法 `configRegister`、渲染器注册方法 `renderRegister` 与别名设置方法 `setAlias`。

### setAlias

用于设置插件的别名，插件的别名可用于 更新插件、重载插件 等命令。

```ts
export default definePlugin( {
    // ...
    mounted( params ) {
        params.setAlias( [ "茉莉" ] );
    }
} );
```

### refreshRegister

其使用方式与原来的 `bot.refresh.register` 方法完全相同，为了替代后者而诞生。

```ts
export default definePlugin( {
    // ...
    mounted( params ) {
        params.refreshRegister( () => {
            // 刷新方法
        } );
    }
} );
```

### renderRegister

`PluginSetting.renderer.register` 的插件便捷使用方式。

免去了提供第一个参数 `route`，自动以 `/插件名（插件目录名）` 作为基地址来注册渲染器。