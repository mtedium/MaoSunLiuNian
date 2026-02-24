<script setup>
import { ref, computed, onMounted, watch, onActivated } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

// 状态
const activeTab = ref('achievements') // 'achievements', 'posts', 'collections'
const stats = ref(null)
const litArchitectures = ref([])

// 获取统计数据
const { data: statsData, error, refresh } = await useFetch('/api/user/stats', {
    immediate: false, 
    headers: computed(() => ({
        Authorization: `Bearer ${authStore.token}`
    })),
    // 移除 watch，因为我们在 onMounted 和 initData 中手动控制了
})

// 用户发布的文章
const { data: postsData, refresh: refreshPosts } = await useFetch('/api/user/posts', {
    immediate: false,
    headers: computed(() => ({
        Authorization: `Bearer ${authStore.token}`
    }))
})

// 用户收藏
const { data: collectionsData, refresh: refreshCollections } = await useFetch('/api/user/collections', {
    immediate: false,
    headers: computed(() => ({
        Authorization: `Bearer ${authStore.token}`
    }))
})

const initData = async () => {
    // 确保有 token 再发起请求
    if (authStore.token) {
        try {
            await Promise.all([
                refresh(),
                refreshPosts(),
                refreshCollections()
            ])
        } catch (e) {
            console.error('Failed to load profile data:', e)
        }
    }
}

onMounted(async () => {
    if (import.meta.client) {
        // 如果未登录，尝试恢复
        if (!authStore.isLoggedIn) {
            await authStore.restore()
        }
        
        // 恢复后仍未登录，跳转
        if (!authStore.isLoggedIn) {
            router.push('/login')
            return
        }

        // 登录成功后，发起数据请求
        await initData()
    }
})

onActivated(async () => {
    // 每次进入页面时刷新数据，确保从编辑页返回时数据是最新的
    if (authStore.isLoggedIn) {
        await initData()
    }
})

// 删除文章
async function handleDeletePost(id) {
    if (!confirm('确定要删除这篇文章吗？此操作不可恢复。')) return

    try {
        await $fetch(`/api/posts/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${authStore.token}` }
        })
        await refreshPosts() // 刷新列表
        await refresh() // 刷新统计数据
    } catch (error) {
        alert('删除失败：' + (error.data?.statusMessage || error.message))
    }
}

// 监听数据变化
watch(statsData, (newData) => {
    if (newData) {
        stats.value = newData.data.stats
        litArchitectures.value = newData.data.litArchitectures
    }
})

// 称号计算逻辑
const title = computed(() => {
    const count = stats.value?.litCount || 0
    if (count > 10) return '大木作匠师'
    if (count > 5) return '营造学社社员'
    return '木艺学徒'
})

// 地图投影逻辑
// 中国大致范围：经度 73-135，纬度 18-54
const MAP_WIDTH = 800
const MAP_HEIGHT = 600
const MIN_LNG = 73
const MAX_LNG = 135
const MIN_LAT = 18
const MAX_LAT = 54

function project(lng, lat) {
    const x = ((lng - MIN_LNG) / (MAX_LNG - MIN_LNG)) * MAP_WIDTH
    const y = ((MAX_LAT - lat) / (MAX_LAT - MIN_LAT)) * MAP_HEIGHT
    return { x, y }
}

// 简化的中国地图 SVG Path (示意图)
const chinaMapPath = "M 220 180 L 280 150 L 350 140 L 450 120 L 550 80 L 620 60 L 680 80 L 720 120 L 700 180 L 680 250 L 650 300 L 600 350 L 550 400 L 480 420 L 420 450 L 350 420 L 300 380 L 250 350 L 200 300 L 180 250 Z"

const showEditProfile = ref(false)
const uploading = ref(false)
const saving = ref(false)
const editForm = ref({
    nickname: '',
    avatar: ''
})

// 打开编辑弹窗
function openEditProfile() {
    editForm.value = {
        nickname: authStore.user?.nickname || '',
        avatar: authStore.user?.avatar || ''
    }
    showEditProfile.value = true
}

// 关闭编辑弹窗
function closeEditProfile() {
    showEditProfile.value = false
    uploading.value = false
    saving.value = false
}

// 处理头像上传
async function handleAvatarUpload(event) {
    const file = event.target.files[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
        alert('图片大小不能超过 2MB')
        return
    }

    uploading.value = true
    const formData = new FormData()
    formData.append('file', file)

    try {
        const res = await $fetch('/api/upload', {
            method: 'POST',
            body: formData,
            headers: { Authorization: `Bearer ${authStore.token}` }
        })
        editForm.value.avatar = res.url
    } catch (e) {
        alert('上传失败：' + (e.data?.message || e.message))
    } finally {
        uploading.value = false
    }
}

// 保存个人资料
async function saveProfile() {
    if (!editForm.value.nickname.trim()) {
        alert('昵称不能为空')
        return
    }

    saving.value = true
    try {
        // 更新用户信息
        await $fetch(`/api/user/profile`, {
            method: 'PUT',
            body: editForm.value,
            headers: { Authorization: `Bearer ${authStore.token}` }
        })
        
        // 刷新本地用户状态
        await authStore.restore() // 或者手动更新 store 中的 user 对象
        closeEditProfile()
        alert('修改成功')
    } catch (e) {
        alert('保存失败：' + (e.data?.message || e.message))
    } finally {
        saving.value = false
    }
}

// 退出登录
function handleLogout() {
    authStore.logout()
    router.push('/login')
}
</script>

<template>
    <div class="min-h-screen bg-stone-950 text-stone-300 font-serif flex pt-20">
        <!-- 左侧导航 -->
        <aside class="w-64 border-r border-stone-800 p-6 flex flex-col bg-stone-900/50 backdrop-blur-sm fixed top-20 bottom-0 left-0 z-40">
            <!-- 用户信息 -->
            <div class="mb-10 text-center">
                <!-- 头像区域 -->
                <div class="w-20 h-20 mx-auto bg-stone-800 rounded-full flex items-center justify-center border-2 border-amber-900/50 mb-4 overflow-hidden relative group cursor-pointer" @click="openEditProfile">
                    <img v-if="authStore.user?.avatar" :src="authStore.user.avatar" alt="Avatar" class="w-full h-full object-cover">
                    <span v-else class="text-3xl text-stone-600">{{ authStore.displayName[0] }}</span>
                    <div class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span class="text-xs text-white">更换</span>
                    </div>
                </div>

                <h2 class="text-xl font-bold text-stone-100 mb-1 relative group cursor-pointer flex items-center justify-center gap-2" @click="openEditProfile">
                    {{ authStore.displayName }}
                    <span class="opacity-0 group-hover:opacity-100 transition-opacity text-stone-500 text-xs">✏️</span>
                </h2>
                
                <div class="inline-block px-3 py-1 bg-stone-800 rounded-full border border-stone-700 mt-2 cursor-help group relative">
                    <span class="text-xs text-amber-500 font-bold tracking-wider">{{ title }}</span>
                    <!-- 称号说明 Tooltip -->
                    <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-stone-900 border border-stone-700 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                        <div class="text-[10px] text-stone-400 text-left space-y-1">
                            <p><span class="text-amber-500">大木作匠师</span>：点亮 > 10 处</p>
                            <p><span class="text-stone-300">营造学社社员</span>：点亮 > 5 处</p>
                            <p><span class="text-stone-500">木艺学徒</span>：初始等级</p>
                        </div>
                        <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-stone-700"></div>
                    </div>
                </div>
                <p class="text-xs text-stone-500 mt-3">加入时间：{{ authStore.user?.created_at ? new Date(authStore.user.created_at).toLocaleDateString() : '未知' }}</p>
            </div>

            <!-- 导航菜单 -->
            <nav class="flex-1 space-y-2">
                <button 
                    @click="activeTab = 'achievements'"
                    :class="['w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center gap-3', activeTab === 'achievements' ? 'bg-stone-800 text-amber-500 border-l-4 border-amber-600' : 'hover:bg-stone-800/50 text-stone-400']"
                >
                    <span class="text-lg">🏆</span> 成就概览
                </button>
                <button 
                    @click="activeTab = 'posts'"
                    :class="['w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center gap-3', activeTab === 'posts' ? 'bg-stone-800 text-amber-500 border-l-4 border-amber-600' : 'hover:bg-stone-800/50 text-stone-400']"
                >
                    <span class="text-lg">📝</span> 我的发布
                </button>
                <button 
                    @click="activeTab = 'collections'"
                    :class="['w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center gap-3', activeTab === 'collections' ? 'bg-stone-800 text-amber-500 border-l-4 border-amber-600' : 'hover:bg-stone-800/50 text-stone-400']"
                >
                    <span class="text-lg">🔖</span> 我的收藏
                </button>
            </nav>

            <!-- 底部操作 -->
            <div class="mt-auto pt-6 border-t border-stone-800 space-y-2">
                <NuxtLink to="/" class="w-full px-4 py-2 text-stone-500 hover:text-amber-500 transition-colors flex items-center gap-2 justify-center rounded-lg hover:bg-stone-800/50">
                    <span class="text-lg">🌏</span> 
                    <span class="font-bold">返回地图</span>
                </NuxtLink>
                <NuxtLink 
                    v-if="authStore.user && authStore.user.role === 'admin'"
                    to="/admin"
                    class="w-full px-4 py-2 text-amber-500 hover:bg-stone-800 transition-colors flex items-center gap-2 justify-center rounded-lg border border-amber-900/30 group"
                >
                    <span class="text-lg group-hover:rotate-45 transition-transform duration-300">⚒️</span> 
                    <span class="font-bold">营造司控制台</span>
                </NuxtLink>
                <button @click="handleLogout" class="w-full px-4 py-2 text-stone-500 hover:text-red-400 transition-colors flex items-center gap-2 justify-center rounded-lg hover:bg-stone-800/50">
                    <span class="text-lg">🚪</span> 
                    <span class="font-bold">退出登录</span>
                </button>
            </div>
        </aside>

        <!-- 右侧内容区 -->
        <main class="flex-1 p-8 overflow-y-auto bg-stone-950 relative ml-64 h-[calc(100vh-80px)]">
            <!-- 背景装饰 -->
            <div class="absolute inset-0 bg-[url('/img/noise.png')] opacity-5 pointer-events-none"></div>

            <div v-if="activeTab === 'achievements'" class="max-w-5xl mx-auto space-y-8 animate-fade-in">
                <!-- 顶部标题 -->
                <div class="flex items-center justify-between mb-6">
                    <h1 class="text-3xl font-bold text-stone-100">成就概览</h1>
                    <div class="text-stone-500 text-sm">数据更新于刚刚</div>
                </div>

                <!-- 核心数据卡片 -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="bg-stone-900/80 p-6 rounded-xl border border-stone-800 backdrop-blur hover:border-amber-900/30 transition-all group">
                        <div class="text-stone-500 text-sm mb-2 group-hover:text-amber-500/80">已点亮古建</div>
                        <div class="text-4xl font-bold text-amber-500">{{ stats?.litCount || 0 }} <span class="text-base text-stone-600 font-normal">处</span></div>
                    </div>
                    <div class="bg-stone-900/80 p-6 rounded-xl border border-stone-800 backdrop-blur hover:border-amber-900/30 transition-all group">
                        <div class="text-stone-500 text-sm mb-2 group-hover:text-amber-500/80">累计发布文章</div>
                        <div class="text-4xl font-bold text-stone-200">{{ stats?.postCount || 0 }} <span class="text-base text-stone-600 font-normal">篇</span></div>
                    </div>
                    <div class="bg-stone-900/80 p-6 rounded-xl border border-stone-800 backdrop-blur hover:border-amber-900/30 transition-all group relative">
                        <div class="text-stone-500 text-sm mb-2 group-hover:text-amber-500/80">获赞总数</div>
                        <div class="text-4xl font-bold text-stone-200">{{ stats?.likeCount || 0 }} <span class="text-base text-stone-600 font-normal">次</span></div>
                        <div class="absolute bottom-4 right-4 text-stone-500/30 text-[10px]">延迟更新</div>
                    </div>
                </div>

                <!-- 发光地图组件 -->
                <div class="bg-stone-900 rounded-2xl border border-stone-800 p-8 relative overflow-hidden shadow-2xl shadow-black/50">
                    <div class="absolute inset-0 bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 opacity-90"></div>
                    <h3 class="relative z-10 text-xl font-bold text-stone-300 mb-6 flex items-center gap-2">
                        <span class="w-2 h-8 bg-amber-600 rounded-sm"></span>
                        足迹点亮地图
                    </h3>
                    
                    <div class="relative z-10 w-full aspect-[4/3] flex items-center justify-center">
                        <svg :viewBox="`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`" class="w-full h-full max-w-4xl drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                            <!-- 地图底图 -->
                            <path :d="chinaMapPath" class="fill-stone-800 stroke-stone-700 stroke-[1.5]" />
                            
                            <!-- 装饰性网格线 -->
                            <defs>
                                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grid)" />

                            <!-- 点亮坐标点 -->
                            <g v-for="arch in litArchitectures" :key="arch.id">
                                <!-- 呼吸光晕 -->
                                <circle 
                                    :cx="project(arch.lng, arch.lat).x" 
                                    :cy="project(arch.lng, arch.lat).y" 
                                    r="8" 
                                    class="fill-amber-500/30 animate-ping origin-center" 
                                    style="animation-duration: 3s;"
                                />
                                <!-- 核心亮点 -->
                                <circle 
                                    :cx="project(arch.lng, arch.lat).x" 
                                    :cy="project(arch.lng, arch.lat).y" 
                                    r="3" 
                                    class="fill-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                                />
                                <!-- 标签 (Hover 显示) -->
                                <text 
                                    :x="project(arch.lng, arch.lat).x" 
                                    :y="project(arch.lng, arch.lat).y - 12" 
                                    text-anchor="middle" 
                                    class="text-[10px] fill-stone-400 opacity-0 hover:opacity-100 transition-opacity cursor-pointer select-none"
                                >
                                    {{ arch.name }}
                                </text>
                            </g>
                        </svg>
                    </div>
                </div>
            </div>

            <div v-else-if="activeTab === 'posts'" class="animate-fade-in">
                <h1 class="text-3xl font-bold text-stone-100 mb-8">我的发布</h1>
                
                <div v-if="postsData?.data?.length > 0" class="bg-stone-900 rounded-xl border border-stone-800 overflow-hidden">
                    <table class="w-full text-left">
                        <thead class="bg-stone-950/50 text-stone-500 uppercase text-xs tracking-wider font-medium">
                            <tr>
                                <th class="px-6 py-4">文章标题</th>
                                <th class="px-6 py-4">关联古建</th>
                                <th class="px-6 py-4">发布时间</th>
                                <th class="px-6 py-4 text-center">点赞</th>
                                <th class="px-6 py-4 text-right">操作</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-stone-800">
                            <tr v-for="post in postsData.data" :key="post.id" class="group hover:bg-stone-800/30 transition-colors">
                                <td class="px-6 py-4">
                                    <NuxtLink :to="`/community/post/${post.id}`" class="text-stone-300 font-bold hover:text-amber-500 transition-colors">
                                        {{ post.title }}
                                    </NuxtLink>
                                    <div v-if="post.is_featured" class="inline-block ml-2 px-2 py-0.5 text-[10px] bg-amber-900/50 text-amber-500 rounded border border-amber-900/50">置顶</div>
                                </td>
                                <td class="px-6 py-4 text-stone-400">{{ post.architecture_name || '-' }}</td>
                                <td class="px-6 py-4 text-stone-500 text-sm">{{ new Date(post.created_at).toLocaleDateString() }}</td>
                                <td class="px-6 py-4 text-center text-stone-400">{{ post.likes }}</td>
                                <td class="px-6 py-4 text-right space-x-3">
                                    <NuxtLink :to="`/community/edit?id=${post.id}`" class="text-stone-500 hover:text-amber-500 transition-colors text-sm">
                                        编辑
                                    </NuxtLink>
                                    <button @click="handleDeletePost(post.id)" class="text-stone-500 hover:text-red-500 transition-colors text-sm">
                                        删除
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div v-else class="bg-stone-900 p-12 rounded-xl border border-stone-800 text-center">
                    <div class="text-6xl mb-4 opacity-20">📝</div>
                    <p class="text-stone-500 mb-6">暂无发布内容</p>
                    <NuxtLink to="/community/edit" class="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-stone-100 rounded-lg transition-colors inline-block">
                        去发布一篇
                    </NuxtLink>
                </div>
            </div>

            <div v-else-if="activeTab === 'collections'" class="animate-fade-in">
                <h1 class="text-3xl font-bold text-stone-100 mb-8">我的收藏</h1>
                
                <div v-if="collectionsData?.data?.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div v-for="item in collectionsData.data" :key="item.id" class="bg-stone-900 rounded-xl border border-stone-800 overflow-hidden hover:border-amber-900/50 transition-all group">
                        <!-- 文章收藏 -->
                        <NuxtLink v-if="item.type === 'post'" :to="`/community/post/${item.detail.id}`" class="block p-6">
                            <div class="flex items-start justify-between mb-4">
                                <span class="px-2 py-1 bg-stone-800 text-stone-400 text-xs rounded border border-stone-700">文章</span>
                                <span class="text-stone-600 text-xs">{{ new Date(item.created_at).toLocaleDateString() }}</span>
                            </div>
                            <h3 class="text-lg font-bold text-stone-200 mb-2 group-hover:text-amber-500 transition-colors line-clamp-1">{{ item.detail.title }}</h3>
                            <p class="text-stone-500 text-sm line-clamp-2 mb-4">{{ item.detail.content.replace(/[#*`]/g, '').slice(0, 100) }}...</p>
                            <div class="flex items-center gap-2 text-xs text-stone-600">
                                <div class="w-5 h-5 rounded-full bg-stone-800 overflow-hidden">
                                    <img v-if="item.detail.author_avatar" :src="item.detail.author_avatar" class="w-full h-full object-cover">
                                    <div v-else class="w-full h-full flex items-center justify-center text-[10px]">{{ item.detail.author_name?.[0] }}</div>
                                </div>
                                <span>{{ item.detail.author_name }}</span>
                            </div>
                        </NuxtLink>

                        <!-- 古建收藏 -->
                        <NuxtLink v-else-if="item.type === 'architecture'" :to="`/map?id=${item.detail.id}`" class="block p-6">
                            <div class="flex items-start justify-between mb-4">
                                <span class="px-2 py-1 bg-stone-800 text-stone-400 text-xs rounded border border-stone-700">古建</span>
                                <span class="text-stone-600 text-xs">{{ new Date(item.created_at).toLocaleDateString() }}</span>
                            </div>
                            <h3 class="text-lg font-bold text-stone-200 mb-2 group-hover:text-amber-500 transition-colors">{{ item.detail.name }}</h3>
                            <div class="text-stone-500 text-sm mb-4">
                                <span class="mr-3">📍 {{ item.detail.era }}</span>
                                <span>👁️ {{ item.detail.article_count || 0 }} 篇文章</span>
                            </div>
                        </NuxtLink>
                    </div>
                </div>

                <div v-else class="bg-stone-900 p-12 rounded-xl border border-stone-800 text-center">
                    <div class="text-6xl mb-4 opacity-20">🔖</div>
                    <p class="text-stone-500">暂无收藏内容</p>
                </div>
            </div>
        </main>
    </div>

    <!-- 用户资料编辑弹窗 -->
    <div v-if="showEditProfile" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div class="bg-stone-900 w-full max-w-md rounded-xl border border-stone-800 shadow-2xl overflow-hidden animate-scale-in">
            <div class="p-6 border-b border-stone-800 flex justify-between items-center">
                <h3 class="text-xl font-bold text-stone-100">编辑个人资料</h3>
                <button @click="closeEditProfile" class="text-stone-500 hover:text-stone-300">✕</button>
            </div>
            
            <div class="p-6 space-y-6">
                <!-- 头像修改 -->
                <div class="flex flex-col items-center gap-4">
                    <div class="w-24 h-24 bg-stone-800 rounded-full flex items-center justify-center border-2 border-amber-900/50 overflow-hidden relative group">
                        <img v-if="editForm.avatar" :src="editForm.avatar" class="w-full h-full object-cover">
                        <span v-else class="text-4xl text-stone-600">{{ editForm.nickname?.[0] || authStore.user?.username?.[0] }}</span>
                        
                        <!-- 上传遮罩 -->
                        <label class="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <span class="text-xs text-stone-200 mb-1">更换头像</span>
                            <span class="text-[10px] text-stone-400">点击上传</span>
                            <input type="file" accept="image/*" class="hidden" @change="handleAvatarUpload">
                        </label>
                    </div>
                    <div v-if="uploading" class="text-xs text-amber-500 animate-pulse">正在上传...</div>
                </div>

                <!-- 昵称修改 -->
                <div class="space-y-2">
                    <label class="text-sm text-stone-400">昵称</label>
                    <input 
                        v-model="editForm.nickname" 
                        type="text" 
                        class="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-2 text-stone-200 focus:border-amber-600 outline-none transition-colors"
                        placeholder="请输入昵称"
                        maxlength="20"
                    >
                </div>
            </div>

            <div class="p-6 border-t border-stone-800 flex justify-end gap-3 bg-stone-900/50">
                <button @click="closeEditProfile" class="px-4 py-2 text-stone-400 hover:text-stone-200 transition-colors">取消</button>
                <button 
                    @click="saveProfile" 
                    :disabled="saving"
                    class="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-stone-100 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <span v-if="saving" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    {{ saving ? '保存中...' : '保存修改' }}
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.5s ease-out;
}

.animate-scale-in {
    animation: scaleIn 0.2s ease-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
}
</style>
