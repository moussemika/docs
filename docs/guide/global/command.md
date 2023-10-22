# command 工具类

command 工具类负责对核心成员**指令**的处理，并提供了一系列获取指令相关信息的操作方法。

通过翻阅 [工具类 Command API](../../api/global/command.md) 来查看所有的相关方法。

## 获取指令实例

每一个指令均被创建为[指令实例](#指令实例)活跃于框架内，可以通过一些方法来获取它们。

### 获取单一指令实例

通过 `getSingle` 方法，根据每个指令独一无二的 `key`，可以获取具体指令的[指令实例](#指令实例)。当未获取到对应指令实例时，得到的结果为 `undefined`。

```ts
import bot from "ROOT";

const detail = bot.command.getSingle( "adachi.detail" );
```

在获取指令实例时，还可以对指令权限、指令范围作出限制。这通常可以被用来检测指令权限是否满足要求。

```ts
import bot from "ROOT";
import { AuthLevel } from "@/modules/management/auth";
import { MessageScope } from "@/modules/message";

const detail = bot.command.getSingle( "adachi.detail", AuthLevel.User, MessageScope.Both );
```

上面示例获取了 `key` 值为 `adachi.detail` 的指令，且限制权限为 `user` 以上（包括 `user`），并且在私聊、群聊中均可用。实际上这两者本身也是作为默认值而传递的。

### 获取一组指令实例

通过 `get` 方法，可以获取符合要求的一组指令实例。

```ts
import bot from "ROOT";
import { AuthLevel } from "@/modules/management/auth";
import { MessageScope } from "@/modules/message";

const detail = bot.command.getSingle( AuthLevel.User, MessageScope.Both );
```

上面示例获取了满足权限为 `user` 以上（包括 `user`），并且在私聊、群聊中均可用的所有指令的集合。

## 指令实例

在 `Adachi-BOT` 中，每一个插件提供的指令均被实例化为一个指令实例。实例包含了指令自身的相关信息，与一些便利的操作方法。

详情可以查看 [工具类 Command API - 指令实例](../../api/command.md#指令实例)，这里仅列举部分内容。

### 获取实例信息属性

```ts
import bot from "ROOT";

const detail = bot.command.getSingle( "adachi.detail" );
detail?.cmdKey;
detail?.auth;
detail?.desc;
```

### 使用实例匹配指定内容

```ts
import bot from "ROOT";

const detail = bot.command.getSingle( "adachi.detail" );
detail?.match( "#detail 1" );
```