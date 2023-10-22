# 工具类 Config Api

## 类型

工具类的内容本身为一个类型为 `BotConfig` 对象，类型定义如下：

```ts
export type BotConfig = Omit<BotConfigManagerImplement, "value"> & BotConfigValue;

interface BotConfigManagerImplement {
  readonly value: BotConfigValue,
  register<T extends Record<string, any>>(
          filename: string,
          initCfg: T,
          setValueCallBack?: ( config: T ) => T,
          pluginName?: string
  ) : ExportConfig<T>
}

interface BotConfigValue {
    base: ExportConfig<Omit<typeof initBase, "tip" | "inviteAuth"> & {
        logLevel: LogLevel;
        inviteAuth: AuthLevel
    }>;
    directive: ExportConfig<Omit<typeof initDirective, "tip">>;
    db: ExportConfig<Omit<typeof initDB, "tip">>;
    mail: ExportConfig<Omit<typeof initMail, "tip">>;
    autoChat: ExportConfig<Omit<typeof initAutoChat, "tip">>;
    whiteList: ExportConfig<Omit<typeof initWhiteList, "tip" | "user" | "group"> & {
        user: number[];
        group: number[];
    }>;
    banScreenSwipe: ExportConfig<Omit<typeof initBanScreenSwipe, "tip">>;
    banHeavyAt: ExportConfig<Omit<typeof initBanHeavyAt, "tip">>;
    webConsole: ExportConfig<Omit<typeof initWebConsole, "tip">>;
}
```

该对象包含一个 `register` 方法与多个[配置文件对象](#配置文件对象)。

## 配置文件对象

即 `ExportConfig` 类型的对象，该对象支持自动重载，你无需做任何操作该对象即可自动响应 `#refresh` 指令进行数据重载更新。其包含对应的同名配置文件内容（例如 `base` 对应 `base.yml`），与 `on()`、`clear()` 方法。

### on(type, handle)

```ts
interface ConfigInstance<T extends Record<string, any>> {
    on( type: EventType, handle: EventHandle<T> ): void;
}
```

* `type` "refresh" 监听事件，目前仅存在 `"refresh"` 一种事件
* `handle` 事件回调函数，存在两个形参 `newCfg` 和 `oldCfg`
    * `newCfg` 事件触发后新的配置文件内容
    * `oldCfg` 事件触发前的旧配置文件内容
    * 返回值: 任意类型

注册一个事件监听，当配置对象发生指定 `type` 事件变化时，将会执行对应的 `handle` 回调函数。

下面将列举 `type` 所支持的类型。

**refresh**

目前唯一支持的事件类型，当 bot 执行 `#refresh` 配置文件内容发生了重载时触发事件。

其中回调函数参数 `newCfg` 与 `oldCfg` 分别表示刷新前后的配置项值。

当回调函数返回 `string` 类型的值时，将替代默认的刷新成功的打印文本：`xxx.yml 重新加载完毕`。

> 值得注意的是，你完全可以在 on 的回调函数中直接使用 config 配置项对象本身来作为新值使用。因为当执行回调函数时，配置项对象自身的值已经提前完成了更新。这在某些需要传递完整 config 类型的场景下格外有用。

```ts
import bot from "ROOT";

bot.config.base.on( "refresh", ( newCfg, oldCfg ) => {
    if ( newCfg.master !== oldCfg.master ) {
        return "bot 主人账号重载成功";
    }
} );
```

### clear(\[type])

```ts
interface ConfigInstance<T extends Record<string, any>> {
    clear( type?: EventType ): void;
}
```

* `type` 可选参数，待清除监听事件类型，目前仅存在 `"refresh"` 一种事件。

清空指定 `type` 的全部回调事件，若不传递 `type` 则清空所有回调事件。

## register()

```ts
interface BotConfigManagerImplement {
    register<T extends Record<string, any>>(
        filename: string,
        initCfg: T,
        setValueCallBack?: ( config: T ) => T,
        pluginName?: string
    ) : ExportConfig<T>
}
```

* `filename` 期望创建的文件名称，可填写基于 `config` 目录的相对路径，无需填写后缀名，将自动创建以 `.yml` 结尾的文件。
* `initCfg` 配置文件初始内容，用于与实际文件内容做比对，并进行缺失属性的填充。
* setValueCallBack 对配置对象的值进行自定义格式化处理，按照该回调函数指定的规则格式化实际配置文件内容，可用于预防用户错填属性值等情况。接受一个形参 config：
  * `config` 经过配置文件内容与初始内容比对后的配置项值
  * 返回值: 新的[配置文件对象](#配置文件对象)

通过该方法，开发者可以实现在 `config` 目录下创建自己的配置文件，或与已存在的配置文件做深层对比来更新新增的配置项。

方法的返回值与上文的 [配置文件对象](#配置文件对象) 类型一致，包含自己的配置文件内容与事件注册方法。