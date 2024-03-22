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

/**
 * 通过获取dom修改innerHTML
 * @param event 
 */
function handleChange(event: MouseEvent) {
  const id = `danmu-${(event.target as HTMLTextAreaElement).id}`

  const dom = document.getElementById(id)
  if (dom) {
    dom.innerHTML = dom.innerText += '-'
  }
}


/**
 * loop模式下 新增loopNumber计数 使id唯一
 */

const loopNumber = ref(0)

function handleListEnd() {
  loopNumber.value++
}

</script>

<template>
  <Danmaku class="dm-container" :danmus="dms" useSlot loop @list-end="handleListEnd">
    <template #dm="{ danmu, index }">
      <div :id="`danmu-${loopNumber}-${index}`">{{ danmu.text }}</div>
      <button :id="`${loopNumber}-${index}`" @click="handleChange($event)">change</button>
    </template>
  </Danmaku>
</template>

<style scoped>
.dm-container {
  width: 100%;
  height: 500px;
}
</style>
