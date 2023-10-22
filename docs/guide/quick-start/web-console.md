# 网页控制台

## 准备工作

要开发网页控制台，需要先进行几项项准备工作：

1. 前往 `config/web-console.yml` 配置文件，将 `enable` 设置为 `ture`，开启网页控制台
2. 进入 `src/web-console/frontend` 目录，执行 `pnpm install`，安装相关依赖
3. 在项目根目录执行命令 `pnpm dev`，以开发模式启动项目

## 打包上传

> 在执行此操作前，需要先向开发者申请 `upload_token`，并填入自动生成的 `src/web-console/frontend/build_setting.yml` 中

前端开发完毕后，在 `src/web-console/frontend` 目录下，执行如下命令

```bash
pnpm build
```

这个命令将会对前端页面进行打包，并在打包完毕后上传至云服务器。用户启动 bot 时将会检测并自动拉取云端当前 `package.json` 的版本的新更新文件。

## 注意事项

1. 若仅对前端页面部分进行了修改，直接打包上传即可。
2. 若在修改了前端页面的同时，对后端内容也进行了修改，则务必修改根目录下的 `package.json` 的 `version` 版本号，然后再打包上传。
