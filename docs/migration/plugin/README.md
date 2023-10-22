# 新的插件入口定义

v3 对插件入口的定义与配置项做出了较大幅度的修改。

## 插件入口函数格式变更

v3 插件不再以 `init` 函数的方式配置插件配置项，改为默认导出一个变量的方式。

```ts
// test-plugin/init.ts
export default {
    name: "测试插件",
    cfgList: [],
    mounted() {
        // 插件行为
    }
};
```

你可以通过 `definePlugin` 宏函数进行一层包装，来获取完善的 ts 类型支持。

```ts
import { definePlugin } from "@/modules/plugin";

// test-plugin/init.ts
export default definePlugin( {
    name: "测试插件",
    cfgList: [],
    mounted() {
        // 插件行为
    }
} );
```

## 新的插件配置项

```ts
export type PluginHook = ( input: PluginParameter ) => void | Promise<void>;

type SubUser = {
    person?: number[];
    group?: number[];
};

export interface PluginSetting {
    name: string;
    cfgList: cmd.ConfigType[];
    aliases?: string[];
    renderer?: boolean | {
        dirname?: string;
        mainFiles?: string[];
    };
    server?: {
        routers?: Record<string, Router>;
    };
    repo?: string | {
        owner: string;// 仓库拥有者名称
        repoName: string;// 仓库名称
        ref?: string;// 分支名称
    }; // 设置为非必须兼容低版本插件
    assets?: string | { // 是否从线上同步更新静态资源
        manifestUrl: string; // 线上 manifest.yml 文件地址
        downloadBaseUrl: string; // 下载基地址
        pathField?: string; // manifest 文件中作为文件路径的字段名
        modifiedField?: string; // manifest 文件中作为校验文件变动的字段名（最后修改时间/文件唯一值等）
        overflowPrompt?: string; // 超出最大更新数量后给予的提示消息
        noOverride?: string[];  // 此配置项列举的拓展名文件，当位于用户配置的忽略文件中时，仍下载更新，但仅更新新增内容不对原内容进行覆盖
        replacePath?: ( path: string ) => string; // 修改下载后的文件路径
    };
    subscribe?: {
        name: string;
        getUser: ( bot: BOT ) => Promise<SubUser> | SubUser;
        reSub: ( userId: number, type: "private" | "group", bot: BOT ) => Promise<void> | void;
    }[];
    mounted?: PluginHook; // 钩子函数：插件加载完毕时触发
    unmounted?: PluginHook; // 钩子函数：插件卸载/重载时触发
}
```

### name

插件名称，原 v2 的 `pluginName`。

由于 v3 使用插件根目录名称作为插件唯一标识符，因此此 name 目前允许重复且不再需要与目录名称保持一致，你可以为其赋予任何易于阅读的内容。

### server

可选配置，通过 `server.routers` 向公共 express-server 注册插件自用路由。

详情见 [公共 express-server](../../guide/plugin/public-server.md)。

### assets

可选配置，是否启用框架自带的 oss 自动更新静态资源支持。传入**对象**或**指向 oss 清单文件的 url**来开启。

| 属性名            | 说明                                                  | 类型                         | 默认值                 |
|----------------|-----------------------------------------------------|----------------------------|---------------------|
| manifestUrl    | oss 线上清单文件文件 url                                    | string                     | -                   |
| overflowPrompt | 超出最大更新数量后给予的提示消息                                    | string                     | 更新文件数量超过阈值，请手动更新资源包 |
| noOverride     | 此配置项列举的拓展名文件，当位于用户配置的忽略文件中时，仍下载更新，但仅更新新增内容不对原内容进行覆盖 | string[]                   | [ "yml", "json" ]   |
| replacePath    | 修改下载后的文件路径                                          | ( path: string ) => string | -                   |

详情见 [自动更新插件静态资源](../../guide/plugin/static-resource.md)。

### subscribe

可选配置，使框架为你的插件提供完善的订阅相关支持。该项为值为一个订阅对象数组，对象中存在如下属性：

| 属性名     | 说明               | 类型                                                                         |
|---------|------------------|----------------------------------------------------------------------------|
| name    | 订阅名称，用于在网页控制台中展示 | string                                                                     | -                   |
| getUser | 获取用户/群主id列表的方法   | ( bot: BOT ) => Promise\<SubUser>                                          |
| reSub   | 清除指定用户/群组订阅的方法   | ( userId: number, type: "private" \| "group", bot: BOT ) => Promise\<void> | void;    | 

详情见 [订阅服务支持](../../guide/plugin/subscribe.md)。

### mounted

将在插件加载生命周期的最后后执行，支持同步或异步方法，接受类型为 `PluginParameter` 的形参，包含 `BOT` 工具类与额外的配置项注册方法 `configRegister`、渲染器注册方法 `renderRegister` 与别名设置方法 `setAlias`。

### unmounted

在插件卸载或重载时执行，与 mounted 类型一致。强烈建议在此钩子中注销会影响插件重载的逻辑，如释放监听端口等。