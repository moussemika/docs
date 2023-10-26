# 静态资源托管目录

默认情况下，框架不会对插件任何目录提供静态资源托管，这意味着无法在诸如 `.html` 前端文件中直接通过路径来访问指定资源。

通过配置 `publicDirs` 配置项，可以声明需要托管静态资源的目录列表，来实现对资源的路径式访问。

## 使用示例

`publicDirs` 的值类型为字符串数组，可配置一系列的静态资源的目录路径，需要注意的是，这些路径为相对于 `init.ts` 的相对路径。

以插件 `example` 为例：

```ts
export default definePlugin( {
    // ... other configration
    publicDirs: [ "assets/images", "views" ],
} );
```

这样配置后将对 `example/assets/images`、`example/views` 两个目录提供静态资源托管支持。通过 `/插件根目录名/资源路径` 即可访问目录中的指定资源。

例如对于 `views/index.js` 文件，可以通过 `/example/views/index.js` 路径来正常访问。

> 需要注意的是，无需专门对 `.html` 文件配置静态资源托管目录，框架原生支持 `.html` 文件的读取。但你仍需要为 html 文件中引用的资源提供静态资源托管。
