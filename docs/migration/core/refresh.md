# refresh 核心类变更

## 从全局核心类中移除

全局对象 `bot` 已不再包含 `refresh` 对象。现在你需要改为通过在插件钩子函数的形参中提供的 [refreshRegister](./new-plugin-entry.md#mounted) 方法来注册刷新事件。

当然如果你有特殊需要，必须使用 `refresh` 工具类中的方法。可通过以下方式来获取 `refresh` 实例对象。

```ts
import Refreshable from "@/modules/management/refresh";

const refresh = Refreshable.getInstance();
```

## refresh 注册方法变更

合并 `refresh.registerRefreshableFunc` 与 `refresh.registerRefreshableFile` 为 `refresh.register`。

`refresh.register` 包含三种类型参数，`obj`、`file` 与 `func`，前两者对应 `refresh.registerRefreshableFunc` 与 `refresh.registerRefreshableFile` 的参数格式，`func` 则直接传入回调函数即可。

刷新函数类型变更，允许使用同步函数，不再强制要求返回 `string` 类型的值。

```ts
interface RefreshTargetFun {
    ( ...args: any[] ): Promise<string | void> | string | void;
}

interface RefreshTargetFile {
    [P: string]: any;
    refresh: RefreshTargetFun;
}

type RefreshTarget<T extends "fun" | "file"> = T extends "fun" ? RefreshTargetFun : RefreshTargetFile;

interface RefreshableMethod {
    register( fileName: string, target: RefreshTarget<"file">, place?: PresetPlace ): void;
    register( target: RefreshTarget<"file"> ): void;
    register( target: RefreshTarget<"fun"> ): void;
}
```