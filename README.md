# danmaku-vue

> 基于 Vue3 的弹幕交互组件

## Install

```bash
$ npm install danmaku-vue --save
```

## Usage

```vue
<template>
  <danmaku-vue v-model:danmus="danmus" style="height:100px; width:300px;"></danmaku-vue>
</template>

<script setup>
import danmakuVue from 'danmaku-vue'

const danmus = ref(['danmu1', 'danmu2', 'danmu3', '...'])
</script>
```
