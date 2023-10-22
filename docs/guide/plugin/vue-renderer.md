# 公共 vue-renderer

> 废弃功能

我们在框架中提供了一个公共 vue-router 路由。你可以通过配置 `PluginSetting.renderer` 来接入此路由，配置项接收值如下：

```ts
interface PluginSetting {
    renderer?: boolean | {
        dirname?: string;
        mainFiles?: string[];
    };
}
```

| 属性名       | 说明                                                   | 类型       | 默认值          |
|-----------|------------------------------------------------------|----------|--------------|
| dirname   | 从插件目录下的第一级子文件中，指定插件渲染页面存放目录                          | string   | views        |
| mainFiles | 从指定 dirname 下的第一级子目录内，自动查找的 .vue 文件名称列表，将以左往右的顺序依次尝试 | string[] | \[ "index" ] |

设为 `true` 或配置参数对象来开启此支持，框架将会从该目录下按一定的规则加载 route 配置，这将允许你使用 `.vue 单文件组件` 的方式工程化的编写前端页面。

加载规则：

1、对于 `.vue` 文件，直接按文件名加载路由。  
2、对于目录，按照配置项 `mainFiles` 给出的列表，以从左到右的优先级在目录的第一级文件内查找并加载。例如对于配置项默认值 `[ "index" ]`，将会加载目录内的 `index.vue`。加载的路由路径将以**插件名称**即插件目录名称起始。

## 示例

存在如下目录结构：

```text
- test-plugin
  - views
    - main.vue
    - test
      - app.vue
      - index.vue
  - init.ts
```

test-plugin/init.ts：

```ts
export async function init( bot: BOT ): Promise<PluginSetting> {
    return {
        name: "test-plugin",
        cfgList: [],
        renderer: {
            dirname: "views"
        }
    }
}
```

加载后的路由结果为：
```ts
[
    {
        path: "/test-plugin/main",
        component: () => import("#/test-plugin/views/main.vue")
    },
    {
        path: "/test-plugin/test",
        component: () => import("#/test-plugin/views/test/index.vue")
    }
]
```

> 仅指定目录下的第一级 .vue 文件与第一级文件中存在 index.vue 的目录进行加载，不会对不符合加载条件的文件/目录进行处理。
> 需要注意的是，当你希望使用本地静态资源时，建议通过 **公共路径 public** 或 `import.meta.url` 来获取静态资源路径。可以参考 `src/web-console/frontend/utils/pub-use.ts` 写法实现，或参考 [vite 官方文档](https://cn.vitejs.dev/guide/assets.html#importing-asset-as-url)。请避免使用 express 提供的静态资源服务加载资源，将会导致无法打包前端代码的严重问题。

## 全局变量

开启公共 vue-renderer 服务后，`.vue` 单文件组件内可获取到环境全局挂载的变量 `ADACHI_VERSION`，指向当前框架版本。可直接通过 `window.ADACHI_VERSION` 使用。