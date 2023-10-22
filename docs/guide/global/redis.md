# redis 工具类

`Adachi-BOT` 使用了 `Redis` 作为数据库并简单的封装了一些常用方法。他们全部为返回 [Promise] 类型的异步方法。

可以通过翻阅 [工具类 Redis API](../../api/global/redis.md) 来查看工具类所包含的所有方法。

## 查看数据库连接状态

可以通过工具类的 `online` 的属性来判断当前数据库是否连接成功。

```ts
import bot from "ROOT";

bot.redis.online; // true
```

需要注意的是，所有对数据库的操作方法均需要等待 redis 连接成功后执行，否则将会得到一个 `Redis client is not online` 的错误。

## 存放简单数据

通常情况下，存储简单临时数据是最常用的使用方式。可以通过 `setString()` 与 `getString()` 来存取临时字段：

```ts
import bot from "ROOT";

( async () => {
    const key = "adachi-test.temp-data";
    // 存储临时内容
    await bot.redis.setString( key, 114514 );
    // 获取临时内容
    await bot.redis.getString( key ); // "114514"
} )();
```

需要注意的是，尽管允许存入 [Number] 类型的数据，但通过 `getString` 取出数据时，统一为 [String] 类型。

## 存放键值对对象

有时简单数据并不能满足我们需求，我们需要向数据库中存入较为复杂的键值对对象，例如: `{ a: 1, b: "2" }`。

此时可以向 Redis 中存入 [Hash] 类型对象。以 `setHash()` 与 `getHast()` 为例。 

```ts
import bot from "ROOT";

( async () => {
	const key = "adachi-test.temp-data";
	// 存储键值对对象内容
	await bot.redis.setHash( key, { a: 1, b: "2" } );
	// 获取键值对对象内容
	await bot.redis.getHash( key ); // { a: "1", b: "2" }
} )();
```

可以看到，我们存入的 a 为 [Number] 类型，从数据库中得到的结果却被转变为了 [String] 类型。这是 `Redis` 的制约之一。

不仅如此，[Hash] 类型仅允许存入 [String] 类型的键值。

因此当我们期望存入复杂类型的对象时可以通过 **JSON 转义** + [存储简单类型](#存放简单数据) 的实现思路来实现。

```ts
import bot from "ROOT";

( async () => {
	const key = "adachi-test.temp-data";
	// JSON 转义复杂数据结构
	await bot.redis.setString( key, JSON.stringify( { a: 1, b: [ 2, 3 ] } ) );
	// 获取 JSON 转义后的内容
	const data = await bot.redis.getString( key );
    // 解析内容
    JSON.parse( data ); // { a: 1, b: [ 2, 3 ] }
} )();
```

通过这种方式可以实现复杂结构的存储，且基本的数据类型格式也得到了保障。

## 删除键名数据

可直接通过 `deleteKey()` 来删除指定键名数据。

```ts
import bot from "ROOT";

bot.redis.deleteKey( "adachi-test.temp-data" );
```

也可以使用 `setTimeout()` 来为数据指定超时时间，数据将于指定时间之后自动删除。下面的数据将会在两秒后被自动删除

```ts
import bot from "ROOT";

( async () => {
    const key = "adachi-test.temp-data";
    await bot.redis.setString( key, 114514 );
    // 设置键值超时时间
    await bot.redis.setTimeout( key, 2000 )
    // 查看数据是否存在
    await bot.redis.getString( key ); // 114514
    setTimeout( async () => {
        // 2s 后查看数据是否存在
        await bot.redis.getString( key ); // ""
    }, 2000 );
} )();
```

在使用 `setString()` 方法时，其第三个参数允许在键值创建之初就设置键值的超时时间（不设置的永远不会超时）。因此上面的写法可以简化为：

```ts
import bot from "ROOT";

( async () => {
    const key = "adachi-test.temp-data";
    // 创建数据并设置超时时间
    await bot.redis.setString( key, 114514, 2000 );
    // 查看数据是否存在
    await bot.redis.getString( key ); // 114514
    setTimeout( async () => {
        // 2s 后查看数据是否存在
        await bot.redis.getString( key ); // ""
    }, 2000 );
} )();
```

## 操作 redis 实例对象

尽管我们封装了一系列操作数据库的方法，但可能依然不能符合开发者的使用需求。此时可以通过工具类提供的数据库实例对象 `client`，来直接操作第三方包 [node-redis](https://github.com/redis/node-redis) 提供的一系列方法与事件。

```ts
import bot from "ROOT";

bot.redis.client;
```

## 键名约定

redis 工具类中的所有操作都依托于键名进行，对此我们约制定了键名的格式规范。

简记为 `开发者.数据作用` 或 `插件名.数据作用` ，点号两侧均应使用 `kebab-case` ，如：`silvery-star.user-bind-id` 。


[Hash]: https://www.runoob.com/redis/redis-hashes.html
[Promise]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise
[Number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number
[String]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String