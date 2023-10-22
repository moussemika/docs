# 订阅服务支持

如果你的插件中为用户提供了订阅相关服务（定期主动向用户发送消息），那么可以通过配置 `PluginSetting.subscribe` 来开启框架针对插件订阅的相关功能支持：

- 删除好友、退群时自动取消订阅
- 网页控制台提供对插件的订阅管理支持

该配置项为一个数组，数组中每个对象需要提供三个属性：订阅名称（name）、获取用户id列表方法（getUser）、清除指定id订阅方法（reSub）。

其中 `getUser` 与 `reSub` 的类型定于如下：

```typescript
type SubUser = {
    person?: number[];
    group?: number[];
};

export interface PluginSetting {
    // ...
    subscribe?: {
        name: string;
        getUser: ( bot: BOT ) => Promise<SubUser> | SubUser;
        reSub: ( userId: number, type: "private" | "group", bot: BOT ) => Promise<void> | void;
    }[];
    // ...
}
```

| 属性名     | 说明               | 类型                                                                         |
|---------|------------------|----------------------------------------------------------------------------|
| name    | 订阅名称，用于在网页控制台中展示 | string                                                                     | -                   |
| getUser | 获取用户/群主id列表的方法   | ( bot: BOT ) => Promise\<SubUser>                                          |
| reSub   | 清除指定用户/群组订阅的方法   | ( userId: number, type: "private" \| "group", bot: BOT ) => Promise\<void> | void;    | 

框架将会通过 `getUser` 方法来获取开启了订阅的用户与群组 id 列表，并通过执行 `reSub` 方法来在必要的时机清除指定用户的订阅信息。