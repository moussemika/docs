# 工具类 Redis Api

## 属性

### client

数据库的实例对象，可以直接操作第三方包 [node-redis](https://github.com/redis/node-redis) 一系列方法与事件。

### online

* 类型: [Boolean]

当前数据库是否成功连接。

## 类型定义

```ts
type Argument = Buffer | string;
type SetFieldValue = Argument | number;
/* set */
type SetValue =
	Record<string | number, SetFieldValue> |
	Map<SetFieldValue, SetFieldValue> |
	Array<[ SetFieldValue, SetFieldValue ]> |
	Array<SetFieldValue>;
```

## Common

通用方法。

### setTimeout()

```ts
interface DatabaseMethod {
    setTimeout( key: Argument, time: number ): Promise<void>;
}
```

- `key` 操作目标的键值
- `time` 目标的过期时间，单位 ms

原型 [EXPIRE](https://redis.io/commands/expire) 。设置数据过期时间。

### deleteKey()

```ts
interface DatabaseMethod {
    deleteKey( ...keys: Argument[] ): Promise<void>;
}
```

- `keys` 待删除的数据的键值，可多个

原型 [DEL](https://redis.io/commands/del) 。删除数据。

### getKeysByPrefix()

```ts
interface DatabaseMethod {
    getKeysByPrefix( prefix: string ): Promise<string[]>;
}
```

- `prefix` 在数据库中匹配的键值前缀
- 返回值: 键名列表

原型 [KEYS](https://redis.io/commands/keys) 。根据键值前缀获取数据库中满足条件的键的列表。

## String

[字符串](https://www.runoob.com/redis/redis-strings.html) 相关方法。

### setString()

```ts
interface DatabaseMethod {
    setString( key: Argument, value: Argument | number, timeout?: number ): Promise<void>;
}
```

- `key` 操作目标的键值
- `value` 设置的值
- `timeout` 可选参数，数据过期时间，单位 ms ，默认不会过期

原型 [SET](https://redis.io/commands/set) 。设置一个字符串类型的数据。

### getString()

```ts
interface DatabaseMethod {
    getString( key: Argument ): Promise<string>;
}
```

- `key` 操作目标的键值
- 返回值: 键值内容

原型 [GET](https://redis.io/commands/get) 。获取一个字符串类型的数据。当键值不存在时，返回 `""` 。

## Hash

[哈希](https://www.runoob.com/redis/redis-hashes.html) 相关方法。

### setHash()

```ts
interface DatabaseMethod {
    setHash( key: Argument, value: SetValue ): Promise<void>;
}
```

- `key` 操作目标的键值
- `value` 目标的过期时间，单位 ms

原型 [HMSET](https://redis.io/commands/hmset) 。设置一个 Hash 类型的数据。

value 支持如下几种类型：

- 键值类型为 `SetFieldValue` 的对象：如 `{ k1: 1, k2: "2" }`
- 键值类型为 `SetFieldValue` 的 Map 对象：如 `Map(2) { "k1" => 1, "k2" => "2" }`
- 每一项类型为 `SetFieldValue` 的数组，如 `\[ "k1", "k2" ]`
- 每一项类型为 `SetFieldValue` 的二位数组，如 `\[ \[ "k1", 1 ], \[ "k2", "2" ] ]`

### getHash()

```ts
interface DatabaseMethod {
    getHash( key: Argument ): Promise<Record<string, string>>;
}
```

- `key` 操作目标的键值
- 返回值: 键值内容

原型 [HGETALL](https://redis.io/commands/hgetall) 。获取一个 Hash
类型数据的所有字段以及值，返回为 [Object](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays) 类型。当键值不存在时，返回 `{}`

### delHash()

```ts
interface DatabaseMethod {
    delHash( key: Argument, ...fields: Argument[] ): Promise<void>;
}
```

- `key` 操作目标的键值
- `fields` 待删除的字段名，可多个
- 返回值: `Promise<void>`

原型 [HDEL](https://redis.io/commands/hdel) 。删除一个 Hash 类型数据的部分字段。

### incHash()

```ts
interface DatabaseMethod {
    incHash( key: Argument, field: Argument, increment: number ): Promise<void>;
}
```

- `key` 操作目标的键值
- `field` 待操作的字段名
- `increment` 添加的值，可为整形或浮点型

原型 [HINCRBY](https://redis.io/commands/hincrby) 及 [HINCRBYFLOAT](https://redis.io/commands/hincrbyfloat) 。给一个 Hash
类型数据的某字段加上某值。

### existHashKey()

```ts
interface DatabaseMethod {
    existHashKey( key: Argument, field: Argument ): Promise<boolean>;
}
```

- `key` 操作目标的键值
- `field` 待判断的字段名
- 返回值: 是否包含

原型 [HEXISTS](https://redis.io/commands/hexists) 。判断一个 Hash 类型数据中是否包含某字段。

### setHashField()

```ts
interface DatabaseMethod {
    setHashField( key: Argument, field: SetFieldValue, value: SetFieldValue ): Promise<void>;
}
```

- `key` 操作目标的键值
- `field` 待操作的字段名
- `value` 赋值的值

原型 [hmset](https://redis.io/commands/hmset/) 。将一个 Hash 类型数据中的某一个字段设置为对应的值。

### getHashField()

```ts
interface DatabaseMethod {
    getHashField( key: Argument, field: Argument ): Promise<string>;
}
```

- `key` 操作目标的键值
- `field` 待操作的字段名
- 返回值: 字段的值

原型 [hget](https://redis.io/commands/hget/) 。用于返回一个 Hash 类型中指定字段的值。

## List

[列表](https://www.runoob.com/redis/redis-lists.html) 相关方法。

### getList()

```ts
interface DatabaseMethod {
    getList( key: Argument ): Promise<string[]>;
}
```

- `key` 操作目标的键值
- 返回值: 键值列表数据

原型 [LRANGE](https://redis.io/commands/lrange) 。获取一个完整的 List 类型数据。当键值不存在时，返回 `[]` 。

### getListLength()

```ts
interface DatabaseMethod {
    getListLength( key: Argument ): Promise<number>;
}
```

- `key` 操作目标的键值
- 返回值: 目标键值列表长度

原型 [LLEN](https://redis.io/commands/llen) 。获取一个 List 类型数据的长度。当键值不存在时，返回 `0` 。

### addListElement()

```ts
interface DatabaseMethod {
    addListElement( key: Argument, ...value: Argument[] ): Promise<void>;
}
```

- `key` 操作目标的键值
- `value` 待添加的数据，可多个

原型 [RPUSH](https://redis.io/commands/rpush) 。向一个 List 类型数据中添加若干数据。

### delListElement()

```ts
interface DatabaseMethod {
    delListElement( key: Argument, ...value: Argument[] ): Promise<void>;
}
```

- `key` 操作目标的键值
- `value` 待删除的数据，可多个

原型 [LREM](https://redis.io/commands/lrem) 。从一个 List 类型数据中删除若干数据。

### existListElement()

```ts
interface DatabaseMethod {
    existListElement( key: Argument, value: SetFieldValue ): Promise<boolean>;
}
```

- `key` 操作目标的键值
- `value` 待判断的数据
- 返回值: 是否存在

判断一个 List 类型数据中是否包含某数据，传入的 value 将会被转为 [String] 进行判断。

## Set

[集合](https://www.runoob.com/redis/redis-sets.html) 相关方法。

### getSet()

```ts
interface DatabaseMethod {
    getSet( key: Argument ): Promise<string[]>;
}
```

- `key` 操作目标的键值
- 返回值: 目标键值内容

原型 [SMEMBERS](https://redis.io/commands/smembers) 。获取一个 Set 类型数据。当键值不存在时，返回 `[]` 。

### getSetMemberNum()

```ts
interface DatabaseMethod {
    getSetMemberNum( key: string ): Promise<number>;
}
```

- `key` 操作目标的键值
- 返回值: 目标键值所得集合长度

原型 [SCARD](https://redis.io/commands/scard) 。获取一个 Set 类型数据中含有的成员的数量。当键值不存在时，返回 `0` 。

### addSetMember()

```ts
interface DatabaseMethod {
    addSetMember( key: Argument, ...value: Argument[] ): Promise<void>;
}
```

- `key` 操作目标的键值
- `value` 待添加的数据，可多个

原型 [SADD](https://redis.io/commands/sadd) 。向一个 Set 类型数据中添加若干数据。

### delSetMember()

```ts
interface DatabaseMethod {
    delSetMember( key: Argument, ...value: Argument[] ): Promise<void>;
}
```

- `key` 操作目标的键值
- `value` 待删除的数据，可多个

原型 [SREN](https://redis.io/commands/srem) 。从一个 Set 类型数据中删除若干数据。

### existSetMember()

```ts
interface DatabaseMethod {
    existSetMember( key: Argument, value: Argument ): Promise<boolean>;
}
```

- `key` 操作目标的键值
- `value` 待判断的数据
- 返回值: 是否存在

原型 [SISMEMBER](https://redis.io/commands/sismember) 。判断一个 Set 类型数据中是否包含某数据。

[Boolean]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean