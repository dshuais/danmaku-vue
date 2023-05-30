/*
 * @Author: dushuai
 * @Date: 2023-05-29 11:53:28
 * @LastEditors: dushuai
 * @LastEditTime: 2023-05-29 15:04:49
 * @description: 重写计算属性的get set，组件v-model的语法糖
 */
import { computed } from 'vue'

export function useModelWrapper<T>(data: any, emit: Function, name = 'modelValue', translater?: Function) {
  return computed<T>({
    get: () => data,
    set: (value) => {
      emit(`update:${name}`, translater ? translater(value) : value)
    },
  })
}
