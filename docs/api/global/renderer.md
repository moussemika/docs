# 工具类 Renderer Api

## 基本类型定义

```ts
interface RenderSuccess {
    code: "ok";
    data: Sendable;
}

interface RenderError {
    code: "error";
    error: string;
}

export interface PageFunction {
    ( page: puppeteer.Page ): Promise<Buffer | string | void>
}

export type RenderResult = RenderSuccess | RenderError;
```

## 工具类相关

### register()

```ts
interface RenderMethods {
    register( route: string, defaultSelector: string ): Renderer;
}
```

- `route` 渲染实例基地址
- `defaultSelector` 渲染实例默认目标 css 选择器
- 返回值: [渲染实例](#渲染实例)

注册获取一个[渲染实例](#渲染实例)。

### launchBrowser()

```ts
interface RenderMethods {
    launchBrowser(): Promise<puppeteer.Browser | null>;
}
```

- 返回值: Puppeteer 浏览器对象 [Browser](https://pptr.dev/api/puppeteer.browser)

启动浏览器，并返回浏览器实例对象 [Browser](https://pptr.dev/api/puppeteer.browser)。若浏览器已启动则直接返回浏览器实例对象。

当启动浏览器出错时，返回 `null`。

### closeBrowser()

```ts
interface RenderMethods {
    closeBrowser(): Promise<void>;
}
```

关闭浏览器。

### restartBrowser()

```ts
interface RenderMethods {
    restartBrowser(): Promise<puppeteer.Browser | null>;
}
```

- 返回值: Puppeteer 浏览器对象 [Browser](https://pptr.dev/api/puppeteer.browser)

重启浏览器，并返回浏览器实例对象 [Browser](https://pptr.dev/api/puppeteer.browser)。

当启动浏览器出错时，返回 `null`。

### refresh()

```ts
interface RenderMethods {
    refresh(): Promise<string>;
}
```

- 返回值: 刷新成功后的输出语句

重启浏览器，配合 `#refresh` 指令使用。开发者无需也不应该手动调用此方法。

### screenshot()

```ts
interface RenderMethods {
    screenshot( url: string, viewPort: puppeteer.Viewport | null, selector: string ): Promise<string>;
}
```

- `url` 目标网页 url
- `viewPort` 页面视口配置
- `selector` 截图目标的 css 选择器
- 返回值: 截取图片的 base64 格式内容

打开指定的 url，对指定的元素截图，返回截取图片的 base64 格式内容。

通常情况下不建议使用此方法，开发者应当使用 [asBase64()](#asbase64) 来截图并获取 base64 内容。

### screenshotForFunction()

```ts
interface RenderMethods {
    screenshotForFunction( url: string, viewPort: puppeteer.Viewport | null, pageFunction: PageFunction ): Promise<string>
}
```

- `url` 目标网页 url
- `viewPort` 页面视口配置
- `selector` 截图目标的 css 选择器
- 返回值: 截取图片的 base64 格式内容

打开指定的 url，执行自定义的执行方法 `pageFunction`，将 `pageFunction` 方法的返回值原路返回。
若 `pageFunction` 未返回任何内容，则返回空字符串 `""`。

通常情况下不建议使用此方法，开发者应当使用 [asForFunction()](#asforfunction) 来进行自定义获取页面内容。

## 渲染实例

用于捕获页面内容，并输出为图片。内置基路由 `route` 与默认选择器 `defaultSelector`。

基路由将与 `config.base.renderPort` 以如下格式组成基地址。

```ts
const baseHttp = `http://localhost:${ bot.config.base.renderPort }${ this.route }`;
```

渲染实例所包含的方法均有 `route` 也就是目标网页的 url 参数，当此参数为**相对路径**时，将基于基地址 `baseHttp` 进行拼接。反之为诸如 `http://xxx.com` 的完整 url 时，基地址 `baseHttp` 无效。

### asBase64()

```ts
interface ScreenshotRendererMethods {
    asBase64( route: string, params?: Record<string, any>, viewPort?: puppeteer.Viewport | null, selector?: string ): Promise<RenderResult>;
}
```

- `route` 目标网页路径，可为相对路径或完整 url
- `params` 可选，将会解析为 html 参数字符串后拼接到最终网页路径后
- `viewPort` 可选，页面视口配置
- `selector` 可选，截图目标的 css 选择器，用于覆盖渲染实例的 `defaultSelector`
- 返回值: 渲染结果，data 类型为 `string`

打开指定的网页后，对选择器所指定的目标进行截图，并返回 `base64` 格式的图片内容。

### asSegment()

```ts
interface ScreenshotRendererMethods {
    asSegment( route: string, params?: Record<string, any>, viewPort?: puppeteer.Viewport | null, selector?: string ): Promise<RenderResult>;
}
```

- `route` 目标网页路径，可为相对路径或完整 url
- `params` 可选，将会解析为 html 参数字符串后拼接到最终网页路径后
- `viewPort` 可选，页面视口配置
- `selector` 可选，截图目标的 css 选择器，用于覆盖渲染实例的 `defaultSelector`
- 返回值: 渲染结果，data 类型为 `ImageElem`

打开指定的网页后，对选择器所指定的目标进行截图，并返回可直接用于发送的 `ImageElem` 格式的图片内容。

### asForFunction()

```ts
interface ScreenshotRendererMethods {
    asForFunction( route: string, pageFunction: PageFunction, viewPort?: puppeteer.Viewport | null, params?: Record<string, any> ): Promise<RenderResult>;
}
```

- `route` 目标网页路径，可为相对路径或完整 url
- `pageFunction` 自定义操作方法，接受一个 page 页面对象
    - `page` Puppeteer 页面对象 [Page](https://pptr.dev/api/puppeteer.page/)
    - 返回值: 自定义捕获到的内容
- `viewPort` 可选，页面视口配置
- `params` 可选，将会解析为 html 参数字符串后拼接到最终网页路径后
- 返回值: 渲染结果

打开指定的网页后，执行自定义的执行方法 `pageFunction`，将 `pageFunction` 方法的返回值原路返回。
若 `pageFunction` 未返回任何内容，则返回空字符串 `""`。