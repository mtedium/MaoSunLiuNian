<script setup>
import { onMounted, onUnmounted, ref, unref, watch } from 'vue'
import { useScrollStore } from '~/stores/scrollStore'
import { useRoute } from 'vue-router'
// Components are auto-imported by Nuxt

const store = useScrollStore()
const route = useRoute()
const mainContent = ref(null)

// Observer logic
let observer

onMounted(() => {
  // 确保刷新或加载时重置状态
  store.resetIntro()
  // 禁止初始滚动
  document.body.style.overflow = 'hidden'

  setTimeout(() => {
    store.setLoading(false)
    setupObserver()
  }, 2000)
})

onUnmounted(() => {
  if (observer) observer.disconnect()
  document.body.style.overflow = ''
})

// 监听路由变化，如果跳转回首页，重置序章状态
watch(
  () => route.path,
  (newPath) => {
    if (newPath === '/') {
      // 总是显示 intro
      store.resetIntro()
      document.body.style.overflow = 'hidden'
    }
  }
)

// 监听 store 中的 showIntro 变化
watch(
  () => store.showIntro,
  (newVal) => {
    if (newVal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
)

const onIntroComplete = () => {
  store.setShowIntro(false)
}

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
  <div>
    <!-- 加载遮罩 -->
    <Loading />

    <!-- 序章动画 -->
    <IntroScene v-if="!store.isLoading && store.showIntro" @complete="onIntroComplete" />

    <!-- 侧边栏 -->
    <SideIndicator v-show="!store.showIntro" />

    <!-- 全局进度条 -->
    <GlobalProgressBar v-show="!store.showIntro" />

    <!-- 主内容区域 -->
    <div ref="mainContent">
      <Section1 id="scene-0" />
      <Section2 id="scene-1" />
      <Section3 id="scene-2" />
      <Section4 id="scene-3" />
      <Section5 id="scene-4" />
    </div>
  </div>
</template>
