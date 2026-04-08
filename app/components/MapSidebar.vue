<template>
  <div
      class="fixed left-0 top-20 bottom-0 w-80 md:w-96 bg-bg-surface/90 backdrop-blur-md border-r border-border-default z-40 text-text-primary flex flex-col font-sans transition-transform duration-500 ease-in-out"
      :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <!-- 侧边栏抽屉把手 -->
      <button
        @click="$emit('toggle')"
        class="absolute top-1/2 -right-8 w-8 h-16 bg-bg-surface/90 backdrop-blur-md border border-border-default border-l-0 rounded-r-md flex items-center justify-center text-text-secondary hover:text-amber-600 dark:hover:text-amber-500 hover:bg-bg-elevated/60 cursor-pointer transform -translate-y-1/2 z-50 transition-colors shadow-sm"
        title="切换侧边栏"
      >
      <svg v-if="isOpen" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
      <!-- 通用头部，可以放置标题 -->
      <div class="flex items-center justify-between p-4 border-b border-border-default">
        <h2 class="text-xl font-bold text-amber-600 dark:text-amber-500 tracking-wider">
          {{ mode === 'explorer' ? '古建溯源' : '建筑详览' }}
        </h2>
      </div>

      <!-- 滚动容器 -->
      <div class="flex-1 overflow-y-auto no-scrollbar relative p-4 space-y-6">
        <Transition name="fade" mode="out-in">
          <!-- Explorer Mode -->
          <div v-if="mode === 'explorer'" key="explorer" class="space-y-6">
            <!-- 搜索框 -->
            <div class="relative">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="搜索建筑名称..."
                class="w-full bg-bg-surface border border-border-default rounded-md px-4 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-amber-600/50 dark:focus:border-amber-500/50 transition-colors"
              />
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 absolute right-3 top-3 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <!-- 朝代筛选 -->
            <div>
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-xs font-semibold text-text-secondary uppercase tracking-widest">朝代筛选</h3>
                <button 
                  @click="selectedDynasties = selectedDynasties.length === dynasties.length ? [] : [...dynasties]" 
                  class="text-xs text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                >
                  {{ selectedDynasties.length === dynasties.length ? '全不选' : '全选' }}
                </button>
              </div>
              <div class="grid grid-cols-3 gap-2">
                <label v-for="dynasty in dynasties" :key="dynasty" class="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    :value="dynasty"
                    v-model="selectedDynasties"
                    class="form-checkbox h-4 w-4 text-amber-600 dark:text-amber-500 bg-bg-base border-border-default rounded focus:ring-1 focus:ring-amber-600/50 dark:focus:ring-amber-500/50 accent-amber-600 dark:accent-amber-500"
                  />
                  <span class="text-sm text-text-primary group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">{{ dynasty }}</span>
                </label>
              </div>
            </div>

            <!-- 匹配列表 -->
            <div>
              <h3 class="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-3">探索列表</h3>
              <ul class="space-y-2">
                <li
                  v-for="arch in filteredArchitectures"
                  :key="arch.id"
                  @click="handleSelect(arch)"
                  class="p-3 bg-bg-elevated/20 border border-border-default rounded-md cursor-pointer hover:bg-bg-elevated/40 hover:border-amber-600/50 dark:hover:border-amber-500/50 transition-all duration-300 group flex justify-between items-center"
                >
                  <div>
                    <div class="text-text-primary font-medium group-hover:text-amber-600 dark:group-hover:text-amber-500">{{ arch.name }}</div>
                    <div class="text-xs text-text-muted mt-1">{{ arch.era }}</div>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-text-muted group-hover:text-amber-600/50 dark:group-hover:text-amber-500/50 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </li>
                
                <li v-if="filteredArchitectures.length === 0" class="text-center py-8 text-sm text-text-muted">
                  无相关建筑数据
                </li>
              </ul>
            </div>
          </div>

          <!-- Detail Mode -->
          <div v-else-if="mode === 'detail' && selectedArch" key="detail" class="space-y-6">
            <button
              @click="$emit('back')"
              class="flex items-center text-sm text-text-secondary hover:text-amber-600 dark:hover:text-amber-500 transition-colors mb-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回探索
            </button>

            <!-- 标题区 -->
            <div class="border-b border-border-default pb-4">
              <h1 class="text-2xl font-bold text-amber-600 dark:text-amber-500 mb-2">{{ selectedArch.name }}</h1>
              <span class="inline-block px-2 py-1 bg-bg-elevated/50 border border-border-default rounded-sm text-xs text-text-secondary">
                {{ selectedArch.era }}
              </span>
            </div>

            <!-- AI 简介区 -->
            <div>
              <div class="flex items-center space-x-2 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-amber-600 dark:text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <h3 class="text-sm font-semibold text-amber-600 dark:text-amber-500 tracking-widest">AI 赋能解析</h3>
              </div>
              <div class="bg-bg-surface/40 p-4 border border-border-default rounded-md relative group">
                <!-- 装饰角标 -->
                <div class="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-600/50 dark:border-amber-500/50 rounded-tl"></div>
                <div class="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-600/50 dark:border-amber-500/50 rounded-br"></div>
                
                <p class="text-sm text-text-primary leading-relaxed font-serif tracking-wide text-justify" v-if="selectedArch.description">
                  {{ selectedArch.description }}
                </p>
                <div v-else class="flex flex-col items-center justify-center py-6 text-text-muted">
                  <svg class="animate-spin h-5 w-5 mb-2 text-amber-600 dark:text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span class="text-xs">凝结历史数据中...</span>
                </div>
              </div>
            </div>

            <!-- 互动数据与操作区 -->
            <div class="pt-4 mt-6 border-t border-border-default">
              <div class="flex items-center space-x-2 text-xs text-text-muted mb-4" v-if="selectedArch.article_count && selectedArch.article_count > 0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H14" />
                </svg>
                <span>社区点亮记录：<strong class="text-amber-600 dark:text-amber-500">{{ selectedArch.article_count }}</strong> 篇</span>
              </div>
              <div class="flex items-center space-x-2 text-xs text-text-muted mb-4" v-else>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span class="text-text-muted">此地尚未有点亮记录，邀君首创</span>
              </div>
              
              <div class="flex gap-2">
                <NuxtLink 
                  :to="{ path: '/community', query: { architecture_id: selectedArch.id } }"
                  class="flex-1 flex items-center justify-center space-x-2 bg-bg-elevated/40 hover:bg-border-subtle/60 text-amber-600 dark:text-amber-500 border border-amber-600/30 dark:border-amber-500/30 hover:border-amber-600 dark:hover:border-amber-500 py-2.5 px-4 rounded-md transition-all duration-300 group"
                >
                  <span>{{ '去社区查看' }}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </NuxtLink>

                <NuxtLink 
                  :to="`/consultant?q=${encodeURIComponent('请给我详细解释一下什么是' + selectedArch.name)}`"
                  class="flex items-center justify-center px-4 bg-bg-elevated/40 hover:bg-amber-900/40 text-amber-500 border border-amber-500/30 hover:border-amber-500 rounded-md transition-all duration-300 group"
                  title="问问大师"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </NuxtLink>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <!-- 底部装饰线 -->
      <div class="relative mt-auto w-full pt-4 pb-2 px-4 border-t border-border-default bg-bg-surface/50">
        <div class="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-amber-600/30 dark:via-amber-500/30 to-transparent"></div>
      </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: true
  },
  mode: {
    type: String,
    default: 'explorer', // 'explorer' | 'detail'
  },
  architectures: {
    type: Array,
    default: () => []
  },
  selectedArch: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'toggle', 'select', 'back', 'filter-change'])

// Search and Filter State
const searchQuery = ref('')
const selectedDynasties = ref([])

// Unique Dynasties derived from architectures
const dynasties = computed(() => {
  const set = new Set(props.architectures.map(a => a.era).filter(Boolean))
  return Array.from(set)
})

// Initialize selectedDynasties with all dynasties when architectures load
watch(dynasties, (newDynasties) => {
  if (newDynasties.length > 0 && selectedDynasties.value.length === 0) {
    selectedDynasties.value = [...newDynasties]
  }
}, { immediate: true })

// Filtered architectures
const filteredArchitectures = computed(() => {
  return props.architectures.filter(arch => {
    const matchQuery = arch.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    // If nothing is selected, match nothing instead of matching everything
    const matchDynasty = selectedDynasties.value.includes(arch.era)
    return matchQuery && matchDynasty
  })
})

watch(filteredArchitectures, (newVal) => {
  emit('filter-change', newVal.map(a => a.id))
}, { deep: true, immediate: true })

const handleSelect = (arch) => {
  emit('select', arch)
}
</script>

<style scoped>
/* Fade Transition (Inner content switching) */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
