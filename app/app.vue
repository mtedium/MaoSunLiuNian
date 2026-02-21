<script setup>
import { useAuthStore } from '~/stores/authStore'

const authStore = useAuthStore()

// 应用启动时恢复登录状态
onMounted(() => {
  authStore.restore()
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
