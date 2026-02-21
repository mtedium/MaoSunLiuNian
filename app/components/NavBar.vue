<script setup>
import { useRoute } from 'vue-router'
import { useScrollStore } from '~/stores/scrollStore'

const route = useRoute()
const store = useScrollStore()

const navItems = [
  { name: '首页', path: '/' },
  { name: '地图', path: '/map' },
  { name: '社区', path: '/community' },
  { name: '顾问', path: '/?' },
  { name: '用户中心', path: '/profile' }
]

const isActive = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

const handleNavClick = (path) => {
  if (path === '/') {
    // 强制重置序章
    store.resetIntro()
  }
}
</script>

<template>
  <!-- 
    调整说明：
    1. 背景色调亮：bg-stone-900/95 -> bg-stone-800/90
    2. 边框颜色调亮：border-stone-800/50 -> border-stone-700/60
    3. 去掉 container mx-auto，改为 w-full px-6 md:px-10，使内容更贴近边缘
  -->
  <nav class="fixed top-0 left-0 w-full z-50 bg-stone-900/95 backdrop-blur-md border-b border-stone-700/30 shadow-lg">
    <div class="w-full px-4 md:px-10 h-20 flex items-center justify-between relative">
      <!-- 品牌标识 -->
      <NuxtLink to="/" class="flex items-center gap-4 group" @click="handleNavClick('/')">
        <!-- 红色印章模拟 - 调亮红色 -->
        <div class="w-9 h-9 bg-red-800/90 rounded-sm flex items-center justify-center border border-red-700 shadow-[0_0_12px_rgba(185,28,28,0.4)] group-hover:scale-105 transition-transform duration-500">
          <span class="text-stone-50 font-serif text-sm font-bold rotate-0 group-hover:rotate-12 transition-transform duration-500">卯</span>
        </div>
        
        <div class="flex flex-col justify-center h-full">
          <!-- 字体颜色调亮 -->
          <span class="text-2xl font-serif font-medium text-stone-100 tracking-[0.2em] group-hover:text-amber-400 transition-colors duration-500">
            榫卯流年
          </span>
        </div>
      </NuxtLink>

      <!-- 导航链接 -->
      <div class="hidden md:flex items-center space-x-12">
        <NuxtLink 
          v-for="item in navItems" 
          :key="item.path" 
          :to="item.path"
          class="relative group py-2 flex flex-col items-center justify-center"
          @click="handleNavClick(item.path)"
        >
          <!-- 文本 - 极简雅致 -->
          <span 
            class="text-lg font-serif tracking-widest transition-colors duration-300"
            :class="isActive(item.path) ? 'text-stone-100 font-medium' : 'text-stone-400 group-hover:text-stone-300'"
          >
            {{ item.name }}
          </span>

          <!-- 底部短线 - 克制内敛 -->
          <span 
            class="absolute -bottom-1 left-1/2 -translate-x-1/2 h-[2px] bg-amber-800/80 transition-all duration-300 ease-out"
            :class="isActive(item.path) ? 'w-4 opacity-100' : 'w-0 opacity-0'"
          ></span>
        </NuxtLink>
      </div>

      <!-- 移动端菜单按钮 -->
      <div class="md:hidden text-stone-300">
        <button class="p-2 hover:text-amber-400 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
nav {
  /* 稍微增加一点暖色调的叠加，使其看起来不那么死板的黑 */
  background-image: 
    linear-gradient(to bottom, rgba(30, 25, 20, 0.2), rgba(30, 25, 20, 0.1)),
    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E");
}
</style>
