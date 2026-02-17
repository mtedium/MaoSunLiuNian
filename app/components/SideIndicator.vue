<script setup>
import { useScrollStore } from '../stores/scrollStore'

const store = useScrollStore()
const scenes = ['壹', '贰', '叁', '肆', '伍']

const scrollToScene = (index) => {
  store.setScene(index)
  const el = document.getElementById(`scene-${index}`)
  if (el) {
    // Check if element is pinned (wrapped in pin-spacer) by GSAP
    // GSAP ScrollTrigger wraps pinned elements in a div with class "pin-spacer"
    const parent = el.parentElement
    const target = (parent && parent.classList.contains('pin-spacer')) ? parent : el
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<template>
  <nav class="fixed top-1/2 right-8 z-50 transform -translate-y-1/2 flex flex-col items-center space-y-4 mix-blend-difference">
    <div class="flex flex-col space-y-4">
      <button 
        v-for="(scene, index) in scenes" 
        :key="index"
        @click="scrollToScene(index)"
        class="w-8 h-8 rounded-full border border-white flex items-center justify-center text-xs transition-all duration-300 hover:bg-white hover:text-black cursor-pointer"
        :class="{ 'bg-white text-black': store.currentScene === index }"
      >
        {{ scene }}
      </button>
    </div>
  </nav>
</template>
