# 配置

## cookies.yml

`genshin` 插件用于执行 `mys`, `uid`, `aby` 等指令所需的 `cookies` ，可配置多个。

```yaml
cookies:
  - cookieA
  - cookieB
```

## genshin.yml

`genshin` 插件相关配置。

### cardWeaponStyle

* 类型: `normal|weaponA|weaponB`
* 默认值: `normal`

用户信息查询卡片武器显示样式。每个值对应的图例如下：

<center class="half">
  <img :src="$withBase('/demo/config/normal.png')" alt="ERROR"/>
  <img :src="$withBase('/demo/config/weaponA.png')" alt="ERROR"/>
  <img :src="$withBase('/demo/config/weaponB.png')" alt="ERROR"/>
</center>

### cardProfile

* 类型: `random|user`
* 默认值: `random`

用户信息查询卡片头像显示。每个值对应的释义如下：

* random: 从玩家所用于的角色中随机抽取。
* user: 查询用户的 QQ 头像。

### showCharScore

* 类型: `boolean`
* 默认值: `true`

角色信息查询是否显示评分。

### wishLimitNum

* 类型: `number`
* 默认值: `99`

单次祈愿的最大抽取十连次数。

### verifyEnable

* 类型: `boolean`
* 默认值: `false`

是否开启尝试绕过米游社验证码功能。

### verifyRepeat

* 类型: `number`
* 默认值: `1`

绕过验证码失败后，重新尝试次数。

### verifyToken

* 类型: `number`
* 默认值: `3H>Ngk`

绕过验证码服务所必须的 token。