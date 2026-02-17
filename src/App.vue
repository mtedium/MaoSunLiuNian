<script setup>
import { onMounted, onUnmounted, ref, unref } from 'vue'
import { useScrollStore } from './stores/scrollStore'
import SideIndicator from './components/SideIndicator.vue'
import Loading from './components/Loading.vue'
import GlobalProgressBar from './components/GlobalProgressBar.vue'
import Section1 from './components/Section1.vue'
import Section2 from './components/Section2.vue'
import Section3 from './components/Section3.vue'
import Section4 from './components/Section4.vue'
import Section5 from './components/Section5.vue'

const store = useScrollStore()
const mainContent = ref(null)

// Observer logic
let observer

onMounted(() => {
  setTimeout(() => {
    store.setLoading(false)
    setupObserver()
  }, 2000)
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})

const setupObserver = () => {
  const options = {
    root: null,
    rootMargin: '-45% 0px -45% 0px', // Trigger when element is in the middle 10% of viewport
    threshold: 0
  }

  observer = new IntersectionObserver((entries) => {
    let candidate = null
    let bestRatio = 0

    entries.forEach(entry => {
      if (!entry.isIntersecting) return

      const index = parseInt(entry.target.id.replace('scene-', ''))
      if (isNaN(index)) return

      if (entry.intersectionRatio >= bestRatio) {
        bestRatio = entry.intersectionRatio
        candidate = index
      }
    })

    if (candidate !== null && candidate !== unref(store.currentScene)) {
      store.setScene(candidate)
    }
  }, options)

  // Observe all scene sections
  for (let i = 0; i <= 4; i++) {
    const el = document.getElementById(`scene-${i}`)
    if (el) observer.observe(el)
  }
}
</script>

<template>
  <div class="relative min-h-screen bg-black text-white overflow-x-hidden font-sans">
    <!-- 全屏动态纹理背景 (z-index 最底层) -->
    <div class="fixed inset-0 z-0 opacity-20 pointer-events-none">
      <!-- 将来放置 Canvas 或 WebGL 纹理 -->
      <div class="w-full h-full bg-[url('/assets/texture-placeholder.png')] bg-cover bg-center"></div>
    </div>

    <!-- 加载遮罩 -->
    <Loading />

    <!-- 导航栏 -->
    <SideIndicator />

    <!-- 全局进度条 -->
    <GlobalProgressBar />

    <!-- 主内容区域 -->
    <main ref="mainContent" class="relative z-10">
      <Section1 id="scene-0" />
      <Section2 id="scene-1" />
      <Section3 id="scene-2" />
      <Section4 id="scene-3" />
      <Section5 id="scene-4" />
    </main>
  </div>
</template>

<style>
/* 全局样式调整 */
html {
  scroll-behavior: smooth;
}
</style>
