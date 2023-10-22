# 工具类 Auth Api

## 基本类型定义

```ts
enum AuthLevel {
    Banned,
    User,
    Manager,
    Master
}
```

## set()

```ts
interface AuthorizationImplement {
    set( userID: number, level: AuthLevel ): Promise<void>;
}
```

- `userID` 目标用户 QQ
- `level` 要设置的用户权限等级

设置目标用户的权限等级。

## get()

```ts
interface AuthorizationImplement {
    get( userID: number ): Promise<AuthLevel>;
}
```

- `userID` 目标用户 QQ
- 返回值: 目标用户当前的权限等级

获取目标用户当前的权限等级。

## check()

```ts
interface AuthorizationImplement {
    check( userID: number, limit: AuthLevel ): Promise<boolean>;
}
```

- `userID` 目标用户 QQ
- `limit` 要比较的权限等级
- 返回值: 用户权限等级是否位于目标权限等级之上。

指定一个权限等级，比对目标用户当前的权限等级是否高于该等级（相同时同样返回 `true`）。