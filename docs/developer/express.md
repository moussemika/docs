# Genshin Express Api

## `/api/card`
玩家信息卡片数据。

**请求参数**
* `qq` 用户的 QQ 号

**返回结果**
```ts
type Response = UserInfo & {
    nickanme: string;
    level: string;
    uid: string;
};
// UserInfo 见 /genshin/types/user-info.ts
// worldExplorations 更名为 explorations 返回
```

## `/api/artifact`
圣遗物抽取及强化数据。

**请求参数**
* `qq` 用户的 QQ 号
* `type` 圣遗物类型
  * `init` 表示未强化的圣遗物
  * `rein` 表示强化至满级的圣遗物

**返回结果**
```ts
type Response = Artifact;
// Artifact 见 /genshin/module/artifact.ts
```

## `/api/wish`

### `/result`
模拟祈愿十连数据。

**请求参数**
* `qq` 用户的 QQ 号

**返回结果**
```ts
type Response = {
    type: "角色" | "常驻" | "武器" | "角色2";
    data: WishResult[];
    name: string;       // 用户昵称
};
// WishResult 见 /genshin/module/wish.ts
```

### `/statistic`
非十连祈愿统计数据。

**请求参数**
* `qq` 用户的 QQ 号

**返回结果**
```ts
type Response = {
    character: WishStatistic[];
    weapon: WishStatistic[];
    total: number;              // 总计祈愿次数
    nickname: string;
};
// WishStatistic 见 /genshin/achieves/wish.ts
```

### `/config`
获取角色或武器的类型，用于 `icon` 显示。

**请求参数**
* `type` 类型，`character` 或 `weapon`

**返回结果**
```ts
type CharacterElement = "pyro" | "anemo" | 
    "electro" | "geo" | "hydro" | "cryo";
type WeaponType = "sword" | "claymore" |
    "polearm" | "catalyst" | "bow";
type Name = string;

type Response = Record<Name, CharacterElement | WeaponType>;
```

## `/api/info`
角色或武器的详细数据（命座信息、突破材料等）。

**请求参数**
* `name` 角色或武器名。简体中文完整名称。

**返回结果**
```ts
type BasicInfo = {
    title: string;      // 对于角色：该值表示头衔?（如循循守月）
                        // 对于武器：该值表示类型（如长柄武器）
    name: string;
    introduce: string;
    rarity: number;
    mainStat: string;   // 突破属性
    mainValue: string;  // 满级时突破属性值
    baseATK: string;    // 满级时基础攻击力
    time: string;       // 可获得天赋升级材料或武器突破材料的时间（如【周一/四/日】）
};

type CharacterInfo = BasicInfo & {
    type: "角色";
    id: number;
    birthday: string;
    element: string;
    cv: string;
    constellationName: string;
    ascensionMaterials: [
        string, string, string, string, string
    ];                  // 突破素材
                        // 前四个元素表示突破水晶（如哀叙冰玉）
                        // 第五个表示世界 BOSS 特殊掉落物（如晶凝之华）
    levelUpMaterials: [
        string, string, string, string
    ];                  // 天赋升级或角色突破所需的其他材料
                        // 第一个表示特产，第二到四个表示普通怪掉落物（如 导能绘卷-封魔绘卷-禁咒绘卷）
    talentMaterials: [
        string, string, string, string
    ];                  // 天赋升级材料
                        // 第一到三个表示天赋书，第四个表示周本材料
    constellations: [
        string, string, string, string
    ];                  // 命座信息（一、二、四、六）
};

type WeaponInfo = BasicInfo & {
    title: "武器";
    access: string;     // 获取途径
    ascensionMaterials: [
        [ string, string, string, string ],
        [ string, string, string, string, string, string ]
    ];                  // 突破素材
                        // 第一个元组表示武器副本掉落的突破材料（如狮牙斗士的枷锁）
                        // 第二个元组表示大世界怪物掉落物
                        //   - 其中前三个为精英怪掉落物（如 混沌装置-混沌回路-混沌炉心）
                        //   - 第四到六个为普通怪掉落物（如 导能绘卷-封魔绘卷-禁咒绘卷）
    skillName: string;
    skillContent: string;
};

type Response = CharacterInfo | WeaponInfo;
```

## `/api/note`
实时便笺数据。

**请求参数**
* `uid` 玩家 UID

**返回结果**
```ts
type Response = Note & {
    uid: string;
};
// Note 见 /genshin/types/note.ts
```

## `/api/char`
用户查询单个角色数据。

**请求参数**
* `qq` 用户的 QQ 号

**返回结果**
```ts
type Response = Omit<Avatar, "reliquaries"> & { 
    reliquaries: Omit<Artifact, "set">;
    uid: string;
};
// Avatar, Artifact 见 /genshin/types/character.ts
```

## `/api/abyss`
用户深渊数据。

**请求参数**
* `qq` 用户的 QQ 号
* `floor` 深渊层数

**返回结果**
```ts
type AbyssOverview = {
    floor: 0;
    info: string;           // UID-xxxxxxxxx
    totalStar: number;
    maxFloor: string;
    totalBattleTimes: number;
    revealRank: AbyssCharacter[];
    defeatRank: AbyssCharacter[];
    damageRank: AbyssCharacter[];
    takeDamageRank: AbyssCharacter[];
    normalSkillRank: AbyssCharacter[];
    energySkillRank: AbyssCharacter[];
};

type AbyssFloorData = {
    floor: number;
    info: string;           // UID-xxxxxxxxx
    data: AbyssFloor;
};

type Response = AbyssOverview | AbyssFloorData;
// AbyssFloor, AbyssCharacter 见 /genshin/types/abyss.ts
```

## `/api/daily`
每日素材数据。

**请求参数**
* `id` 请求 ID，用户为 QQ 号，0 表示群号（全体数据）

**返回结果**
```ts
type Response = {
    weapon: Record<string, DailyInfo[]>;
    character: Record<string, DailyInfo[]>;
};
// DailyInfo 见 /genshin/modules/daily.ts
// 处于历史遗留因素，该数据被压缩为如下的形式:
// { "鸣神御灵": [ { name: 赤角石溃杵, rarity: 5 } ] }
```

## `/api/almanac`
黄历数据。

**返回结果**
```ts
type Response = {
    auspicious: FortuneUnit[];
    inauspicious: FortuneUnit[];
    direction: string;
};
// FortuneUnit 见 /genshin/module/almanac.ts
```