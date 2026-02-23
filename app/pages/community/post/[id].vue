<template>
  <div class="min-h-screen bg-stone-900 text-stone-200 p-8 pt-24">
    <div v-if="pending" class="flex justify-center pt-20">
      <div class="animate-spin text-4xl">⏳</div>
    </div>

    <div v-else-if="error" class="text-center pt-20 text-red-400">
      文章加载失败：{{ error.message }}
    </div>

    <article v-else class="max-w-3xl mx-auto bg-stone-800/30 p-8 rounded-2xl border border-stone-800 shadow-2xl">
      <!-- 头部信息 -->
      <header class="mb-8 border-b border-stone-700/50 pb-6">
        <div class="flex justify-between items-start mb-4">
          <h1 class="text-3xl md:text-4xl font-bold font-serif text-amber-500 leading-tight">
            {{ post.title }}
          </h1>
          
          <!-- 编辑入口 -->
          <NuxtLink 
            v-if="canEdit" 
            :to="`/community/edit?id=${post.id}`"
            class="shrink-0 ml-4 px-3 py-1 text-sm bg-stone-700 hover:bg-stone-600 rounded text-stone-300 transition-colors"
          >
            ✏️ 编辑
          </NuxtLink>
        </div>

        <div class="flex flex-wrap items-center gap-4 text-sm text-stone-400">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-stone-600 flex items-center justify-center text-stone-300">
              {{ post.author_id === 1 ? '管' : 'U' }}
            </div>
            <span>{{ formatDate(post.created_at) }}</span>
          </div>

          <div v-if="post.architecture_id" class="flex items-center gap-3">
            <!-- 建筑标签 -->
            <div class="flex items-center gap-1 text-amber-400/80 bg-amber-900/20 px-2 py-1 rounded">
              <span>📍</span>
              <span>{{ architectureName || `古建 #${post.architecture_id}` }}</span>
            </div>

            <!-- 入口按钮组 -->
            <div class="flex items-center gap-2">
              <NuxtLink 
                :to="{ path: '/map', query: { focus_id: post.architecture_id } }"
                class="text-xs border border-amber-400/30 px-2 py-1 rounded hover:bg-amber-400/10 transition-colors flex items-center gap-1"
                title="在地图中查看"
              >
                <span>🗺️</span>
                <span>在地图中查看</span>
              </NuxtLink>
              
              <!-- 问问大师入口 -->
              <NuxtLink 
                :to="`/consultant?q=${encodeURIComponent('关于《' + post.title + '》这篇文章，我还有些疑问...')}`"
                class="text-xs border border-amber-400/30 px-2 py-1 rounded hover:bg-amber-400/10 transition-colors flex items-center gap-1"
                title="咨询营造大师"
              >
                <span>💬</span>
                <span>问大师</span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </header>

      <!-- 文章正文 -->
      <!-- 使用 prose-invert 适配暗黑模式 -->
      <div 
        class="prose prose-invert prose-stone prose-lg max-w-none 
               prose-headings:font-serif prose-headings:text-amber-500/90
               prose-a:text-amber-400 prose-img:rounded-xl prose-img:shadow-lg"
        v-html="post.content"
      ></div>

      <!-- 底部交互 -->
      <div class="mt-12 pt-8 border-t border-stone-700/50 flex justify-between items-center">
        <button 
          @click="router.back()"
          class="text-stone-500 hover:text-stone-300 transition-colors"
        >
          ← 返回列表
        </button>

        <div class="flex gap-4">
          <button 
            @click="handleLike" 
            class="flex items-center gap-2 px-4 py-2 rounded-full bg-stone-700/50 hover:bg-red-900/30 hover:text-red-400 transition-all active:scale-95"
            :class="{ 'text-red-400 bg-red-900/20': isLiked }"
          >
            <span :class="{ 'animate-bounce': isLiking }">❤️</span>
            <span>{{ likes }}</span>
          </button>
          
          <button class="flex items-center gap-2 px-4 py-2 rounded-full bg-stone-700/50 hover:bg-amber-900/30 hover:text-amber-400 transition-all">
            <span>⭐</span>
            <span>收藏</span>
          </button>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()
const postId = route.params.id

// 获取文章详情
const { data: post, pending, error } = await useFetch(`/api/posts/${postId}`)

// 状态
const likes = ref(0)
const isLiked = ref(false)
const isLiking = ref(false)
const architectureName = ref('')

// 模拟当前用户 ID (实际应从 auth store 获取)
const currentUserId = 1 
const canEdit = computed(() => post.value?.author_id === currentUserId)

// 初始化数据
watch(post, async (newPost) => {
  if (newPost) {
    likes.value = newPost.likes || 0
    
    // 获取关联古建名称
    if (newPost.architecture_id) {
       // 先设置一个默认值，防止请求期间空白
       architectureName.value = `古建 #${newPost.architecture_id}`
       try {
         const { data: arch } = await useFetch(`/api/map/detail`, { params: { id: newPost.architecture_id } })
         // 注意：detail 接口返回结构通常是 { code: 200, data: { ... } }
         // 如果 useFetch 自动解包了 data，那么 arch.value 可能直接就是数据，或者 arch.value.data 是数据
         // 根据 MapSidebar.vue 中的用法: const res = await $fetch('/api/map/detail'...); res.data
         // useFetch 返回的 data 是响应式引用，指向接口响应体
         
         if (arch.value && arch.value.code === 200 && arch.value.data) {
            architectureName.value = arch.value.data.name
         } else if (arch.value && arch.value.name) {
            // 兼容直接返回对象的情况
            architectureName.value = arch.value.name
         } else {
            architectureName.value = `古建 #${newPost.architecture_id}`
         }
       } catch (e) {
         console.error('获取古建名称失败:', e)
         architectureName.value = `古建 #${newPost.architecture_id}`
       }
    }
  }
}, { immediate: true })

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const handleLike = () => {
  if (isLiking.value) return
  
  isLiking.value = true
  // 纯前端模拟 +1
  if (!isLiked.value) {
    likes.value++
    isLiked.value = true
  } else {
    likes.value--
    isLiked.value = false
  }
  
  // 动画复位
  setTimeout(() => {
    isLiking.value = false
  }, 500)
}
</script>
