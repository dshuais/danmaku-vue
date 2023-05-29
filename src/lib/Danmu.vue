<!--
 * @Author: dushuai
 * @Date: 2023-05-25 15:46:39
 * @LastEditors: dushuai
 * @LastEditTime: 2023-05-29 18:27:55
 * @description: Danmaku
-->
<script setup lang="ts">
import { computed, h, nextTick, onMounted, reactive, ref, render } from 'vue'
import { Danmu, DanChannel, DanmuItem, Props, DanmakuItem } from './typings/Danmaku'
import { useModelWrapper } from './utils';

const slots = defineSlots()
const { danmus, channels, autoplay, loop, useSlot, debounce, speeds, randomChannel, fontSize, top, right, isSuspend, extraStyle } = withDefaults(defineProps<Props>(), {
  /**
 * 弹幕列表
 */
  // danmus,
  /**
   * 轨道数量 0为最大轨道数量（撑满容器）
   */
  channels: 0,
  /**
   * 自动播放 默认true
   */
  autoplay: true,
  /**
   * 循环播放 默认false
   */
  loop: false,
  /**
   * 是否开启插槽 默认false
   */
  useSlot: false,
  /**
  * 弹幕刷新频率(ms) 默认100
  */
  debounce: 1000,
  /**
   * 弹幕速度（像素/秒） 默认200
   */
  speeds: 2000,
  /**
     * 是否开启随机轨道注入弹幕 默认false
     */
  randomChannel: false,
  /**
    * 弹幕字号（仅文本模式） 默认18
    */
  fontSize: 18,
  /**
   * 弹幕垂直间距 默认4
   */
  top: 4,
  /**
   * 弹幕水平间距 默认0
   */
  right: 0,
  /**
   * 是否开启悬浮暂停 默认false
   */
  isSuspend: false,
  /**
   * 弹幕额外样式
   */
  extraStyle: ''
})
const emit = defineEmits<{
  (e: 'list-end'): void
  (e: 'play-end', index: number): void
  (e: 'update:danmus', danmus: Danmu): void
}>()

const container = ref<HTMLDivElement>()
const dmContainer = ref<HTMLDivElement>()

const containerWidth = ref<number>(0)
const containerHeight = ref<number>(0)

let timer = null
const calcChannels = ref<number>(0)
const danmuHeight = ref<number>(0)
const index = ref<number>(0)
const hidden = ref<boolean>(false)
const paused = ref<boolean>(false)
const danChannel = ref<DanChannel>({})

const danmuList = useModelWrapper<Danmu[]>(danmus, emit, 'danmus')

const dmChannels = computed<number>(() => channels || calcChannels.value)

const danmaku: DanmakuItem = reactive({
  channels: computed(() => channels || calcChannels.value),
  autoplay: computed(() => autoplay),
  loop: computed(() => loop),
  useSlot: computed(() => useSlot),
  debounce: computed(() => debounce),
  randomChannel: computed(() => randomChannel),
})

const danmu: DanmuItem = reactive({
  height: computed(() => danmuHeight.value),
  fontSize: computed(() => fontSize),
  speeds: computed(() => speeds),
  top: computed(() => top),
  right: computed(() => right),
})

function init() {
  initCore()
  if (autoplay) {
    play()
  }
}

/**
 * 获取弹幕区域宽高
 */
function initCore() {
  containerWidth.value = container.value.offsetWidth
  containerHeight.value = container.value.offsetHeight
}

function play() {
  paused.value = false
  if (!timer) {
    timer = setInterval(() => draw(), debounce)
  }
  // draw()
}

function draw() {
  if (!paused.value && danmuList.value.length) {
    if (index.value > danmuList.value.length - 1) {
      const screenDanmus = dmContainer.value.children.length // 当前弹幕条数
      console.log('弹幕', screenDanmus)

      if (loop) {
        if (screenDanmus < index.value) {
          emit('list-end')
          index.value = 0
        }
        insert()
      }
    } else {
      console.log('弹幕')
      insert()
    }
  }
}

/**
 * 插入弹幕 允许外部直接执行绘制弹幕方法
 * @param {Danmu} dm 插入的弹幕 可选，默认播放danmus内的弹幕
 */
function insert(dm?: Danmu) {
  const _index: number = loop ? index.value % danmuList.value.length : index.value // 将要播放的弹幕的下标
  const _danmu: Danmu = dm || danmuList.value[_index]
  let el: HTMLDivElement = document.createElement('div')
  console.log(_index, _danmu);

  debugger
  if (useSlot) {
    el = createVDom(_danmu, _index) as HTMLDivElement
  } else {
    el.innerHTML = _danmu as string
    el.setAttribute('style', extraStyle)
    el.style.fontSize = `${fontSize}px`
    el.style.lineHeight = `${fontSize}px`
  }
  el.classList.add('dm')
  dmContainer.value.appendChild(el)
  el.style.opacity = '0'
  nextTick(() => {
    if (!danmuHeight) {
      danmuHeight.value = el.offsetHeight
    }
    // 没有设置轨道数 则在弹幕区域全屏播放
    if (!channels) {
      calcChannels.value = Math.floor(containerHeight.value / danmuHeight.value + top)
    }
    const channelIndex = getChannelIndex(el)
    if (channelIndex >= 0) {
      const width = el.offsetWidth
      const height = danmuHeight.value
      el.classList.add('move')
      el.dataset.index = `${_index}`
      el.style.opacity = '1'
      el.style.top = channelIndex * (height + top) + 'px'
      el.style.width = width + right + 'px'
      el.style.setProperty('--dm-scroll-width', `-${containerWidth.value + (width * 2)}px`)
      el.style.left = `${containerWidth.value}px`
      el.style.animationDuration = `${containerWidth.value / speeds}s`
      el.addEventListener('animationend', () => {
        if (Number(el.dataset.index) === danmuList.value.length - 1 && !loop) {
          emit('play-end', Number(el.dataset.index))
        }
        dmContainer.value && dmContainer.value.removeChild(el)
      })
      index.value++
    } else {
      dmContainer.value.removeChild(el)
    }
  })
}

/**
 * 获取该弹幕要出现的轨道index
 * @param {HTMLDivElement} el 弹幕dom
 * @return {number}
 */
function getChannelIndex(el: HTMLDivElement): number {
  let _channels = [...Array(dmChannels).keys()]
  if (randomChannel) {
    _channels = _channels.sort(() => 0.5 - Math.random())
  }

  for (const i of _channels) {
    const items = danChannel.value[i]

    if (items && items.length) {
      for (let j = 0; j < items.length; j++) {
        /**
         * 安全距离判断
         * el.offsetWidth 当前的弹幕的宽度
         * items[j].offsetWidth 当前该轨道内弹幕j的宽度
         * 如果弹幕j距离右侧的距离 小于 (当前弹幕width-弹幕j的width)*0.88 ---> 不添加到该轨道
         * 弹幕j距离右侧距离 小于 0 ---> 不添加到该轨道
         * 
         * 没有任何一条轨道可加入 返回-1
         */
        const dmRight = getDanmuRight(items[j]) - 10
        if (dmRight <= (el.offsetWidth - items[j].offsetWidth) * 0.88 || dmRight <= 0) break

        if (j === items.length - 1) {
          danChannel.value[i].push(el)
          el.addEventListener('animationend', () => danChannel.value[i].splice(0, 1))
          return i % dmChannels.value
        }
      }
    } else {
      danChannel.value[i] = [el]
      el.addEventListener('animationend', () => danChannel.value[i].splice(0, 1))
      return i % dmChannels.value
    }
  }
  return -1
}

/**
 * 获取弹幕右侧到屏幕右侧的距离
 * @param {HTMLDivElement} el 当前弹幕
 * @return {number} 当前弹幕飘到的位置
 */
function getDanmuRight(el: HTMLDivElement): number {
  const elWidth = el.offsetWidth || parseInt(el.style.width)
  /**
   * getBoundingClientRect().right 当前元素的右边到弹幕区域最左侧的距离
   * elRight: 当前弹幕距离左侧的距离 ==> 当前弹幕整体宽度距离最左侧的距离 或 当前弹幕区域距离的宽度加上当前弹幕的宽度
   */
  const elRight = el.getBoundingClientRect().right || dmContainer.value.getBoundingClientRect().right + elWidth
  return dmContainer.value.getBoundingClientRect().right - elRight
}


/**
 * 创建dom节点
 * @param {Danmu} danmu 当前弹幕数据
 * @param {number} index 当前弹幕下标
 * @return dom节点
 */
function createVDom(danmu: Danmu, index: number) {
  const div = ref<HTMLDivElement>(document.createElement('div'))
  render(h('div', {
    onClick: () => {
      console.log(1)
    }
  },
    [slots.dm && slots.dm({
      danmu,
      index
    })]), div.value as HTMLDivElement)

  return div.value.childNodes[0]
}

onMounted(() => {
  // for (let i = 0; i < danmus.length; i++) {
  //   const item = danmus[i]
  //   const el: HTMLDivElement = createVDom(item, i) as HTMLDivElement
  //   console.log('createVDom(i)', el);
  //   el.classList.add('dm')
  //   dmContainer.value?.appendChild(el)
  // }
  init()
})
</script>
<template>
  <div ref="container" class="container">
    <div ref="dmContainer" :class="['danmus', { show: !hidden }, { paused: paused }]">
      <!-- <slot :danmu="{ title: '弹幕', user: '用户' }" :index="1"></slot> -->
      <!-- <slot name="dm" :danmu="{ title: '弹幕', user: '用户' }" :index="1"></slot> -->
    </div>
  </div>
</template>
<style lang="scss" scoped>
.container {
  position: relative;
  overflow: hidden;

  .danmus {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;

    &.show {
      opacity: 1;
    }

    &.paused {
      .dm.move {
        animation-play-state: paused;
      }
    }

    .dm {
      position: absolute;
      font-size: 20px;
      color: #ddd;
      white-space: pre;
      transform: translateX(0);
      transform-style: preserve-3d;

      &.move {
        will-change: transform;
        animation-name: moveLeft;
        animation-timing-function: linear;
        animation-play-state: running;
      }

      &.pause {
        animation-play-state: paused;
        z-index: 10;
      }
    }

    @keyframes moveLeft {
      from {
        transform: translateX(0);
      }

      to {
        transform: translateX(var(--dm-scroll-width));
      }
    }

    @-webkit-keyframes moveLeft {
      from {
        -webkit-transform: translateX(0);
      }

      to {
        -webkit-transform: translateX(var(--dm-scroll-width));
      }
    }
  }
}
</style>
