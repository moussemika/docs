# 指令入口函数写法变更

新版指令入口函数取消了以往抛出 `main` 函数的写法，改为默认导出一个普通函数的方式。

```ts
// test-plugin/achieves/test.ts
export default async function ( i ) {
    // 指令行为
}
```

你可以通过 `defineDirective` 宏函数进行一层包装，来获取完善的 ts 类型支持。
该宏函数接受两个参数：指令类型（`"order" | "switch" | "enquire"`）与指令入口函数。

```ts
import { defineDirective } from "@/modules/command/main";

// test-plugin/achieves/test.ts
export default defineDirective( "order", async i => {
    // 指令行为
});
```