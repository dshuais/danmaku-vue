<script setup lang="ts">
// https://github.com/dshuais/danmaku-vue/issues/17
import Danmaku from 'danmaku-vue'
import { ref } from 'vue'

type Dm = {
  id: number
  text: string
}

const dms = ref<Dm[]>([
  { id: 1, text: 'test1' },
  { id: 2, text: 'test2' },
  { id: 3, text: 'test3' },
  { id: 4, text: 'test4' },
  { id: 5, text: 'test5' },
])

function handleChange(index: number) {
  dms.value[index].text += '+'
}

</script>

<template>
  <Danmaku class="dm-container" :danmus="dms" useSlot loop>.
    <template #dm="{ danmu, index }">
      <div>{{ danmu.text }}</div>
      <button @click="handleChange(index)">add</button>
    </template>
  </Danmaku>

</template>

<style scoped>
.dm-container {
  width: 100%;
  height: 500px;
}
</style>
