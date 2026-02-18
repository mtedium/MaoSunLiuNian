import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useScrollStore = defineStore('scroll', () => {
  const currentScene = ref(0)
  const isLoading = ref(true)
  const showIntro = ref(true)

  function setScene(index) {
    currentScene.value = index
  }

  function setLoading(status) {
    isLoading.value = status
  }

  function setShowIntro(status) {
    showIntro.value = status
  }

  function resetIntro() {
    showIntro.value = true
    // 滚动到顶部
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0)
    }
  }

  return { currentScene, isLoading, showIntro, setScene, setLoading, setShowIntro, resetIntro }
})
