# 破坏性变更

本页面列出了 v3 相比以前的所有非兼容变更。

## 项目环境

* `nodejs` 所需最低版本变为 `16+`
* [项目包管理工具由 `npm` 变更为 `pnpm`](../environment/README.md)
* [`redis` 所需最低部版本变更为 `v4+`](../environment/redis.md)

## 核心库

* [`bot.client` 类进行了适配 `go-cqhttp` 的重写](../core/README.md)
* [`config` 工具类重构](../core/config.md)
* [`refresh` 类从全局工具类中移除](../core/refresh.md)
* `file` 绝大多数方法改为异步，并同时提供了同步版本，例如 `loadYaml`（异步） 与 `loadYamlSync`（同步），建议尽可能地使用异步版本。
* [`file` 部分方法返回值变更为 `FileTypeResponse` 与 `FileStatusResponse` 类型对象](../../api/global/file.md#类型定义)
* [`renderer.register` 去除多余参数 `name` 与 `port`](../../guide/plugin/pic-render.md#常规注册方式)
* `renderer` 工具类中 `renderer.asCqCode` 方法更名为 `renderer.asSegment`，调用方式不变
* 移除 `whiteList` 工具类，并将其合并至 `bot.config.whiteList`。

## 插件

* 不再内置 `genshin` 插件，需要自行前往插件库下载
* [定义插件方式变更，由按需导出 `init` 命名函数改为默认导出**对象**](../plugin/README.md)
* [插件配置项 `fileName` 重命名为 `name`](../plugin/README.md)
* [`refresh` 注册方式变更，合并 `refresh.registerRefreshableFunc` 与 `refresh.registerRefreshableFile` 为 `refresh.register`](../core/refresh.md)

## 指令

* [指令入口函数写法变更，由按需导出 `main` 命名函数改为默认导出**匿名函数**](../directive/README.md)
* [`Enquire` 类型指令重写](../directive/enquire.md)

## 其他变化

* [`web-console` 的前端部分被抽离为一个独立的模块，需要预先执行一些操作来进行开发](../../guide/quick-start/web-console.md)
* `node-fetch` 第三方包版本变化，如果你有手动定义返回值类型的需求，现在则需要手动从 `node-fetch` 中引入 `Response` 类型的返回值
* `redis` 类方法设置了更为严格的类型限制，参考[xxx]()
* 所有路径别名追加 `\`，避免语义不明明。即 `@modules` 变为 `@/modules`，`#genshin` 变为 `#/genshin`。
* `.vue` 前端页面本地静态资源引入路径变更，参考[xxx]()