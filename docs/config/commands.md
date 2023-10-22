---
sidebar: auto
---

# 指令配置

本篇针对 `config/commands.yml` 配置文件作出解释，该文件将会在 BOT 初次运行后生成，所以你并不能在启动 BOT 前配置指令。

## 基本结构

`Adachi-BOT` 中的指令被分为三类 `order`, `switch` 和 `enquire` ，你需要了解他们的共性和特性。每个指令都以 `cmdKey` 为顶级标识，你可以通过使用 `#help -k`
指令（或根据你的配置）来查看每个指令对应的 `key` 。每种指令都有四个公共配置字段：

### type

* 类型: `order|switch|enquire`

不可修改。

### auth

* 类型: `1|2|3`

最低操作权限，每个权限的限制如下：

* `1` 表示除封禁用户外所有人可使用
* `2` 表示 **BOT 管理员** 和持有者可使用
* `3` 表示只有持有者可使用

### scope

* 类型: `1|2|3`

指令使用位置，每个值的释义如下：

* `1` 表示仅群聊可使用
* `2` 表示仅私聊可使用
* `3` 表示群聊和私聊均可使用

### enable

* 类型: [boolean][boolean]

是否启用指令。

### display

* 类型: [boolean][boolean]

表示是否在 `help` 指令的返回内容中显示此指令。

### priority

* 类型: [number][number]

指令优先级，存在多个请求头相同的指令时，此值较大者将被触发。

## `Order` 类指令

`Order` 具有唯一可配置项 `headers` ，表示指令头，为数组类型，可以设置多个。默认情况下，指令头前会被添加上 `setting.yml` 中的 `header`
的值，如果你不想在某条指令加上它，可以在指令头前加上双下划线 `__` 。如:

```yaml
silvery-star.wish:
  type: order
  auth: 1
  scope: 3
  headers:
    - __wish
    - w
  enable: true
  priority: 0
```

这将为祈愿十连导出两个指令，`wish` `#w` ，当然，你也可以配置更多。

## `Switch` 类指令

`Switch` 拥有四个可配置项，`header`, `onKey`, `offKey` 和 `mode`。

* `mode` 开关模式，分为 `single` 和 `divided` ，它们的作用将在下面阐述
* `header` 指令头，只可配置一个，当 `mode` 设置为 `divided` 无效，此处同样可以通过双下划线来屏蔽 `setting` 中配置的 `header`
* `onKey/offKey` 表示开/关的关键词

`single` 模式表示单指令头，使用关键词区分开/关状态，如：

```yaml
# setting.yml => header: "#"
silvery-star.alias-customize:
  type: switch
  auth: 2
  scope: 3
  mode: single
  onKey: add
  offKey: rem
  header: alias
  enable: true
  priority: 0
# 导出指令 #alias [add|rem] [本名] [别名] 
```

`divided` 模式表示拆分指令头，使用指令头区分开/关状态，如：

```yaml
# setting.yml => header: ""
silvery-star.alias-customize:
  type: switch
  auth: 2
  scope: 3
  mode: divided
  onKey: 增加别名
  offKey: 删除别名
  header: ""
  enable: true
  priority: 0
# 导出指令 1. 增加别名 [本名] [别名]  2. 删除别名 [本名] [别名]
```

## `Enquire` 类指令

`Enquire` 类指令的配置项与 `Order` 指令相同，不做赘述。

```yaml
enquire.example:
  type: enquire
  auth: 1
  scope: 2
  headers:
    - ps
  enable: true
  priority: 0
```

[number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number
[string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
[boolean]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean