/*
 * @Author: dushuai
 * @Date: 2023-05-25 15:46:39
 * @LastEditors: dushuai
 * @LastEditTime: 2023-05-26 18:01:42
 * @description: 心平气和
 */
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  server: {
    port: 5173,
    host: '0.0.0.0', // 使用ip能访问
    open: true,
    https: false,
    hmr: true, // hmr热更新
    strictPort: false, // 为true若端口已被占用则会直接退出
  },
})
