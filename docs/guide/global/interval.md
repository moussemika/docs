# interval 工具类

Bot 针对每个用户和群聊均有一定的响应间隔时间。在默认行为下，当 bot 对目标用户响应指令后的一段时间内，不会再对该群聊/用户所发出的任何消息作出响应。

开发者可以通过此工具类来获取/控制响应间隔时间，来实现一些自定义的操作。

具体 api 调用可以翻阅 [工具类 Interval Api](../../api/global/interval.md)

## 设置目标响应间隔时间

通过 `set()` 方法可以对指定目标设置响应间隔时间。

示例: 对 QQ 为 114514191 的用户设置 3s 的响应间隔时间，单位 ms：

```ts
import bot from "ROOT";

bot.interval.set( 114514191, "private", 3000 );
```

## 获取目标响应间隔时间

通过 `get()` 方法可以对指定目标设置响应间隔时间。

示例: 获取群号 为 114514191 的群聊的响应间隔时间，单位 ms：

```ts
import bot from "ROOT";

bot.interval.get( 114514191, "group" );
```

## 检测目标状态

通过 `check()` 方法可以检测指定目标是否处于响应间隔时间内。

示例：检测 QQ 为 114514191 的用户当前是否处于响应间隔时间内：

```ts
import bot from "ROOT";

bot.interval.check( 114514191, "private" );
```