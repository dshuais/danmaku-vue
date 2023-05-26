<!--
 * @Author: dushuai
 * @Date: 2023-05-25 15:46:39
 * @LastEditors: dushuai
 * @LastEditTime: 2023-05-26 16:18:28
 * @description: 心平气和
-->
<script setup lang="ts">
import Danmu from './Danmu.vue'

</script>

<template>
  <Danmu>
    <template #dm="{ danmu, index }">
      <div class="danmu-item">{{ danmu.user }},{{ danmu.title }},{{ index }}</div>
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
