# progress

该类用于创建一个单行进度条打印输出。

## 食用方法

```ts
import Progress from "@/utils/progress";

// 定义前缀内容、最大值与进度条最大长度
const total = 114;
const progress = new Progress( "下载进度", total, 50 );

// 遍历渲染递增进度
function downloading( completed: number = 0 ) {
    if ( completed > total ) return;
    progress.renderer( completed );
    completed++;
    setTimeout( () => {
        downloading( completed );
    }, 500 );
}

downloading();
```

```text
下载进度: ████████████████████████████████████████████░░░░░░  108/114
```

## new Progress()

```ts
interface IProgress {
    new ( description: string, total: number, length?: number ): Progress;
}
```

- `description` 前方所展示的描述文字
- `total` 进度条的最大值
- `length` 可选，进度条的长度，默认为 `50`
- 返回值: `Progress` 实例

创建一个 `Progress` 实例。

## renderer()

```ts
interface IProgress {
    renderer( completed: number, rightText?: ( total: number ) => string, tcp?: boolean )
}
```

- `completed` 当前进度条的值
- `rightText` 可选回调函数，用以得到在进度条右侧显示的内容
  - `total` 进度条总长
  - 返回值: 进度条右侧显示的内容
- `tcp` 可选，是否通过 tcp 在 `webconsole` 中展示进度，默认为 `false`

渲染输出进度内容。

## setTotal()

```ts
interface IProgress {
    setTotal( val: number ): void;
}
```

- `val` 要设置的最大值

设置进度条最大值。