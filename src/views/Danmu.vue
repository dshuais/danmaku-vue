<!--
 * @Author: dushuai
 * @Date: 2023-05-25 15:46:39
 * @LastEditors: dushuai
 * @LastEditTime: 2023-05-26 18:08:33
 * @description: 心平气和
-->
<script setup lang="ts">
import { createApp, h, nextTick, onMounted, ref, render } from 'vue'

const slots = defineSlots()

console.log('slots', slots);
const refCon = ref<HTMLDivElement>()
console.log('refCon', refCon);

const dm = createApp({
  render() {
    return h('div', {}, [slots.dm && slots.dm({
      danmu: { title: '弹幕', user: '用户' },
      index: 1
    })])
  },
})
console.log('dm', dm);

// const ele = dm.mount(document.createElement('div'))
// console.log(ele);


nextTick(() => {
  // refCon.value.appendChild(dmDiv)
  // refCon.value.appendChild(ele.$el)
})


const dom = ref([])
function createDm(i: number) {
  const dm = slots.dm && slots.dm({
    danmu: { title: '弹幕', user: '用户' },
    index: i
  })

  dom.value.push(
    dm[0]
  )
}




function createVDom(i: number) {
  const div = ref<HTMLDivElement>(document.createElement('div'))
  render(h('div', {
    onClick: () => {
      console.log(1)
    }
  },
    [slots.dm && slots.dm({
      danmu: { title: '弹幕', user: '用户' },
      index: i
    })]), div.value as HTMLDivElement)

  return div.value.childNodes[0]
}

onMounted(() => {
  for (let i = 0; i < 5000; i++) {
    const el: HTMLDivElement = createVDom(i) as HTMLDivElement
    console.log('createVDom(i)', el);
    el.classList.add('dm')
    refCon.value.appendChild(el)
  }

  // const div = ref<HTMLDivElement>(document.createElement('div'))
  // const dmDiv = h('div', {
  //   onClick: () => {
  //     console.log(1);
  //   }
  // }, dom.value)
  // console.log(dmDiv);
  // render(dmDiv, div.value as HTMLDivElement)
  // div.value.style.opacity = '0'


  // console.log(div);
  // refCon.value.appendChild(div.value as HTMLDivElement)
})


// console.log('div1', div1);

// const div2 = createApp({
//   render() {
//     return h('div', {}, { danmu: '123' })
//   },
// })
// const ele = div2.mount(document.createElement('div'))
// ele.$el.innerHTML = '弹幕'
// ele.$el.classList.add('dmmmmmmmmmm')
// console.log('div2', div2);
// console.log('ele', ele, ele.$el);

nextTick(() => {
  // refCon.value.appendChild(ele.$el)

  // console.log('refCon', refCon.value);
  // console.log('refSlot', refSlot.value);

  const div3 = document.createElement('div')
  div3.innerHTML = '弹幕木木木木木'
  div3.classList.add('dmmmmmmmmmmmmmmmmmmmmmmmmmmmmm')
  // refCon.value.appendChild(div3)
})




</script>

<template>
  <div ref="refCon" class="danmu-container">
    <!-- name="dm" -->
    <!-- <slot :danmu="{ title: '弹幕', user: '用户' }" :index="1"></slot> -->
    <!-- <slot name="dm" :danmu="{ title: '弹幕', user: '用户' }" :index="1"></slot> -->
  </div>
</template>
