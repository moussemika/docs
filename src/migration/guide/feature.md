# 功能增强

v3 解决了 v2 开发的部分痛点并作出了改善与增强，下面是条目摘要。

## 核心库

* [新增通用工具类 `utils`，可按需使用](../../api/utils/index)

## 插件

* [新增插件配置 `server`，所有插件共用同一个 `express` server](../../guide/plugin/public_server)
* [新增插件配置 `assets`，启用线上静态资源自动更新到本地的支持](../../guide/plugin/static_resource)
* [新增插件配置 `publicDirs`，对指定目录列表提供静态资源托管](../../guide/plugin/public_dirs)
* [新增插件配置 `subscribe`，对用户的订阅行为进行统一处理](../../guide/plugin/subscribe)
* [提供全新的插件配置文件注册方法，插件开发者不再需要手动处理配置文件内容的加载与刷新问题](../../guide/plugin/config_file)
* [新增插件生命周期 `mounted` 与 `unmounted` 钩子函数](../../guide/plugin/lifecycle#mounted)
* [新增设置插件别名方法 `setAlias`](../../guide/plugin/lifecycle#setalias)
* [新增刷新注册方法 `refreshRegister`，用于替代原来的 `bot.refresh.register`](../../guide/plugin/lifecycle#renderregister)
* [新增浏览器渲染工具类注册方法 `renderRegister`，为原来的 `bot.render.register` 的便捷使用版本](../../guide/plugin/config_file#configregister)

## 指令

* [新的插件指令配置属性 `priority`，用来指示指令的优先级大小](../directive/priority)
* [`OrderMatchResult` 类型新增 `match` 属性，开发者不再需要手动通过正则二次获取指令参数匹配值](../directive/order_match)