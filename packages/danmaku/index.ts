/*
 * @Author: dushuai
 * @Date: 2023-05-31 15:00:44
 * @LastEditors: dushuai
 * @LastEditTime: 2023-06-06 12:21:37
 * @description: Danmaku
 */
import type { App } from 'vue'
import Danmaku from './Danmaku.vue'
import type { Danmu } from './Danmaku.vue'

// 使用install方法，在app.use挂载
Danmaku.install = (app: App) => {
  app.component(Danmaku.__name as string, Danmaku)
}

export {
  Danmu
}

export default Danmaku
