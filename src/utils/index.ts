/*
 * @Author: dushuai
 * @Date: 2023-06-07 10:37:36
 * @LastEditors: dushuai
 * @LastEditTime: 2023-06-07 10:54:00
 * @description: utils
 */

/**
 * 获取图片路径
 * @param {string} name 图片名称，绝对与assets/img/文件夹
 * @returns {string} 图片的绝对路径
 * @Readmore https://vitejs.cn/guide/assets.html#new-url-url-import-meta-url
 */
export const getImageUrl = (name: string): string => {
  return new URL(`../assets/img/${name}`, import.meta.url).href
}