# 适配热更新插件指令

BOT 存在热更新插件指令 `upgrade_plugins`，如果你希望该指令能够作用于你的插件，就需要为插件声明添加 `repo` 属性。

```ts
return <PluginSetting>{
    pluginName: "example",
    cfgList: [echo],
    // repo 属性，仓库拥有者名称/仓库名称
    repo: "SilveryStar/example"
};
```

以上方式默认为 Master 分支，若你的插件并不在默认分支下，可使用对象的声明方式。

```ts
return <PluginSetting>{
    pluginName: "example",
    cfgList: [echo],
    // repo 属性
    repo: {
        owner: "SilveryStar", // 仓库拥有者名称
        repoName: "example", // 仓库名称
        ref: "main" // 分支名称
    }
};
```