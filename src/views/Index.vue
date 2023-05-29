<!--
 * @Author: dushuai
 * @Date: 2023-05-25 15:46:39
 * @LastEditors: dushuai
 * @LastEditTime: 2023-05-29 18:20:10
 * @description: 心平气和
-->
<script setup lang="ts">
import Danmu from '@/lib/Danmu.vue';
import { ref } from 'vue';

const Danmus = ref<string[]>(['弹幕1', '弹幕2', '弹幕3', '弹幕4', '弹幕5'])

</script>

<template>
  <Danmu :danmus="Danmus" use-slot style="width: 100%;height:300px;">
    <template #dm="{ danmu, index }">
      <div class="danmu-item">{{ danmu }},{{ index }}</div>
    </template>
  </Danmu>
</template>

<style scoped lang="scss">
.danmu-item {
  background: red;
  width: 100px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  border-radius: 30px;
}
</style>
