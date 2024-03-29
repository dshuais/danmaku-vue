# danmaku-vue

[![npm-version](https://img.shields.io/npm/v/danmaku-vue.svg)](https://www.npmjs.com/package/danmaku-vue)
[![size](https://img.shields.io/badge/minifiedsize-27kB-blue.svg)](https://www.npmjs.com/package/danmaku-vue)
[![license](https://img.shields.io/npm/l/express.svg)]()

> 基于 Vue3+ts 的弹幕交互组件 
> 灵感与主要逻辑借鉴于[vue-danmaku](https://github.com/hellodigua/vue-danmaku)库，在此基础上优化和扩展了部分功能，此借鉴不做任何商业用途

官网：[https://danmaku-vue.dshuais.com/](https://danmaku-vue.dshuais.com/)
Demo： [https://dshuais.github.io/danmaku-vue/](https://dshuais.github.io/danmaku-vue/)

## Preview

<img src="https://raw.githubusercontent.com/dshuais/danmaku-vue/main/src/assets/preview.gif" alt="preview" style="zoom:150%;" />

## Install

```bash
$ npm install danmaku-vue --save
或
$ pnpm add danmaku-vue --save
```

## Usage

```vue
<script setup>
import Danmaku from 'danmaku-vue'

const danmus = ref(['danmu1', 'danmu2', 'danmu3', '...'])
</script>

<template>
  <Danmaku :danmus="danmus" style="height:100px; width:300px;"></Danmaku>
</template>
```

## Attributes

|      参数      |                         说明                         |  类型   |      可选值      | 默认值 |
| :------------: | :--------------------------------------------------: | :-----: | :--------------: | :----: |
|     danmus     | 弹幕元素列表，支持纯文本或者自定义对象(支持 v-model) |  Array  | 字符串[]或对象[] |  必填  |
|    channels    |                       轨道数量                       | Number  |                  |   0    |
|    autoplay    |                     是否自动播放                     | Boolean |                  |  true  |
|    useSlot     |                   是否开启弹幕插槽                   | Boolean |                  | false  |
| useSuspendSlot |    是否开启弹幕悬浮时插槽（开启isSuspend时可用）     | Boolean |                  | false  |
|      loop      |                   是否开启弹幕循环                   | Boolean |                  | false  |
|    fontSize    |            弹幕字号（slot 模式下不可用）             | Number  |                  |   18   |
|   extraStyle   |            额外样式（slot 模式下不可用）             | String  |                  |   -    |
|     speeds     |             弹幕速度（每秒移动的像素数）             | Number  |                  |  100   |
|    debounce    |                   弹幕刷新频率(ms)                   | Number  |                  |  100   |
| randomChannel  |                   随机选择轨道插入                   | Boolean |                  | false  |
|   isSuspend    |                 是否开启弹幕悬浮暂停                 | Boolean |                  | false  |
|      top       |                   弹幕垂直间距(px)                   | Number  |                  |   10   |
|     right      |                   弹幕水平间距(px)                   | Number  |                  |   10   |

- 注 1：channels 为 0，则轨道数为容器可容纳最多轨道数（整个容器）
- 注 2：danmus 初始化后如果为空，则 `autoplay` 失效。因此对于异步加载的弹幕数据，需要手动调用 `refName.value.play()` 进行播放
- 注 3：弹幕刷新频率为每隔多长时间插入一条弹幕

## 内置方法

通过以下方式调用：

```js
import Danmaku from 'danmaku-vue'
const danmakuRef = ref<InstanceType<typeof Danmaku>>(null)
danmakuRef.value.play()
...

<Danmaku ref="danmakuRef"></Danmaku>
```

|    方法名     |                     说明                     |              参数              |
| :-----------: | :------------------------------------------: | :----------------------------: |
|     play      |                开始/继续播放                 |               -                |
|     pause     |                 暂停弹幕播放                 |               -                |
|     clear     |              停止播放并清空弹幕              |               -                |
|     show      |                   弹幕显示                   |               -                |
|     hide      |                   弹幕隐藏                   |               -                |
|     reset     |   重置配置（也可在改变播放区域大小后调用）   |               -                |
|    resize     | 容器尺寸改变时重新计算滚动距离（需手动调用） |               -                |
|     push      |   发送弹幕（插入到弹幕列表末尾，排队显示）   | danmu 数据，可以是字符串或对象 |
|      add      |   发送弹幕（插入到当前播放位置，实时显示）   | danmu 数据，可以是字符串或对象 |
|    insert     |     绘制弹幕（实时插入，不进行数据绑定）     | danmu 数据，可以是字符串或对象 |
| getPlayState  |               获得当前播放状态               |               -                |
| getInsertList |     获取使用 `insert` 方法插入的弹幕列表     |            danmu[]             |

- 注 1：`push` 和 `add` 的返回值为插入后的下标，可通过判断下标的方式对当前插入弹幕进行样式定制
- 注 2：`insert` 跟 `push/add` 的区别在于，`insert` 不进行数据绑定，而是直接插入 DOM，适用于直播等场景
- 注 3：推荐使用 `insert` 方式单条插入弹幕，因为add会进行数据绑定

## Events

|  事件名  |              说明              |           返回值            |
| :------: | :----------------------------: | :-------------------------: |
| list-end |        所有弹幕插入完毕        |              -              |
| play-end | 所有弹幕播放完成（已滚出屏幕） | index（最后一个弹幕的下标） |
| dm-click |            弹幕点击            |      danmu数据，index       |

## Slot

如果你有自定义弹幕结构与样式的需求，你可以传入任意结构的对象并自己写内部样式。

|  name   |                     说明                     |   回调参数   |
| :-----: | :------------------------------------------: | :----------: |
| default |                   默认slot                   |      -       |
|   dm    |      自定义弹幕样式（需useSlot为true）       | danmu，index |
| suspend | 自定义弹幕悬浮样式（需useSuspendSlot为true） | danmu，index |

```vue
<script setup>
import Danmaku from 'danmaku-vue'

const danmus = ref([{ avatar: 'http://a.com/a.jpg', text: 'aaa' }...])}
</script>

<template>
  <Danmaku ref="danmaku" :danmus="danmus" useSlot useSuspendSlot loop :channels="5">
    <template #dm="{ danmu, index }">
      <div class="danmu-item">
          <img class="danmu-item--avatar" v-if="danmu.avatar" :src="danmu.avatar" alt="">
          <div>{{ danmu.text }}</div>
      </div>
    </template>
    <template #suspend="{ danmu, index }">
      <div class="danmu-suspend">
        <div class="item" @click="handleAdd(danmu)">➕</div>
        <div class="item" @click="handleIndex(index)">👍</div>
      </div>
    </template>
  </Danmaku>
</template>
```

- 注 1：`dm slot`、`suspend slot`同时使用时，可通过`dm-item:hover`设置悬浮后样式

- 注 2：`suspend slot`的背景色默认为`transparent`，可通过`!important`对`dm-suspend`强制更改悬浮后背景

  

## 讨论交流和 BUG 反馈

这个 [QA文档](https://github.com/dshuais/danmaku-vue/blob/main/QA.md) 收集了一些常见问题，可以做阅读参考

也可以给本项目 [提交 issue](https://github.com/dshuais/danmaku-vue/issues)

如果danmaku-vue帮助到了你，欢迎 [star](https://github.com/dshuais/danmaku-vue/)，你的 star 是我改 BUG 的动力 ヾ(*ゝω・*)ノ



## Changelog

### v1.0.0

- 新增
  1. 新增使用 `insert` 方式插入的弹幕列表，因为直接调用insert不会进行数据绑定，故而提供获取`insertList` 方法
  2. 新增默认 `slot` ，可在弹幕组件内布局其他内容
- 更新
  1. 优化[鼠标悬浮区域问题](https://github.com/dshuais/danmaku-vue/issues/6)
  2. 优化[`insert`方式插入弹幕偶尔无法实时出现问题](https://github.com/dshuais/danmaku-vue/issues/7)
  3. 优化[悬浮效果后文字消失问题](https://github.com/dshuais/danmaku-vue/issues/10)
  4. 更新文档和演示Demo





