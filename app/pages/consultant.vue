<script setup>
import { ref, nextTick, onMounted, watch } from 'vue'
import MarkdownIt from 'markdown-it'

// Markdown 配置
const md = new MarkdownIt({
  html: false,
  breaks: true,
  linkify: true
})

const renderMarkdown = (text) => {
  return md.render(text)
}

// 状态管理
const messages = ref([
  {
    role: 'assistant',
    content: '小友你好，老朽乃营造大师。关于榫卯、古建，但问无妨。若有不明之处，老朽定当知无不言。'
  }
])
const input = ref('')
const loading = ref(false)
const messagesContainer = ref(null)

// 路由
const route = useRoute()

// 锦囊（快捷提问）
const quickQuestions = [
  '什么是斗拱？',
  '燕尾榫的原理',
  '《营造法式》讲了什么？'
]

// 自动滚动到底部
const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 监听消息变化，自动滚动
watch(messages, scrollToBottom, { deep: true })

// 发送消息（流式）
const sendMessage = async (text = null) => {
  const content = typeof text === 'string' ? text : input.value.trim()
  if (!content || loading.value) return

  // 如果是点击锦囊，不清除输入框；如果是手动输入，清除输入框
  if (typeof text !== 'string') {
    input.value = ''
  }

  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: content
  })

  loading.value = true
  
  // 创建一个新的助理消息占位
  const assistantMsgIndex = messages.value.push({
    role: 'assistant',
    content: ''
  }) - 1

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: messages.value.slice(0, -1) // 不包含刚才添加的空消息
      })
    })

    if (!response.ok) {
      throw new Error('API Request Failed')
    }

    // 处理流式响应
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let done = false

    while (!done) {
      const { value, done: readerDone } = await reader.read()
      done = readerDone
      
      if (value) {
        const chunk = decoder.decode(value, { stream: true })
        // 解析 SSE 格式数据
        // 数据格式通常是: data: {...}\n\n
        const lines = chunk.split('\n')
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6)
            if (dataStr === '[DONE]') continue
            
            try {
              const data = JSON.parse(dataStr)
              if (data.choices && data.choices[0].delta && data.choices[0].delta.content) {
                messages.value[assistantMsgIndex].content += data.choices[0].delta.content
                // 实时滚动
                scrollToBottom()
              }
            } catch (e) {
              // 忽略解析错误（可能是数据包不完整）
            }
          }
        }
      }
    }

  } catch (error) {
    console.error('Chat error:', error)
    messages.value[assistantMsgIndex].content = '老朽此时思绪杂乱，请小友稍后再试。'
  } finally {
    loading.value = false
    scrollToBottom()
  }
}

// 初始化时滚动到底部，并检查是否有 query 参数
onMounted(() => {
  scrollToBottom()

  // 如果有 query.q，则自动填入并发送
  const queryQ = route.query.q
  if (queryQ) {
    // 显示过渡状态
    const tempMsg = {
      role: 'assistant',
      content: '大师正在听取你的疑惑...'
    }
    messages.value.push(tempMsg)
    
    // 稍微延迟一下，让用户看到“营造大师”已经准备好了
    setTimeout(() => {
      // 移除临时提示
      messages.value.pop()
      // 正式发送
      sendMessage(queryQ)
    }, 800)
  }
})
</script>

<template>
  <div class="flex flex-col h-screen bg-[#0a0a0a] text-stone-200 font-sans overflow-hidden pt-20">
    <!-- 顶部标题栏 -->
    <header class="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-[#0a0a0a]/90 backdrop-blur-sm z-10">
      <div class="flex items-center gap-4">
        <!-- 头像 -->
        <div class="w-10 h-10 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center shrink-0 overflow-hidden">
          <span class="text-amber-600 font-serif text-lg">营</span>
        </div>
        <div>
          <h1 class="text-lg font-serif font-bold text-stone-100">营造大师</h1>
          <p class="text-xs text-stone-500">博古通今 · 榫卯专家</p>
        </div>
      </div>
      
      <!-- 快捷功能区（引导反哺）已移动到底部 -->
    </header>

    <!-- 消息区域 -->
    <main class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth" ref="messagesContainer">
      <div v-for="(msg, index) in messages" :key="index" 
        class="flex w-full" 
        :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
      >
        <!-- 大师消息 -->
        <div v-if="msg.role === 'assistant'" class="flex items-start gap-3 max-w-[85%] sm:max-w-[75%]">
          <div class="w-8 h-8 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center shrink-0 mt-1">
            <span class="text-amber-600 font-serif text-sm">营</span>
          </div>
          <div class="bg-stone-900 border border-stone-800 rounded-2xl rounded-tl-none px-4 py-3 text-stone-200 shadow-sm leading-relaxed overflow-hidden">
            <!-- Markdown 渲染 -->
             <div 
              v-if="msg.content"
              class="prose prose-invert prose-amber max-w-none prose-p:my-1 prose-headings:text-amber-500 prose-a:text-amber-400 prose-strong:text-amber-200 prose-code:text-amber-300 prose-pre:bg-stone-950 prose-pre:border prose-pre:border-stone-800 text-sm sm:text-base"
              v-html="renderMarkdown(msg.content)"
            ></div>
            <!-- 加载光标 (当内容为空且正在加载时显示) -->
            <div v-else-if="loading && index === messages.length - 1" class="flex items-center gap-1 h-6">
               <span class="w-2 h-2 rounded-full bg-amber-500/50 animate-pulse"></span>
            </div>
          </div>
        </div>

        <!-- 用户消息 -->
        <div v-else class="flex items-start gap-3 max-w-[85%] sm:max-w-[75%] flex-row-reverse">
          <div class="w-8 h-8 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center shrink-0 mt-1">
            <span class="text-stone-400 font-serif text-sm">友</span>
          </div>
          <div class="bg-stone-800 border border-stone-700 rounded-2xl rounded-tr-none px-4 py-3 text-amber-500 shadow-sm leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
            {{ msg.content }}
          </div>
        </div>
      </div>

      <!-- 底部占位，防止内容被输入框遮挡 -->
      <div class="h-2"></div>
    </main>

    <!-- 输入区域 -->
    <footer class="p-4 sm:p-6 bg-[#0a0a0a] border-t border-stone-800">
      <div class="max-w-4xl mx-auto">
        <!-- 锦囊（快捷提问）与 引导反哺 -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <!-- 左侧：锦囊 -->
          <div class="flex flex-wrap gap-3">
            <button 
              v-for="q in quickQuestions" 
              :key="q"
              @click="sendMessage(q)"
              :disabled="loading"
              class="px-3 py-1.5 rounded-lg border border-amber-900/40 bg-amber-950/20 text-amber-600 text-xs sm:text-sm hover:bg-amber-900/30 hover:border-amber-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ q }}
            </button>
          </div>

          <!-- 右侧：导航入口 -->
          <div class="flex items-center gap-2 shrink-0">
            <NuxtLink 
              to="/map"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-900/40 bg-amber-950/20 text-amber-500 hover:bg-amber-900/30 hover:border-amber-700/50 transition-colors text-xs"
              title="前往流年地图"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <span>流年地图</span>
            </NuxtLink>
            <NuxtLink 
              to="/community"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-900/40 bg-amber-950/20 text-amber-500 hover:bg-amber-900/30 hover:border-amber-700/50 transition-colors text-xs"
              title="浏览营造社区"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>营造社区</span>
            </NuxtLink>
          </div>
        </div>

        <div class="relative flex gap-3 items-end">
          <textarea
            v-model="input"
            @keydown.enter.prevent="sendMessage()"
            placeholder="请问大师..."
            rows="1"
            class="w-full bg-stone-900 text-stone-200 rounded-xl border border-stone-800 px-4 py-3 focus:outline-none focus:border-amber-900/50 focus:ring-1 focus:ring-amber-900/50 resize-none min-h-[48px] max-h-32 scrollbar-hide"
            style="field-sizing: content;"
          ></textarea>
          
          <button 
            @click="sendMessage()" 
            :disabled="!input.trim() || loading"
            class="h-12 w-12 flex items-center justify-center rounded-xl bg-amber-900/20 text-amber-600 hover:bg-amber-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0 border border-amber-900/30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background-color: #292524;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #44403c;
}

/* 隐藏输入框滚动条但保留功能 */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Prose 自定义样式修复 */
:deep(.prose) {
  font-size: 0.95rem;
  line-height: 1.6;
}
:deep(.prose p) {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}
:deep(.prose ul) {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  padding-left: 1.5em;
  list-style-type: disc;
}
:deep(.prose li) {
  margin-top: 0.25em;
  margin-bottom: 0.25em;
}
:deep(.prose strong) {
  font-weight: 600;
  color: #fbbf24; /* amber-400 */
}
</style>
