<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/authStore'

definePageMeta({
  layout: 'blank'
})

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const errorMsg = ref('')
const isLoading = ref(false)
const showPassword = ref(false)

// 如果已经登录，直接跳走
onMounted(() => {
  if (authStore.isLoggedIn) {
    router.replace('/profile')
  }
})

async function handleLogin() {
  errorMsg.value = ''

  if (!username.value.trim()) {
    errorMsg.value = '请输入用户名'
    return
  }
  if (!password.value) {
    errorMsg.value = '请输入密码'
    return
  }

  isLoading.value = true

  try {
    await authStore.login(username.value.trim(), password.value)
    // 登录成功，跳转
    router.push('/profile')
  } catch (err) {
    errorMsg.value = err?.data?.statusMessage || err?.statusMessage || '登录失败，请重试'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <!-- 全屏登录页 -->
  <div class="fixed inset-0 z-[60] flex items-center justify-center min-h-screen bg-bg-base overflow-hidden">

    <!-- 背景装饰 -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <!-- 纹理 -->
      <div class="absolute inset-0 opacity-[0.03]"
        style="background-image: url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'1\'/%3E%3C/svg%3E');">
      </div>

      <!-- 暖色光晕 - 左上 -->
      <div class="absolute -top-32 -left-32 w-96 h-96 bg-amber-900/10 rounded-full blur-[120px] animate-pulse-slow"></div>
      <!-- 冷色光晕 - 右下 -->
      <div class="absolute -bottom-32 -right-32 w-80 h-80 bg-red-900/8 rounded-full blur-[100px] animate-pulse-slow" style="animation-delay: 2s;"></div>
      <!-- 中心微光 -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-bg-elevated/20 rounded-full blur-[150px]"></div>

      <!-- 装饰线条 -->
      <div class="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-stone-700/10 to-transparent"></div>
      <div class="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-stone-700/10 to-transparent"></div>
    </div>

    <!-- 登录卡片 -->
    <div class="relative z-10 w-full max-w-md mx-4">

      <!-- 品牌标识区域 -->
      <div class="text-center mb-12">
        <!-- 印章图标 -->
        <div class="inline-flex items-center justify-center w-16 h-16 bg-red-800/90 rounded-sm border border-red-700/60 shadow-[0_0_30px_rgba(185,28,28,0.4)] mb-6 hover:scale-105 transition-transform duration-700">
          <span class="text-white font-serif text-2xl font-bold">卯</span>
        </div>

        <h1 class="text-4xl font-serif font-medium text-text-primary tracking-[0.25em] mb-3">
          榫卯流年
        </h1>
        <p class="text-text-muted text-sm tracking-widest font-light">
          一凹一凸 · 阴阳咬合
        </p>
      </div>

      <!-- 表单卡片 -->
      <div class="relative bg-bg-surface/60 backdrop-blur-xl border border-border-subtle/30 rounded-2xl p-8 md:p-10 shadow-2xl shadow-black/30">

        <!-- 卡片顶部装饰线 -->
        <div class="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-amber-800/40 to-transparent"></div>

        <!-- 标题 -->
        <h2 class="text-xl font-serif text-text-primary tracking-wider mb-8 text-center">
          登录
        </h2>

        <!-- 错误提示 -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          leave-active-class="transition-all duration-200 ease-in"
          enter-from-class="opacity-0 -translate-y-2 scale-95"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 -translate-y-1 scale-95"
        >
          <div v-if="errorMsg" class="mb-6 px-4 py-3 bg-red-950/50 border border-red-800/40 rounded-lg flex items-center gap-3">
            <svg class="w-5 h-5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>
            </svg>
            <span class="text-red-300 text-sm tracking-wide">{{ errorMsg }}</span>
          </div>
        </Transition>

        <!-- 表单 -->
        <form @submit.prevent="handleLogin" class="space-y-6">

          <!-- 用户名 -->
          <div class="group">
            <label for="login-username" class="block text-xs text-text-secondary tracking-widest uppercase mb-2 font-light">
              用户名
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-amber-600/70 transition-colors duration-300">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
                </svg>
              </div>
              <input
                id="login-username"
                v-model="username"
                type="text"
                autocomplete="username"
                placeholder="请输入用户名"
                class="w-full pl-12 pr-4 py-3.5 bg-bg-elevated/50 border border-border-subtle/40 rounded-xl text-text-primary placeholder-stone-600 text-sm tracking-wide
                       focus:outline-none focus:border-amber-800/50 focus:bg-bg-elevated/70 focus:ring-1 focus:ring-amber-900/30
                       transition-all duration-300"
              />
            </div>
          </div>

          <!-- 密码 -->
          <div class="group">
            <label for="login-password" class="block text-xs text-text-secondary tracking-widest uppercase mb-2 font-light">
              密码
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-amber-600/70 transition-colors duration-300">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
                </svg>
              </div>
              <input
                id="login-password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="请输入密码"
                class="w-full pl-12 pr-12 py-3.5 bg-bg-elevated/50 border border-border-subtle/40 rounded-xl text-text-primary placeholder-stone-600 text-sm tracking-wide
                       focus:outline-none focus:border-amber-800/50 focus:bg-bg-elevated/70 focus:ring-1 focus:ring-amber-900/30
                       transition-all duration-300"
              />
              <!-- 密码可见切换 -->
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-4 flex items-center text-text-muted hover:text-text-secondary transition-colors duration-300"
                @click="showPassword = !showPassword"
              >
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- 登录按钮 -->
          <button
            id="login-submit"
            type="submit"
            :disabled="isLoading"
            class="relative w-full py-3.5 mt-2 bg-gradient-to-r from-red-900/80 via-red-800/80 to-red-900/80 text-text-primary font-serif text-base tracking-[0.2em] rounded-xl
                   border border-red-700/30
                   hover:from-red-800/90 hover:via-red-700/90 hover:to-red-800/90 hover:border-red-600/40 hover:shadow-[0_0_25px_rgba(185,28,28,0.2)]
                   active:scale-[0.98]
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none
                   transition-all duration-500 ease-out
                   overflow-hidden group"
          >
            <!-- 按钮光效 -->
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

            <span v-if="!isLoading" class="relative z-10">登 录</span>
            <span v-else class="relative z-10 flex items-center justify-center gap-2">
              <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
              </svg>
              <span>登录中...</span>
            </span>
          </button>
        </form>

        <!-- 底部装饰线 -->
        <div class="mt-8 pt-6 border-t border-border-default/40 text-center">
          <p class="text-text-muted text-xs tracking-wider font-light">
            不用一钉一铆，让木头与木头对话
          </p>
        </div>
      </div>

      <!-- 返回首页 -->
      <div class="text-center mt-8">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 text-text-muted hover:text-text-secondary text-sm tracking-wider transition-colors duration-300 group"
        >
          <svg class="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/>
          </svg>
          <span>返回首页</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes pulse-slow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.animate-pulse-slow {
  animation: pulse-slow 6s ease-in-out infinite;
}
</style>
