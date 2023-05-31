/*
 * @Author: dushuai
 * @Date: 2023-05-31 15:00:44
 * @LastEditors: dushuai
 * @LastEditTime: 2023-05-31 16:24:18
 * @description: Danmaku
 */
import type { App } from 'vue'
import Danmaku from './Danmaku.vue'

// 使用install方法，在app.use挂载
Danmaku.install = (app: App) => {
  app.component(Danmaku.__name as string, Danmaku)
}

export default Danmaku
