# 图片渲染器

若你的插件中有存在**发送自定义图片**的指令，那么你可能需要用到图片渲染器这个功能。

## 注册图片渲染器

图片渲染器本质为通过 [Puppeteer](https://pptr.dev/) 来打开指定路径的网页，并对指定的元素进行截图，并得到图片的 `base64` 格式内容。

### 常规注册方式

可通过 `renderer.register` 来注册得到一个图片渲染器，它的类型与使用方式如下：

```ts
interface RenderMethods {
    register( route: string, defaultSelector: string ): Renderer;
}

// 注册渲染器
const renderer = bot.renderer.register( "/test-plugin", "#app" );
// 截取路径 /test-plugin/test.html 的网页中 id 为 app 的元素，并得到图片的 base64 格式
renderer.asBase64( "/test.html" );
```

* route: 渲染器基地址，若你的所有待渲染页面均存在一个共同的基地址，可将其配置在此项，避免后续编写重复内容。反之请设置为 `/`；
* defaultSelector: 渲染器的默认 css 选择器，用于指定要在页面中截图的内容。

对于 `route` 参数，分为两种情况：

- 当使用框架集成的 vue-router 时，建议传递**插件名称**
- 当使用框架集成的静态资源服务器时，建议传递以 `plugins` 目录为基准的页面所在的目录路径，如 `/genshin/views`

### renderRegister

我们还为插件提供了更方便的渲染器注册方法，你可以在插件的 `mounted` 生命周期钩子中使用 `params.renderRegister` 来直接注册渲染器。

该方法仅需要 `defaultSelector` 一个参数，它将会自动获取插件根目录名称，以 `/插件目录名` 的格式作为基地址参数 `route` 向 `bot.renderer.register` 传递。

示例如下：

```ts
/* test-plugin 插件 */
export default definePlugin( {
    mounted( params ) {
        renderer = params.renderRegister( "#app" );
        // 等同于
        render = params.renderer.register( "/test-plugin", "#app" );
    }
} );
```

## 渲染器方法

我们为渲染器提供了三种渲染方法，类型如下：

```ts
interface ScreenshotRendererMethods {
    asBase64( route: string, params?: Record<string, any>, viewPort?: puppeteer.Viewport | null, selector?: string ): Promise<RenderResult>;
    asSegment( route: string, params?: Record<string, any>, viewPort?: puppeteer.Viewport | null, selector?: string ): Promise<RenderResult>;
    asForFunction( route: string, pageFunction: PageFunction, viewPort?: puppeteer.Viewport | null, params?: Record<string, any> ): Promise<RenderResult>;
}
```

这里对三种方法共同拥有的参数做出说明：

* route: 要打开的目标网站地址，相对于上面注册渲染器时提供的基地址而定。如目标地址为 `/test-plugin/test.html`，基地中定义了 `/test-plugin`，那么这里只需要指定为 `/test.html` 即可。
* viewPort: 可选参数，用于设置页面的视口，详见 [Viewport interface](https://pptr.dev/api/puppeteer.viewport)。
* params: 可选参数，对象格式，将被格式化为 `a=x&b=x` 的键值对格式跟随在 `route` 后，作为查询参数使用。

三者存在共同的返回值类型 `RenderResult`：

```ts
interface RenderSuccess {
    code: "ok";
    data: Sendable;
}

interface RenderError {
    code: "error";
    error: string;
}

export type RenderResult = RenderSuccess | RenderError;
```

即当渲染成功时，返回包含 `code` 与 截图内容 `data` 的对象，`code` 值为 `ok`。反之为包含 `code` 与 错误提示消息 `error` 的对象，`code` 值为 `error`。

### asBase64

存在 `selector` 参数，用于覆盖注册渲染器时所设置的默认 css 选择器。

当截图成功时，其返回的 `data` 永远为 `string` 类型，即 base64 字符串。

### asSegment

参数与 [asBase64](#asbase64) 完全一直，返回值类型有所不同。

此方法返回的 `data` 为 `ImageElem` 类型数据，可直接使用 `sendMessage` 发送或填入数组与其他可发送类型组合后使用 `sendMessage` 发送。

### asForFunction

此方法旨在满足开发者开放式的截图渲染需求，其接受一个允许开发者进行自定义行为的方法 `pageFunction`：

```ts
interface PageFunction {
    ( page: puppeteer.Page ): Promise<Buffer | string | void>
}
```

该方法接受一个 [puppeteer.Page](https://pptr.dev/api/puppeteer.page) 类型的参数 `page`，该参数是 puppeteer 中的页面对象，支持对当前页面进行几乎所有人工可以完成的操作。

当执行完编写的自定义行为后，你需要在此参数方法中返回一个 `Buffer | string | void` 类型的数据，这个数据将会通过 `toString` 处理后，作为 `asForFunction` 的返回值中的 `data` 内容进行返回。

> 若你未在 pageFunction 方法中返回任何内容，即 `void` 返回值类型，那么在最终的 `data` 属性中你将得到一个空字符串值 `""`。

