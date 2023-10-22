# Cli 命令变更

v3 修改了部分命令命名，并使用 pnpm 来对依赖包进行管理。

```bash
# 全局安装 pnpm
npm i -g pnpm
# 设置淘宝镜像源
pnpm config set registry https://registry.npmmirror.com/
# 安装项目依赖（在项目根目录下）
pnpm install
```

## 项目相关

```bash
# 开发环境启动，提供热更新的 `web-console` 开发支持。
# 当开启 `webconsole.yml -> enable` 时，需要事先进入 `scr/web-console/frontend` 执行 `pnpm install` 命令。
# 系统占用开销较大，避免在线上环境使用此命令启动项目。
npm dev 

# 生产环境启动，对应 v2 版本的 `npm run win-start`。
npm start

# 使用 pm2 以后台模式启动生产环境项目，对应 v2 版本的 `npm run start`
npm serve

# 重启通过 `pnpm serve` 启动的项目
npm restart

# 停止并删除 `pnpm serve` 启动的项目
npm stop
```