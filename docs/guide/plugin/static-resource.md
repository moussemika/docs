# 下载插件静态资源

框架中为插件提供了自动更新静态资源支持，可通过比对本地与线上的清单文件来进行插件静态资源的自动更新与下载。通过 `PluginSetting.assets` 进行配置，配置项接收值如下：

```ts
interface PluginAssetsSetting  {
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
    /** 超出最大更新数量执行的回调方法 */
    overflowHandle?: ( assets: PluginAssetsSetting, pluginKey: string | undefined, bot: BOT ) => any;
    /** 此配置项列举的拓展名文件，当位于用户配置的忽略文件中时，仍下载更新，但仅更新新增内容不对原内容进行覆盖 */
    noOverride?: string[];
    /** 修改下载后的文件路径的回调方法 */
    replacePath?: ( path: string, pluginKey: string | undefined, bot: BOT ) => string;
}
```

## 配置项释义

### manifestUrl

线上清单文件地址，清单文件内容为**全部静态资源文件信息对象的数组**，要求格式为 `.yml`。

每个信息对象应至少包含两个字段：文件基于下载根地址的路径 `pathField`（包含文件名）与修改状态标识符 `modifiedField`（例如修改时间）。

清单文件可自己手动生成，也可以使用对应平台的 api 生成。例如阿里云 oss 清单文件的生成可参考 [Node.js列举文件 listV2](https://help.aliyun.com/document_detail/111389.html) 来实现。

### downloadBaseUrl

下载基地址。

例如图片的下载地址为 `https://mari-plugin.oss-cn-beijing.aliyuncs.com/Version3/help/fonts/xxx.ttf`, 而信息对象的 `pathField` 为 `Version3/help/fonts/xxx.ttf`，此时此处应当填写 `https://mari-plugin.oss-cn-beijing.aliyuncs.com`。

### pathField

清单文件中作为文件路径的字段名，默认为 `name`。

### folderName

文件下载后所存放的目录的名称，默认为 `adachi-assets`。

### modifiedField

manifest 文件中作为校验文件变动的字段名（最后修改时间/文件唯一值等），默认为 `lastModified`。

### overflowPrompt

超出最大更新数量执行的回调方法。 参考下方 [更新限制](#更新限制)。

接受三个形参：

- `assets`: 当前插件的 `assets` 配置对象内容
- `pluginKey`: 当前插件根目录名
- `bot`: bot 全局工具类。由于函数执行时 `bot` 全局工具类并未被挂载到全局，无法通过 `import bot from "ROOT"` 的方式来获取。因此需要使用此处的 `bot` 形参。

### noOverride

默认值 `[ "yml", "json" ]`。此配置项列举的拓展名文件，当位于用户配置的忽略文件中时，仍下载更新，但仅更新新增内容不对原内容进行覆盖，参考下方 [更新时不完全覆盖](#更新时不完全覆盖)

### replacePath

修改下载后的文件路径，参考下方 [下载路径目录过多嵌套问题](#下载路径目录过多嵌套问题)

接受三个形参：

- `path`: 清单文件中当前遍历到的文件路径
- `pluginKey`: 当前插件根目录名
- `bot`: bot 全局工具类。由于函数执行时 `bot` 全局工具类并未被挂载到全局，无法通过 `import bot from "ROOT"` 的方式来获取。因此需要使用此处的 `bot` 形参。

## 下载地址

资源将会被下载至 `public/assets/插件根目录名` 下，可通过 `/assets/插件根目录名/xxx.png` 的方式获取资源。

## 更新限制

为了防止用户恶意消下载耗流量，比对资源差异的服务存在一定的文件数量限制，若超出限制则会返回 415 报错。此时你可以通过配置 `PluginSetting.assets.overflowPrompt` 来提示用户做一些操作比如前往你提供的地址进行资源的整包下载。

## 下载路径目录过多嵌套问题

oss 生成的清单文件可能存在路径多层嵌套的问题，下载时将会按路径依次嵌套目录。

如果你不希望出现过多的目录嵌套，可以配置 `PluginSetting.assets.replacePath` 来对路径进行处理，该配置项为一个方法，接受原路径为形参，返回处理后的路径。

下面的配置方式将会将路径 `Version3/genshin/artifact/冒险家/data.json` 重置为 `artifact/冒险家/data.json`。避免创建无用目录 `Version3`、 `genshin`。

```ts
export default definePlugin({
    assets: {
        manifestUrl: "https://xxx/",
        replacePath: path => {
            return path.replace( "Version3/genshin/", "" );
        }
    }
})
```

## 忽略文件清单

当文件下载完毕时，将会在 `/public/assets/插件名` 路径下生成一个忽略文件 `.adachiignore`，此文件配置方式与 `.gitignore` 类似，匹配到的目录或文件将不会被覆盖更新。

## 更新时不完全覆盖

对于搭建者可能会有的 diy 本地文件的需求，在搭建者配置**忽略文件清单**后，允许指定部分拓展名的文件依旧照常更新下载。但不会对本地文件直接覆盖，而是采用保留旧内容，仅更新新增部分的方式进行更新。
通过 `noOverride` 来配置拓展名列表。