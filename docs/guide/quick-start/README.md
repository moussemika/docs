# 开发者文档

本篇文档主要面向与开发者提供，无论你是想基于 `Adachi-BOT` 自行开发相关功能插件，又或是为本项目提供贡献，我们都强烈建议你阅读本篇文档内容。

## 启动项目

在部署完成项目后（与用户部署无异），执行此命令来以开发者模式启动项目：

```bash
pnpm dev
```

开发模式相较其他有下面几点不同：

- ~~代码变动后自动重载项目~~（因为某 `puppeteer` 不会正常退出导致内存占用爆满而暂时弃用）
- 自动热更新的 `web-console` 开发体验
- 较高的系统占用开销

需要注意的是，当开启 `webconsole.yml -> enable` 时，需要事先进入 `scr/web-console/frontend` 执行 `pnpm install` 命令，否则将会启动报错。

~~不能自动重载的话似乎与 `pnpm start` 没什么区别，如果不打算开发 `web-console` 的话使用 `pnpm start` 可能更好一点~~

## 其他 cli 命令

```bash
pnpm start # 生产环境启动，自动更新下载 web-console 静态资源
pnpm serve # 使用 pm2 以后台模式启动生产环境项目
pnpm restart # 重启通过 `pnpm serve` 启动的项目
pnpm stop # 停止并删除 `pnpm serve` 启动的项目
```