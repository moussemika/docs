# 插件声明

`插件(Plugin)` 是由开发者创建的 `指令(Command)` 的集合。注册插件只需要在 `/src/plugins` 目录下创建一个文件夹，然后完成「定义插件与指令」和「实现指令」两个步骤。

## 声明插件

声明插件只需在上文提到的文件夹中创建一个名为 `init.ts` 的文件，文件的格式如下：

```ts
// /src/plugins/example/init.ts
export default {
    name: "example",
    cfgList: [ {
        type: "order",
        cmdKey: "silvery-star.echo",
        desc: ["复读", "[任意内容]"],
        main: "echo",
        headers: ["echo"],
        regexps: [".+"]
    } ]
}
```

你可以通过 `definePlugin` 宏函数进行一层包装，来获取完善的 Typescript 类型支持。

```ts
// /src/plugins/example/init.ts
import { definePlugin } from "@/modules/plugin";

export default definePlugin( {
    name: "example",
    cfgList: [ {
        type: "order",
        cmdKey: "silvery-star.echo",
        desc: ["复读", "[任意内容]"],
        main: "echo",
        headers: ["echo"],
        regexps: [".+"]
    } ]
} );
```

## 插件属性

处于简化开发与减少重复操作需要，我们为插件提供了诸多属性。其类型结构如下：

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
    server?: {
        routers?: Record<string, Router>;
    };
    repo?: string | {
        owner: string;// 仓库拥有者名称
        repoName: string;// 仓库名称
        ref?: string;// 分支名称
    }; // 设置为非必须兼容低版本插件
    assets?: {
        /** 线上 manifest.yml 文件地址 */
        manifestUrl: string;
        /** 下载基地址 */
        downloadBaseUrl: string;
        /** manifest 文件中作为文件路径的字段名 */
        pathField?: string;
        /** 下载目录名称 */
        folderName?: string;
        /** manifest 文件中作为校验文件变动的字段名（最后修改时间/文件唯一值等） */
        modifiedField?: string;
        /** 超出最大更新数量后给予的提示消息 */
        overflowHandle?: ( assets: PluginAssetsSetting, pluginKey: string | undefined, bot: BOT ) => any;
        /** 此配置项列举的拓展名文件，当位于用户配置的忽略文件中时，仍下载更新，但仅更新新增内容不对原内容进行覆盖 */
        noOverride?: string[];
        /** 修改下载后的文件路径 */
        replacePath?: ( path: string, pluginKey: string | undefined, bot: BOT ) => string;
    }; // 从线上同步更新静态资源
    subscribe?: {
        name: string;
        getUser: ( bot: BOT ) => Promise<SubUser> | SubUser;
        reSub: ( userId: number, type: "private" | "group", bot: BOT ) => Promise<void> | void;
    }[];
    mounted?: PluginHook; // 钩子函数：插件加载完毕时触发
    unmounted?: PluginHook; // 钩子函数：插件卸载/重载时触发
}
```

下面将会对各属性做出说明。

### name

插件名称，将用于帮助图片展示等场景，你可以为其赋予任何易于阅读的内容。

### cfgList

插件所包含的指令列表，存放多个指令配置对象。

### server

可选配置，通过 `server.routers` 向公共 express-server 注册插件自用路由。

详情见 [公共 express-server](./public-server.md)。

### repo

可选配置，用于开启并配置插件热更新相关功能。

详情见 [适配热更新插件指令](./hot-update.md)

### assets

可选配置，是否启用框架自带的 oss 自动更新静态资源支持。传入**对象**或**指向 oss 清单文件的 url**来开启。

详情见 [下载插件静态资源](./static-resource.md)。

### subscribe

可选配置，使框架为你的插件提供完善的订阅相关支持。该项为值为一个订阅对象数组，对象中存在如下属性：

详情见 [订阅服务支持](./subscribe.md)。

### mounted

将在插件加载生命周期的最后后执行，支持同步或异步方法，接受类型为 `PluginParameter` 的形参，包含 `BOT` 工具类与额外的配置项注册方法 `configRegister`、渲染器注册方法 `renderRegister` 与别名设置方法 `setAlias`。

详情见 [生命周期钩子-mounted](./lifecycle.md#mounted)

### unmounted

在插件卸载或重载时执行，与 mounted 类型一致。强烈建议在此钩子中注销会影响插件重载的逻辑，如释放监听端口等。

详情见 [生命周期钩子-unmounted](./lifecycle.md#unmounted)
