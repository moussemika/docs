# auth 工具类

Bot 内置了一套权限系统，在部分需要权限的场景（如响应指令），bot 将仅会对权限满足要求的用户相应操作。

内置的权限等级有（从大到小排列）: `Master（主人）`、`Manager（管理员）`、`User（普通用户）`、`Banned（封禁用户）`，高级的权限等级拥有自身和次一级的所有权限。 

开发者可以通过此工具类来获取/控制用户权限，来实现一些自定义的操作。

具体 api 调用可以翻阅 [工具类 Auth Api](../../api/global/auth.md)

## 设置用户权限等级

通过 `set()` 方法可以设置指定用户的权限等级。

示例: 赋予 QQ 为 114514191 的用户管理员权限：

```ts
import bot from "ROOT";
import { AuthLevel } from "@/modules/management/auth";

bot.auth.set( 114514191, AuthLevel.Manager );
```

## 获取用户权限等级

通过 `get()` 方法可以对指定目标设置响应间隔时间。

示例: 获取 QQ 为 114514191 的用户权限等级：

```ts
import bot from "ROOT";

bot.auth.get( 114514191 );
```

## 比对用户权限等级

通过 `check()` 方法可以比对用户是否具有某个权限等级的权限

示例：检测 QQ 为 114514191 的用户当前是否拥有管理员的权限：

```ts
import bot from "ROOT";
import { AuthLevel } from "@/modules/management/auth";

bot.auth.check( 114514191, AuthLevel.Manager );
```