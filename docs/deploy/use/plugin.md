# 使用插件

通过访问[插件库](https://github.com/SilveryStar/Adachi-Plugin)，可以查看并使用 bot 现存的部分插件。

## 安装插件

bot 的所有插件都应当存放至 `src/plugins` 目录下。

安装插件分为三步：

1. 进入 `src/plugins` 目录。
2. 通过插件库，访问相关插件的源码仓库，根据仓库文档提示，使用 git 拉取插件源码至 `src/plugins` 目录下。
3. 重启 bot，或是通过 `#reload` 指令重载全部插件。

以[热点新闻插件](https://github.com/BennettChina/hot-news)为例:

```bash
# 进入插件目录
cd src/plugins
# 阅读文档，获取安装指令
git clone https://ghproxy.com/https://github.com/BennettChina/hot-news.git
# 重启项目或重载全部插件
```

## 更新插件

### zip替换更新

通过从源码仓库下载压缩包，直接覆盖更新是一种可行的方式。但极不推荐这样做，这样将会丧失所有快捷更新的途径。

### 指令更新

向 bot 发送更新插件指令来实现快捷更新。以默认指令起始符与默认指令名为例，向 bot 发送 `#upgrade_plugins music` 后等待片刻，即可完成插 music 插件的更新：
```text
# 检查更新 music 插件
#upgrade_plugins music
# 检查更新全部插件
#upgrade_plugins
```

## 卸载插件

直接在 plugins 下删除对应插件目录即可