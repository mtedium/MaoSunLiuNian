// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-02-17',
  // 开启调试工具
  devtools: { enabled: true },

  // 模块注册
  modules: [
    '@tresjs/nuxt',
    '@pinia/nuxt'
  ],

  // 引入你的全局样式
  css: ['./assets/css/style.css'],

  // Vite 配置
  vite: {
    plugins: [
      tailwindcss()
    ]
  }
})
