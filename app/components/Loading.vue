<script setup>
import { useScrollStore } from '../stores/scrollStore'

const store = useScrollStore()
</script>

<template>
  <div v-if="store.isLoading" class="fixed inset-0 z-50 flex items-center justify-center bg-bg-base text-text-primary transition-opacity duration-500">
    <div class="text-2xl tracking-widest animate-pulse">
      正在载入...
    </div>
  </div>
</template>
