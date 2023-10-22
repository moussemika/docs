# 工具类 Interval Api

## 基本类型定义

```ts
type IntervalType = "private" | "group";
```

## set()

```ts
interface IntervalImplement {
    set( id: number | string, type: IntervalType, time: number ): Promise<void>
}
```

- `id` 目标id（QQ号 / 群号）
- `type` 目标类型（用户 / 群聊）
- `time` 要设置的间隔时间，单位 ms

设置目标用户的响应间隔时间。

## get()

```ts
interface IntervalImplement {
    get( id: number | string, type: IntervalType ): number
}
```

- `id` 目标id（QQ号 / 群号）
- `type` 目标类型（用户 / 群聊）
- 返回值: 响应间隔时间，单位 ms

获取目标用户的响应间隔时间。

## check()

```ts
interface IntervalImplement {
    check( id: number | string, type: IntervalType ): boolean;
}
```

- `id` 目标id（QQ号 / 群号）
- `type` 目标类型（用户 / 群聊）
- 返回值: 是否处在响应间隔时间内

校验目标用户当前是否处于响应间隔时间内。