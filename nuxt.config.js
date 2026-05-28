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
    '@pinia/nuxt',
    '@nuxtjs/color-mode'
  ],

  // nitro: {
  //   externals: {
  //     trace: false,
  //     inline: [
  //       'hookable', 
  //       'unhead', 
  //       '@unhead/vue',
  //       'entities'
  //     ]
  //   },
  //   // 强行把所有依赖全部揉进最终的单文件代码里
  //   experimental: {
  //     noExternals: true
  //   }
  // },

  // Color Mode 配置
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'dark'
  },

  // 引入你的全局样式
  css: ['./assets/css/style.css'],

  // Vite 配置
  vite: {
    plugins: [
      tailwindcss()
    ]
  },

  // 运行时配置
  runtimeConfig: {
    aiApiKey: process.env.AI_API_KEY,
    aiApiBase: process.env.AI_API_BASE,
    aiModel: process.env.AI_MODEL,
    aiModelMap: process.env.AI_MODEL_MAP,
    
    public: {
      amapKey: process.env.NUXT_PUBLIC_AMAP_KEY || '',
      amapSecurityCode: process.env.NUXT_PUBLIC_AMAP_SECURITY_CODE || ''
    }
  }
})
