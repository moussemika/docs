# 新指令属性 priority

指令配置对象中新增属性 `priority`，指示指令的优先级大小，值为 `number` 类型，默认值为 `0`。

当两个指令因为配置重复等原因同时触发时，会根据优先级来决定触发对象。

在编写原生框架指令的增强版本时该属性尤为有效，可用来覆盖原生框架指令。

下面是一个在测试插件中编写帮助指令并覆盖插件帮助指令的示例：

```ts
export default definePlugin( {
    name: "测试插件",
    cfgList: [ {
        type: "order",
        cmdKey: "test.help",
        desc: [ "帮助", "(-k)" ],
        headers: [ "help" ],
        regexps: [ "(-k)?" ],
        main: "achieves/help",
        detail: "追加 -k 来查看指令 key 值",
        // 覆盖原 help 指令
        priority: 1
    } ]
} );
```

> `priority` 将会被输出到 `command.yml` 中，这将允许用户自行配置该项以决定指令优先级，插件配置中的定义仅作为初始值使用。