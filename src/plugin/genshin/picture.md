# 图片样例

## 玩家信息卡片

<div :class="[$style.container, $style.grid2Info]">
  <img :src="withBase('/demo/genshin/card.png')" alt="ERROR"/>
  <img :src="withBase('/demo/genshin/user-base.png')" alt="ERROR"/>
</div>

## 祈愿十连

<div :class="[$style.container, $style.grid1]">
  <img :src="withBase('/demo/genshin/wish-character.png')" alt="ERROR"/>
  <img :src="withBase('/demo/genshin/wish-weapon.png')" alt="ERROR"/>
</div>

## 角色|武器信息查询

<div :class="[$style.container, $style.grid1]">
  <img :src="withBase('/demo/genshin/info-character-5.png')" alt="ERROR"/>
  <img :src="withBase('/demo/genshin/info-character-4.png')" alt="ERROR"/>
  <img :src="withBase('/demo/genshin/info-weapon-5.png')" alt="ERROR"/>
  <img :src="withBase('/demo/genshin/info-weapon-4.png')" alt="ERROR"/>
  <img :src="withBase('/demo/genshin/info-weapon-3.png')" alt="ERROR"/>
</div>

<div :class="[$style.container, $style.grid3]" style="margin-top: 6px">
  <img :src="withBase('/demo/genshin/info-artifact-5.png')" alt="ERROR"/>
  <img :src="withBase('/demo/genshin/info-artifact-4.png')" alt="ERROR"/>
  <img :src="withBase('/demo/genshin/info-artifact-3.png')" alt="ERROR"/>
</div>

## 抽取|强化圣遗物

<div :class="[$style.container, $style.grid2]">
  <img :src="withBase('/demo/genshin/art.png')" alt="ERROR"/>
  <img :src="withBase('/demo/genshin/imp.png')" alt="ERROR"/>
</div>

## 玩家角色查询

<div :class="[$style.container, $style.grid3]">
  <img :src="withBase('/demo/genshin/char-anemo.png')" alt="ERROR"/>
  <img :src="withBase('/demo/genshin/char-geo.png')" alt="ERROR"/>
  <img :src="withBase('/demo/genshin/char-cyro.png')" alt="ERROR"/>
  <img :src="withBase('/demo/genshin/char-hydro.png')" alt="ERROR"/>
  <img :src="withBase('/demo/genshin/char-pyro.png')" alt="ERROR"/>
  <img :src="withBase('/demo/genshin/char-electro.png')" alt="ERROR"/>
</div>

## 深渊数据查询

<div :class="[$style.container, $style.grid1]">
  <img :src="withBase('/demo/genshin/aby-overview.png')" alt="ERROR"/>
</div>

<div :class="[$style.container, $style.grid2]" style="margin-top: 6px">
  <img :src="withBase('/demo/genshin/aby-floor.png')" alt="ERROR"/>
  <img :src="withBase('/demo/genshin/aby-single.png')" alt="ERROR"/>
</div>

## 每日素材订阅

<div :class="[$style.container, $style.grid1]">
  <img :src="withBase('/demo/genshin/daily.png')" alt="ERROR"/>
</div>

## 实时便笺数据

<div :class="[$style.container, $style.grid1]">
  <img :src="withBase('/demo/genshin/note.png')" alt="ERROR"/>
</div>

## 旅行札记数据

<div :class="[$style.container, $style.grid1]">
  <img :src="withBase('/demo/genshin/led.png')" alt="ERROR"/>
</div>

<script setup>
import { withBase } from "vitepress";
</script>

<style module>
.container {
    display: grid;
    justify-content: center;
    justify-items: center;
    grid-gap: 6px;
}

.container.grid1 img {
    max-height: 600px;
}

.grid2 {
    grid-template-columns: repeat(2, auto);
}

.grid2Info {
    grid-template-columns: 25fr 19fr;
}

.grid3 {
    grid-template-columns: repeat(3, auto);
}

.container img {
    height: 100%;
    object-fit: cover;
}
</style>