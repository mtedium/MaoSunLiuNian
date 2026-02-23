<template>
  <div class="min-h-screen bg-stone-900 text-stone-200 p-8 pt-24">
    <div class="max-w-4xl mx-auto space-y-6">
      
      <!-- 标题输入 -->
      <input 
        v-model="post.title"
        type="text" 
        placeholder="请输入标题..." 
        class="w-full bg-transparent text-4xl font-bold border-none outline-none placeholder-stone-600"
      />

      <!-- 关联古建搜索 -->
      <div class="relative group">
        <div v-if="post.architecture" class="inline-flex items-center gap-2 bg-amber-900/30 text-amber-400 px-3 py-1 rounded-full border border-amber-800/50">
          <span>🏛️</span>
          <span>{{ post.architecture.name }}</span>
          <button @click="removeArchitecture" class="hover:text-amber-200 ml-1">×</button>
        </div>

        <div v-else class="relative">
          <input 
            v-model="searchKeyword"
            @input="handleSearch"
            type="text" 
            placeholder="搜索关联古建（如：应县木塔）..." 
            class="w-full bg-stone-800/50 border border-stone-700 rounded-lg px-4 py-2 focus:border-amber-700 focus:outline-none transition-colors"
          />
          
          <!-- 搜索结果下拉 -->
          <ul v-if="searchResults.length > 0" class="absolute z-50 w-full mt-1 bg-stone-800 border border-stone-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
            <li 
              v-for="arch in searchResults" 
              :key="arch.id"
              @click="selectArchitecture(arch)"
              class="px-4 py-2 hover:bg-stone-700 cursor-pointer flex justify-between items-center"
            >
              <span>{{ arch.name }}</span>
              <span class="text-xs text-stone-500">{{ arch.era }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- 编辑器区域容器 -->
      <div v-if="editor" class="border border-stone-700 rounded-xl bg-stone-900/50 transition-all focus-within:border-amber-700/80 focus-within:ring-1 focus-within:ring-amber-700/50 overflow-hidden">
        
        <!-- 编辑器工具栏 -->
        <div class="flex flex-wrap gap-2 p-3 bg-stone-800/50 border-b border-stone-700/50 backdrop-blur sticky top-0 z-10">
          <button 
            @click="editor.chain().focus().toggleBold().run()" 
            :class="{ 'bg-amber-900/40 text-amber-400': editor.isActive('bold'), 'hover:bg-stone-700 text-stone-400': !editor.isActive('bold') }" 
            class="p-2 rounded transition-colors" 
            title="加粗"
          >
            <b>B</b>
          </button>
          <button 
            @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" 
            :class="{ 'bg-amber-900/40 text-amber-400': editor.isActive('heading', { level: 2 }), 'hover:bg-stone-700 text-stone-400': !editor.isActive('heading', { level: 2 }) }" 
            class="p-2 rounded transition-colors" 
            title="H2"
          >
            H2
          </button>
          <button 
            @click="editor.chain().focus().toggleBulletList().run()" 
            :class="{ 'bg-amber-900/40 text-amber-400': editor.isActive('bulletList'), 'hover:bg-stone-700 text-stone-400': !editor.isActive('bulletList') }" 
            class="p-2 rounded transition-colors" 
            title="列表"
          >
            • List
          </button>
          <button 
            @click="editor.chain().focus().toggleBlockquote().run()" 
            :class="{ 'bg-amber-900/40 text-amber-400': editor.isActive('blockquote'), 'hover:bg-stone-700 text-stone-400': !editor.isActive('blockquote') }" 
            class="p-2 rounded transition-colors" 
            title="引用"
          >
            ""
          </button>
          <label class="p-2 rounded hover:bg-stone-700 text-stone-400 cursor-pointer transition-colors" title="插入图片">
            IMG
            <input type="file" class="hidden" accept="image/*" @change="handleImageUpload" />
          </label>
        </div>

        <!-- 编辑器内容区 -->
        <editor-content 
          :editor="editor" 
          class="min-h-[500px] p-6 bg-transparent prose prose-invert prose-stone max-w-none focus:outline-none"
        />
      </div>

      <!-- 底部操作栏 -->
      <div class="flex justify-end gap-4 pt-4 border-t border-stone-800">
        <button @click="router.back()" class="px-6 py-2 rounded-lg hover:bg-stone-800 text-stone-400">取消</button>
        <button 
          @click="submitPost" 
          :disabled="isSubmitting"
          class="px-6 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <span v-if="isSubmitting" class="animate-spin">⌛</span>
          {{ isEditMode ? '更新文章' : '发布文章' }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import ImageExtension from '@tiptap/extension-image'

const route = useRoute()
const router = useRouter()
const isEditMode = computed(() => !!route.query.id)
const isSubmitting = ref(false)

// 表单数据
const post = reactive({
  title: '',
  content: '',
  architecture: null
})

// 搜索相关
const searchKeyword = ref('')
const searchResults = ref([])
let searchTimeout = null

// 初始化编辑器
const editor = useEditor({
  content: '',
  extensions: [
    StarterKit,
    ImageExtension.configure({
      inline: true,
      allowBase64: true,
    })
  ],
  editorProps: {
    attributes: {
      class: 'focus:outline-none min-h-[400px]',
    },
  },
  onUpdate: ({ editor }) => {
    post.content = editor.getHTML()
  }
})

// 获取详情（编辑模式）
onMounted(async () => {
  if (isEditMode.value) {
    try {
      const data = await $fetch(`/api/posts/${route.query.id}`)
      post.title = data.title
      post.content = data.content
      editor.value?.commands.setContent(data.content)
      
      if (data.architecture_id) {
        try {
          const archRes = await $fetch('/api/map/detail', { params: { id: data.architecture_id } })
          if (archRes && archRes.data) {
            post.architecture = archRes.data
          }
        } catch (e) {
          console.error('Failed to fetch architecture details', e)
        }
      }
    } catch (e) {
      console.error('Failed to load post', e)
    }
  }
})

// 搜索古建
const handleSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  
  if (!searchKeyword.value.trim()) {
    searchResults.value = []
    return
  }

  searchTimeout = setTimeout(async () => {
    try {
      const results = await $fetch('/api/architectures/search', {
        params: { keyword: searchKeyword.value }
      })
      searchResults.value = results
    } catch (e) {
      console.error('Search failed', e)
    }
  }, 300)
}

const selectArchitecture = (arch) => {
  post.architecture = arch
  searchKeyword.value = ''
  searchResults.value = []
}

const removeArchitecture = () => {
  post.architecture = null
}

// 图片上传
const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)

  try {
    const { url } = await $fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    
    if (url && editor.value) {
      editor.value.chain().focus().setImage({ src: url }).run()
    }
  } catch (e) {
    alert('图片上传失败')
    console.error(e)
  }
}

// 提交
const submitPost = async () => {
  if (!post.title.trim()) return alert('请输入标题')
  if (editor.value.isEmpty) return alert('请输入内容')

  isSubmitting.value = true
  
  try {
    const payload = {
      title: post.title,
      content: post.content,
      architecture_id: post.architecture?.id,
      cover_url: null, // 可以从内容中提取第一张图作为封面
      is_featured: false
    }

    // 尝试从内容提取第一张图片作为封面
    const imgMatch = post.content.match(/<img[^>]+src="([^">]+)"/)
    if (imgMatch) {
      payload.cover_url = imgMatch[1]
    }

    if (isEditMode.value) {
      await $fetch(`/api/posts/${route.query.id}`, {
        method: 'PUT',
        body: payload
      })
    } else {
      await $fetch('/api/posts', {
        method: 'POST',
        body: payload
      })
    }
    
    router.push('/community') // 假设发布后跳转到社区列表
  } catch (e) {
    alert('发布失败：' + e.message)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* Tiptap 基础样式 */
:deep(.ProseMirror) {
  min-height: 400px;
  outline: none;
}
:deep(.ProseMirror p.is-editor-empty:first-child::before) {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}
</style>
