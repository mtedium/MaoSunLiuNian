import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useScrollStore = defineStore('scroll', () => {
  const currentScene = ref(0)
  const isLoading = ref(true)

  function setScene(index) {
    currentScene.value = index
  }

  function setLoading(status) {
    isLoading.value = status
  }

  return { currentScene, isLoading, setScene, setLoading }
})
