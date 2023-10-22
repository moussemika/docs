# 获取 order 指令匹配参数值

`OrderMatchResult` 类型新增 `match` 属性。这表示着 Order 类型的指令也允许通过 `matchResult.match` 来获取正则匹配结果，你不在需要二次重复工作来获取匹配参数。

使用方法如下：

```ts
export default defineDirective( "order", async ( { messageData } ) => {
    const params = matchResult.match;
} );
```

该属性为一个字符串数组，当用户未输入指令的某个可选参数时，该参数所在的数组位置的值为 空字符串`""`。

## 示例

现有如下指令配置：

```ts
const information: OrderConfig = {
    type: "order",
    headers: [ "info" ],
    regexps: [ "[\\w\\u4e00-\\u9fa5]+", "(-skill)?" ],
    // ...
};
```

当用户输入 `#info 行秋` 与 `#info 行秋 -skill` 时，`matchResult.match` 的值分别为如下结果：

```yaml
# 用户输入：#info 行秋
- [ "行秋", "" ]
# 用户输入：#info 行秋 -skill
- [ "行秋", "-skill" ]
```