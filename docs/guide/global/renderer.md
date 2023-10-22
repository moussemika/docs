# renderer 工具类

Adachi-BOT 在启动之初会借助 [Puppeteer](https://pptr.dev/) 伴随后台无头模式启动一个 chromium 浏览器。

renderer 工具类则负责控制这个浏览器以进行截图或是其他定制化的操作。

翻阅 [工具类 Renderer API](../../api/global/renderer.md) 来查看工具类所包含的所有方法。

## 渲染实例

为了简化渲染页面内容输出为图片的操作，我们提供了一个封装了部分方法的渲染类。可通过 `register()` 方法来注册得到一个渲染实例。

```ts
import bot from "ROOT";

// 得到渲染实例
const render = bot.renderer.register( "/test-plugin", "#app" );
```

上面注册了一个渲染实例，调用该渲染实例的方法时，**相对路径**的目标将会基于基地址 `/test-plugin`，并默认选择 `#app` 元素进行渲染。

渲染实例提供了三个方法，可以以预设的方式输出图片，或是自定义输出图片逻辑。

### 预设方式

渲染实例中提供了 `asBase64()` 与 `asSegment()` 预设方法。这两个方法将会访问指定的页面，并对指定元素进行截图，得到截图内容。

```ts
const image = await render.asSegment( "test.html" );
```

两种方法除返回值不同外并无区别，其中 `asBase64()` 得到图片的 `base64` 格式，可用于进行其他二次封装操作。`asSegment()` 则得到可直接用于 bot 发送的图片消息内容。

### 自定义方式

如果预设方法不能满足开发者的需求。可以使用 `asForFunction()` 来自行决定渲染输出方式。

`asForFunction()` 将会先访问指定的页面，然后执行开发者提供的自定义方法来获取页面内容。

```ts
const image = await render.asSegment( "test.html", async page => {
    const element = await page.$( "#target" );
    const result = await element.screenshot( { encoding: "base64", type: "jpeg", quality: 100 } );
    return `base64://${ result }`;
} );
```

自定义方法接受一个 [Page](https://pptr.dev/api/puppeteer.page) 对象参数，可自定义执行页面相关操作。

`asForFunction()` 将会把自定义方法的返回值原样返回。当自定义方法未返回任何内容时，`asForFunction()` 返回空字符串 `""`。

## 操作浏览器

工具类同样提供了操作浏览器的相关方法。但除非特殊需要，我们并不建议开发者直接对浏览器进行操作。

### 获取浏览器实例

可以通过 `launchBrowser()` 获取浏览器实例。执行此方法时，若浏览器未启动则会先尝试启动浏览器（正常情况下 bot 的浏览器会一直在后台运行），反之直接返回浏览器实例。

开发者可以通过此浏览器实例来进行一些 [Puppeteer](https://pptr.dev/) 所提供的自动化操作。

```ts
import bot from "ROOT";

bot.renderer.launchBrowser().then( browser => {
    if ( browser ) {
        // 获取此 Browser 内所有打开页面的列表
        browser.pages();
    }
} )
```

当启动浏览器出错时，得到的浏览器实例对象 `borwser` 为 `null`。

### 关闭与重启浏览器

`closeBrowser()` 与 `restartBrowser()` 分别用于关闭与重启浏览器。如非必要，开发者不应操作此方法。