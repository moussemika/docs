# 公共 express-server

框架现已集成一个公共 express-server，插件开发者无需自行监听端口开启 express 服务。

## 使用公共 express-server

配置 `PluginSetting.server.routers` 即可接入公共 express-server。

### 示例

例如位于 `test-plugin/init.ts` 的入口文件有如下插件声明：

```ts
export default definePlugin( {
    name: "测试插件",
    cfgList: [],
    server: {
        routers: {
            "/api/info": express.Router().get( "/", async ( req, res ) => {
                res.send( true );
            } )
        }
    }
} );
```

此时可通过 `localhost:{renderPort}/test-plugin/api/info` 来访问该接口。

> tip：强烈建议使用该支持来注册插件的接口路由。自行创建 server 服务不仅会额外占用端口，还会导致你的插件无法使用 v3 新增的插件重载支持，除非你自行对自己的 server 服务进行注销重启。

## 静态资源服务器

公共 express-server 分别为 `public` 目录与插件目录注册了静态资源服务器。

### 插件独有

可通过 `localhost:renderPort/插件目录名/资源路径` 访问插件独有的静态资源服务器。如果你不希望使用 vue 编写渲染页面，可通过此支持来使用类似 v2 的渲染方式。

同时，当你希望在前端页面中引入本地资源时，则可以利用静态资源服务器来进行访问。

**示例**

存在如下目录结构：

```text
- test-plugin
  - assets
    - test.png
```

你可以在代码中通过如下方式加载 `test.png`。

```css
.test {
    background: url("/test-plugin/assets/test.png");
}
```

> 如果你使用 vue 编写渲染页面，则不建议你使用此种方式加载静态资源。

### 公共资源独有

可通过 `localhost:renderPort/` 来访问 `/public` 目录中的资源。

例如对于 `Adachi-BOT/public/assets/test-plugin/test.png`，可以通过以下方式进行访问：

```css
.test {
    background: url("/assets/test-plugin/test.png");
}
```

若你使用了[自动更新插件静态资源](./update-static-resource.md)支持，相关静态资源将会被下载到 `/public/assets/插件名` 目录下，此时使用此种方式来访问静态资源是最为有效的。不论是否使用了 `vue` 支持来编写页面。