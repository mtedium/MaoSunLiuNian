<template>
  <div class="min-h-screen bg-stone-900 text-stone-200 p-8 pt-24">
    <div class="max-w-7xl mx-auto space-y-8">
      
      <!-- 顶部操作栏 -->
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-serif text-amber-500">社区广场</h1>
        <NuxtLink 
          to="/community/edit" 
          class="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded-lg flex items-center gap-2 transition-colors"
        >
          <span>✍️</span>
          <span>发布文章</span>
        </NuxtLink>
      </div>

      <!-- 瀑布流列表 -->
      <div v-if="pending" class="text-center py-20 text-stone-500">
        <div class="animate-spin text-4xl mb-2">⏳</div>
        加载中...
      </div>

      <div v-else-if="posts.length === 0" class="text-center py-20 text-stone-500 bg-stone-800/30 rounded-lg border border-stone-800">
        <div class="text-4xl mb-2">📭</div>
        暂无文章，快来发布第一篇吧！
      </div>

      <div v-else class="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        <div 
          v-for="post in posts" 
          :key="post.id"
          class="break-inside-avoid bg-stone-800 border border-stone-700 rounded-xl overflow-hidden hover:shadow-xl hover:border-amber-700/50 transition-all duration-300 group cursor-pointer"
          @click="router.push(`/community/post/${post.id}`)"
        >
          <!-- 封面图 -->
          <div v-if="post.cover_url" class="aspect-video w-full overflow-hidden">
            <img 
              :src="post.cover_url" 
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              alt="cover" 
            />
          </div>
          <div v-else class="h-32 bg-stone-700/50 flex items-center justify-center text-stone-600">
             <span class="text-4xl opacity-20">📝</span>
          </div>

          <!-- 内容区 -->
          <div class="p-4 space-y-3">
            <h2 class="text-xl font-bold text-stone-100 group-hover:text-amber-400 transition-colors line-clamp-2">
              {{ post.title }}
            </h2>
            
            <!-- 关联古建 -->
            <div v-if="post.architecture_id" class="flex items-center gap-1 text-xs text-amber-400/80 bg-amber-900/20 px-2 py-1 rounded w-fit">
              <span>📍</span>
              <span>{{ getArchName(post) }}</span>
            </div>

            <!-- 底部信息 -->
            <div class="flex justify-between items-center text-sm text-stone-500 pt-2 border-t border-stone-700/50">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-full bg-stone-600 flex items-center justify-center text-xs text-stone-300">
                  {{ post.author_id === 1 ? '管' : 'U' }}
                </div>
                <span>{{ formatDate(post.created_at) }}</span>
              </div>
              <div class="flex items-center gap-1">
                <span>❤️</span>
                <span>{{ post.likes || 0 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
const router = useRouter()

// 获取文章列表
const { data: posts, pending } = await useFetch('/api/posts')

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

// 获取关联古建名称（为了简化，如果 API 没有返回 name，这里做一个简单的展示处理）
// 实际上为了更好的体验，列表接口应该做联表查询返回 architecture_name
// 这里我们假设后端 API 已经做了联表查询或者我们暂时显示 "古建 #ID"
// 稍后我们会去优化后端 API
const getArchName = (post) => {
  // 如果后端返回了 architecture 对象或 name 字段最好
  // 这里暂时做一个容错
  return post.architecture_name || post.architecture?.name || `古建 #${post.architecture_id}`
}
</script>

<style scoped>
/* 瀑布流每一列的间距 */
</style>
