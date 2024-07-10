# 配置

插件的配置文件将会在 bot 启动之后于 `config/genshin` 目录下生成。

## cookies.yml

插件用于执行 `mys`, `uid`, `aby` 等指令所需的 `cookies` ，可配置多个。

```yaml
cookies:
  - cookieA
  - cookieB
```

## main.yml

插件主要配置。

### card

人物卡片相关，影响命令：`uid` 与 `mys`

**weaponStyle**

* 类型: `normal|weaponA|weaponB`
* 默认值: `normal`

用户信息查询卡片武器显示样式。每个值对应的图例如下：

<div :class="[$style.container, $style.grid3]">
  <img :src="withBase('/demo/config/normal.png')" alt="ERROR"/>
  <img :src="withBase('/demo/config/weaponA.png')" alt="ERROR"/>
  <img :src="withBase('/demo/config/weaponB.png')" alt="ERROR"/>
</div>

**profile**

* 类型: `random|user`
* 默认值: `random`

用户信息查询卡片头像显示。每个值对应的释义如下：

* random: 从玩家所用于的角色中随机抽取。
* user: 查询用户的 QQ 头像。

### chara

影响命令：`char`

**showScore**

* 类型: `boolean`
* 默认值: `true`

角色信息查询是否显示评分。

### wish

影响命令：`wish`

**limit**

* 类型: `number`
* 默认值: `99`

单次祈愿的最大抽取十连次数。

### panel

面板查询相关，影响命令: `panel`、`pud`

**uidQuery**

* 类型: `boolean`
* 默认值: `false`

是否允许使用 `uid` 查询/更新，为防止部分用户恶意遍历查询 `uid`，这里默认关闭，有需要的可以开启

**enKaApi**

* 类型: `string`
* 默认值: `https://enka.shinshin.moe/`

面板数据来源地址，默认为 Enka 官方地址。可修改为 [@MiniGrayGay](https://github.com/MiniGrayGay) 提供的国内反代地址以解决连接异常问题

* 代理地址A：https://enka.microgg.cn/"
* 代理地址B：https://enka.minigg.cn/"

### verify

绕过验证码服务相关配置，服务由 [@MiniGrayGay](https://github.com/MiniGrayGay) 提供。

**enable**

* 类型: `boolean`
* 默认值: `false`

是否开启尝试绕过米游社验证码功能。

**repeat**

* 类型: `number`
* 默认值: `1`

绕过验证码失败后，重新尝试次数。

**token**

* 类型: `number`
* 默认值: `随机字符`

绕过验证码服务所必须的 token。

<script setup>
import { withBase } from "vitepress";
</script>

<style module>
.container {
    display: grid;
    justify-content: center;
}

.grid3 {
    grid-template-columns: repeat(3, auto);
}

.container img {
    height: 100%;
}
</style>