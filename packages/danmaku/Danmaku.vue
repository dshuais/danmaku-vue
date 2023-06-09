<!--
 * @Author: dushuai
 * @Date: 2023-05-25 15:46:39
 * @LastEditors: dushuai
 * @LastEditTime: 2023-06-09 15:04:15
 * @description: Danmaku
-->
<script setup lang="ts">
import { computed, h, nextTick, onBeforeUnmount, onMounted, ref, render, toRefs } from 'vue'

/**
 * props类型
 */
type Props = {
  /**
   * 弹幕列表
   */
  danmus: Danmu[],
  /**
   * 轨道数量 0为最大轨道数量（撑满容器）
   */
  channels?: number,
  /**
   * 自动播放 默认true
   */
  autoplay?: boolean,
  /**
   * 循环播放 默认false
   */
  loop?: boolean,
  /**
   * 是否开启插槽 默认false
   */
  useSlot?: boolean,
  /**
   * 是否开启悬浮插槽 默认false
   */
  useSuspendSlot?: boolean,
  /**
  * 弹幕刷新频率(ms) 默认100
  */
  debounce?: number,
  /**
   * 弹幕速度（像素/秒） 默认100
   */
  speeds?: number,
  /**
     * 是否开启随机轨道注入弹幕 默认false
     */
  randomChannel?: boolean,
  /**
    * 弹幕字号（仅文本模式） 默认18
    */
  fontSize?: number,
  /**
   * 弹幕垂直间距 默认4
   */
  top?: number,
  /**
   * 弹幕水平间距 默认0
   */
  right?: number,
  /**
   * 是否开启悬浮暂停 默认false
   */
  isSuspend?: boolean,
  /**
   * 弹幕额外样式
   */
  extraStyle?: string,
}

/**
 * 自定义弹幕
 */
type CustomDanmu = {
  [key: string]: any
}

/**
 * 弹幕类型
 */
export type Danmu<T = any> = string | T & CustomDanmu

/**
 * 弹幕轨道
 */
type DanChannel = {
  [index: number]: [HTMLDivElement]
}

const slots = defineSlots()
const props = withDefaults(defineProps<Props>(), {
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
   * 是否开启悬浮插槽 默认false
   */
  useSuspendSlot: false,
  /**
  * 弹幕刷新频率(ms) 默认100
  */
  debounce: 100,
  /**
   * 弹幕速度（像素/秒） 默认100
   */
  speeds: 100,
  /**
   * 是否开启随机轨道注入弹幕 默认false
   */
  randomChannel: false,
  /**
  * 弹幕字号（仅文本模式） 默认18
  */
  fontSize: 18,
  /**
   * 弹幕垂直间距 默认10
   */
  top: 10,
  /**
   * 弹幕水平间距 默认10
   */
  right: 10,
  /**
   * 是否开启悬浮暂停 默认false
   */
  isSuspend: false,
  /**
   * 弹幕额外样式
   */
  extraStyle: ''
})
const { danmus, channels, autoplay, loop, useSlot, debounce, speeds, randomChannel, fontSize, top, right, isSuspend, extraStyle, useSuspendSlot } = toRefs(props)
const emit = defineEmits<{
  (e: 'list-end'): void
  (e: 'play-end', index: number): void
  (e: 'dm-click', danmu: Danmu, index: number): void
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
const insertIndex = ref<number>(0)
const hidden = ref<boolean>(false)
const paused = ref<boolean>(false)
const danChannel = ref<DanChannel>({})
const suspendList = ref<HTMLElement[]>([])
const suspendRight = ref<number>(10)

// const danmuList = useModelWrapper<Danmu[]>(danmus, emit, 'danmus')
const danmuList = computed<Danmu[]>({
  get: () => danmus.value,
  set: (value) => {
    emit(`update:danmus`, value)
  }
})

const dmChannels = computed<number>(() => channels.value || calcChannels.value)

function init() {
  initCore()
  isSuspend.value && !useSlot.value && initSuspendEvents()
  if (autoplay.value) {
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
  if (!timer && danmuList.value.length) {
    timer = setInterval(() => draw(), debounce.value)
  }
}

function draw() {
  if (!paused.value && danmuList.value.length) {
    if (index.value > danmuList.value.length - 1 + insertIndex.value) {
      const screenDanmus = dmContainer.value.children.length // 当前弹幕条数
      if (loop.value) {
        if (index.value >= danmuList.value.length) {
          emit('list-end')
          index.value = 0
        }
        insert()
      } else {
        if (screenDanmus < index.value) {
          clearTimer()
        }
      }
    } else {
      insert()
    }
  }
}

/**
 * 2023.06.03
 * v0.2.0(beta) https://github.com/dshuais/danmaku-vue/issues/7
 * 外部用户插入的弹幕list
 * ∵ setInterval会不停调用 -> 如果一次insert且channelIndex为-1时会导致无法添加成功
 * ∴ 新增insertList记录外部插入弹幕list
 */
const insertList = ref<Danmu[]>([])
/**
 * 插入弹幕 可暴露至外部，'实时'插入 不进行数据绑定 场景：不循环且弹幕播放完成后的情况下
 * @param {Danmu} dm 播放的弹幕
 */
function insert(dm?: Danmu) {
  /**
   * 2023.06.03
   * v0.2.0(beta) https://github.com/dshuais/danmaku-vue/issues/7
   * 记录外部用户插入的弹幕
   */
  if (dm) insertList.value.push(dm)
  const _index: number = loop.value ? index.value % danmuList.value.length : index.value - insertIndex.value // 将要播放的弹幕的下标
  /**
   * 2023.06.03
   * v0.2.0(beta) https://github.com/dshuais/danmaku-vue/issues/7
   * 当前播放弹幕
   * 修改_danmu取值，如果外部插入的弹幕条数和添加到页面的弹幕条数不统一 优先取外部插入的弹幕
   */
  let _danmu: Danmu = dm || danmuList.value[_index]
  let isOuterDm = false // 当前取值是否是外部插入的弹幕
  if (insertList.value.length > insertIndex.value) {
    _danmu = insertList.value[insertIndex.value]
    isOuterDm = true
  }
  let el: HTMLDivElement = document.createElement('div')
  let sel: HTMLDivElement = document.createElement('div')
  if (useSlot.value) {
    el = createVDom(_danmu, _index) as HTMLDivElement
  } else {
    el.innerHTML = _danmu as string
    el.setAttribute('style', extraStyle.value)
    el.style.fontSize = `${fontSize.value}px`
    el.style.lineHeight = `${fontSize.value}px`
  }
  el.style.opacity = '0'
  el.classList.add('dm')

  if (isSuspend.value && useSuspendSlot.value) {
    sel = createSuspendVDom(_danmu, _index).childNodes[1] as HTMLDivElement
    sel.classList.add('dm-suspend')
    sel.style.background = 'transparent' // 'inherit'
    sel.style.display = 'none'
    if (useSlot.value) {
      sel && el.childNodes[1] && el.childNodes[1].appendChild(sel)
    } else {
      sel && el.appendChild(sel)
    }
  }

  dmContainer.value && dmContainer.value.appendChild(el)
  nextTick(() => {
    if (!danmuHeight.value) {
      danmuHeight.value = el.offsetHeight
    }
    // 没有设置轨道数 则在弹幕区域全屏播放
    if (!channels.value) {
      calcChannels.value = Math.floor(containerHeight.value / (danmuHeight.value + top.value))
    }
    /**
     * 2023.06.02
     * v0.2.0(beta) https://github.com/dshuais/danmaku-vue/issues/6
     * suspendRight.value = sel.offsetWidth + 10  ->  suspendRight.value = sel.offsetWidth + 10 + right.value
     * 优化：添加right在安全距离内 不影响el width
     */
    suspendRight.value = sel.offsetWidth + 10 + right.value
    let channelIndex = getChannelIndex(el)

    if (channelIndex >= 0) {
      const width = el.offsetWidth
      const height = danmuHeight.value
      el.classList.add('move')
      el.dataset.index = `${_index}`
      el.style.top = channelIndex * (height + top.value) + 'px'
      /**
       * 2023.06.02
       * v0.2.0(beta) https://github.com/dshuais/danmaku-vue/issues/6
       * el.style.width = width + right.value + 'px'  ->  el.style.width = width + 'px'
       * 优化：宽度+right时 悬浮触摸区域增加
       */
      el.style.width = width + 'px'
      el.style.opacity = '1'
      el.style.setProperty('--dm-scroll-width', `-${containerWidth.value + (width * 2)}px`)
      el.style.left = `${containerWidth.value}px`
      el.style.animationDuration = `${containerWidth.value / speeds.value}s`
      el.addEventListener('animationend', () => {
        if (Number(el.dataset.index) === danmuList.value.length - 1 && !loop.value) {
          emit('play-end', Number(el.dataset.index))
        }
        dmContainer.value && dmContainer.value.removeChild(el)
      }, { once: true })
      index.value++
      if (dm || isOuterDm) {
        paused.value = false
        insertIndex.value++
      }
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
  let _channels = [...Array(dmChannels.value).keys()]
  if (randomChannel.value) {
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
        const dmRight = getDanmuRight(items[j]) - suspendRight.value
        if (dmRight <= (el.offsetWidth - items[j].offsetWidth) * 0.88 || dmRight <= 0) break

        if (j === items.length - 1) {
          danChannel.value[i].push(el)
          el.addEventListener('animationend', () => danChannel.value[i].splice(0, 1), { once: true })
          return i % dmChannels.value
        }
      }
    } else {
      danChannel.value[i] = [el]
      el.addEventListener('animationend', () => danChannel.value[i].splice(0, 1), { once: true })
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
      emit('dm-click', danmu, index)
    },
    onmouseover: (e: { target: { closest: (arg0: string) => HTMLElement; childNodes: any; }; }) => {
      if (!isSuspend.value) return
      // e.stopImmediatePropagation()
      const dm: HTMLElement = e.target.closest('.dm')
      if (!dm) return

      /**
       * 2023.06.07
       * v0.2.0(beta) https://github.com/dshuais/danmaku-vue/issues/10
       * 优化获取dm-suspend的方法  onmouseout同理
       */
      const suspend = dm.getElementsByClassName('dm-suspend')[0] as HTMLElement // dm.childNodes[1].childNodes[1] as HTMLElement
      if (isSuspend.value && suspend) {
        suspend.style.display = 'flex'
      }
      dm.classList.add('pause')
      if (!suspendList.value.includes(dm)) {
        suspendList.value.push(dm)
        cancelSuspend()
      }
    },
    onmouseout: (e: { stopImmediatePropagation: () => void; target: { closest: (arg0: string) => HTMLElement; }; }) => {
      if (!isSuspend.value) return
      // e.stopImmediatePropagation()
      const dm: HTMLElement = e.target.closest('.dm')
      if (!dm) return
      const suspend = dm.getElementsByClassName('dm-suspend')[0] as HTMLElement
      if (isSuspend.value && suspend) {
        suspend.style.display = 'none'
      }
      dm.classList.remove('pause')
      if (suspendList.value.includes(dm)) {
        const index: number = suspendList.value.indexOf(dm)
        suspendList.value.splice(index, 1)
      }
    }
  },
    [slots.dm && slots.dm({
      danmu,
      index
    })]), div.value as HTMLDivElement)

  return div.value.childNodes[0]
}

/**
 * 创建suspend dom节点
 * @param {Danmu} danmu 当前弹幕数据
 * @param {number} index 当前弹幕下标
 * @return dom节点
 */
function createSuspendVDom(danmu: Danmu, index: number) {
  const div = ref<HTMLElement>(document.createElement('div'))
  render(h('div', {},
    [slots.suspend && slots.suspend({
      danmu, index
    })]), div.value as HTMLElement)

  return div.value.childNodes[0]
}

/**
 * 监听移出当前元素 取消移动端悬浮
 */
function cancelSuspend() {
  document.body.addEventListener('mouseout', e => {
    e.stopImmediatePropagation()
    if (suspendList.value.length) {
      suspendList.value.map(el => {
        el.classList.remove('pause')
      })
      suspendList.value = []
    }
  }, { once: true })
}

/**
 * 触摸悬浮
 */
function initSuspendEvents() {
  let suspendDanmus: HTMLElement[] = []
  dmContainer.value.addEventListener('mousemove', e => {
    let target = e.target as EventTarget & HTMLElement
    if (!target.className.includes('dm')) {
      target = target.closest('.dm') || target
    }
    if (!target.className.includes('dm')) return
    /**
       * 2023.06.07
       * v0.2.0(beta) https://github.com/dshuais/danmaku-vue/issues/10
       * 优化获取dm-suspend的方法  mouseout同理
       */
    const suspend = target.getElementsByClassName('dm-suspend')[0] as HTMLElement // target.childNodes[1] as HTMLElement
    if (isSuspend.value && suspend) {
      suspend.style.display = 'flex'
    }
    target.classList.add('pause')
    suspendDanmus.push(target)
  })
  dmContainer.value.addEventListener('mouseout', e => {
    let target = e.target as EventTarget & HTMLElement
    if (!target.className.includes('dm')) {
      target = target.closest('.dm') || target
    }
    if (!target.className.includes('dm')) return
    const suspend = target.getElementsByClassName('dm-suspend')[0] as HTMLElement
    if (isSuspend.value && suspend) {
      suspend.style.display = 'none'
    }
    target.classList.remove('pause')
    suspendDanmus.forEach((item) => {
      item.classList.remove('pause')
    })
    suspendDanmus = []
  })
}

/**
 * 关闭定时器
 */
function clearTimer() {
  clearInterval(timer)
  timer = null
}

function reset() {
  danmuHeight.value = 0
  init()
}

function clear() {
  danChannel.value = {}
  dmContainer.value.innerHTML = ''
  paused.value = true
  hidden.value = false
  clearTimer()
  index.value = 0
  suspendList.value = []
}

function pause() {
  paused.value = true
}

function show() {
  hidden.value = false
}

function hide() {
  hidden.value = true
}

/**
 * 添加弹幕 添加至播放位置
 * @param {Danmu} dm 播放的弹幕
 * @return {number} 弹幕的下标
 */
function add(dm: Danmu): number {
  if (index.value >= danmuList.value.length - 1) {
    danmuList.value.push(dm)
    play()
    return danmuList.value.length - 1
  } else {
    const _index = index.value % danmuList.value.length
    danmuList.value.splice(_index, 0, dm)
    play()
    return _index - 1
  }
}

/**
 * 添加弹幕 添加至末尾
 * @param {Danmu} dm 播放的弹幕
 * @return {number} 弹幕的下标
 */
function push(dm: Danmu): number {
  danmuList.value.push(dm)
  return danmuList.value.length - 1
}

function resize() {
  initCore()
  const items = dmContainer.value.getElementsByClassName('dm')
  for (let i = 0; i < items.length; i++) {
    const el = items[i] as HTMLDivElement
    el.style.setProperty('--dm-scroll-width', `-${containerWidth.value + (el.offsetWidth * 2)}px`)
    el.style.left = `${containerWidth.value}px`
    el.style.animationDuration = `${containerWidth.value / speeds.value}s`
  }
}

function getPlayState(): boolean {
  return !paused.value
}

function getInsertList(): Danmu[] {
  return insertList.value
}

function useModelWrapper<T>(data: any, emit: Function, name = 'modelValue', translater?: Function) {
  return computed<T>({
    get: () => data,
    set: (value) => {
      emit(`update:${name}`, translater ? translater(value) : value)
    },
  })
}

const version = '1.0.0'
onMounted(() => {
  console.log(`%c danmaku-vue %c V${version} `, 'padding: 2px 1px; border-radius: 3px 0 0 3px; color: #fff; background: #606060; font-weight: bold;', 'padding: 2px 1px; border-radius: 0 3px 3px 0; color: #fff; background: #42c02e; font-weight: bold;')
  init()
})

onBeforeUnmount(() => {
  clear()
})

defineExpose({
  add, push, insert,
  play, pause, reset, resize, show, hide, clear,
  getPlayState, getInsertList
})

</script>
<template>
  <div ref="container" class="danmaku-container">
    <div ref="dmContainer" :class="['danmus', { show: !hidden }, { paused: paused }]">
      <slot />
      <!-- <slot :danmu="{ title: '弹幕', user: '用户' }" :index="1"></slot> -->
      <!-- <slot name="dm" :danmu="{ title: '弹幕', user: '用户' }" :index="1"></slot> -->
      <!-- <slot name="suspend" :danmu="{ title: '弹幕', user: '用户' }" :index="1"></slot> -->
    </div>
  </div>
</template>
<style lang="scss">
.danmaku-container {
  position: relative;
  overflow: hidden;
  -webkit-transform: translateZ(0);
  -moz-transform: translateZ(0);
  -ms-transform: translateZ(0);
  -o-transform: translateZ(0);
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000;
  -webkit-backface-visibility: hidden;
  -webkit-perspective: 1000;

  .danmus {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
    -webkit-transform: translateZ(0);
    -moz-transform: translateZ(0);
    -ms-transform: translateZ(0);
    -o-transform: translateZ(0);
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000;
    -webkit-backface-visibility: hidden;
    -webkit-perspective: 1000;
    user-select: none;

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
      color: #666;
      text-align: center;
      white-space: pre;
      // transform: translateX(0);
      transform-style: preserve-3d;
      -webkit-transform: translateZ(0);
      -moz-transform: translateZ(0);
      -ms-transform: translateZ(0);
      -o-transform: translateZ(0);
      transform: translateZ(0);
      backface-visibility: hidden;
      perspective: 1000;
      -webkit-backface-visibility: hidden;
      -webkit-perspective: 1000;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;

      &>div {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

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
