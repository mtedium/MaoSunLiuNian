<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const progress = ref(0)

const updateProgress = () => {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  // Calculate percentage (0 to 100)
  const percent = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100))
  progress.value = percent
}

onMounted(() => {
  window.addEventListener('scroll', updateProgress)
  updateProgress() // Initial check
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress)
})
</script>

<template>
  <div class="fixed bottom-0 left-0 w-full h-1 bg-stone-800 z-50">
    <div 
      class="h-full bg-amber-600 transition-all duration-100 ease-out"
      :style="{ width: `${progress}%` }"
    ></div>
    <!-- Optional: Percentage Display -->
    <div class="absolute right-4 bottom-4 text-xs font-mono text-stone-500 opacity-50">
       {{ Math.round(progress) }}%
    </div>
  </div>
</template>
