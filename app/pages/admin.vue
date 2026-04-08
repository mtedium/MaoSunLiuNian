<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

// 路由中间件保护
definePageMeta({
    middleware: ['admin']
})

const authStore = useAuthStore()
const router = useRouter()
const activeTab = ref('dashboard') // 'dashboard' | 'posts' | 'architectures' | 'users'

// ----------------------------------------------------------------
// 用户管理逻辑
// ----------------------------------------------------------------
const { data: users, refresh: refreshUsers } = await useFetch('/api/admin/users', {
    headers: { Authorization: `Bearer ${authStore.token}` }
})

const showCreateUser = ref(false)
const newUserForm = ref({
    username: '',
    password: '',
    nickname: '',
    role: 'user'
})

async function createUser() {
    if (!newUserForm.value.username || !newUserForm.value.password) {
        alert('用户名和密码必填')
        return
    }
    
    try {
        await $fetch('/api/admin/users', {
            method: 'POST',
            headers: { Authorization: `Bearer ${authStore.token}` },
            body: newUserForm.value
        })
        await refreshUsers()
        showCreateUser.value = false
        newUserForm.value = { username: '', password: '', nickname: '', role: 'user' }
        alert('用户创建成功')
    } catch (e) {
        alert('创建失败: ' + (e.data?.statusMessage || e.message))
    }
}

async function deleteUser(user) {
    if (user.role === 'admin') {
        alert('无法删除管理员账号')
        return
    }
    
    if (!confirm(`确定要删除用户 "${user.nickname || user.username}" 吗？此操作将一并删除其发布的文章和收藏记录，且不可恢复！`)) return
    
    try {
        await $fetch(`/api/admin/users/${user.id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${authStore.token}` }
        })
        await refreshUsers()
        alert('用户已删除')
    } catch (e) {
        alert('删除失败: ' + (e.data?.statusMessage || e.message))
    }
}

// ----------------------------------------------------------------
// 文章管理逻辑
// ----------------------------------------------------------------
const { data: posts, refresh: refreshPosts } = await useFetch('/api/admin/posts', {
    headers: { Authorization: `Bearer ${authStore.token}` }
})

async function togglePostStatus(post) {
    const newStatus = post.status === 'published' ? 'hidden' : 'published'
    const action = newStatus === 'hidden' ? '下架' : '重新上架'
    
    if (!confirm(`确定要${action}文章《${post.title}》吗？`)) return

    try {
        await $fetch(`/api/admin/posts/${post.id}`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${authStore.token}` },
            body: { status: newStatus }
        })
        await refreshPosts()
    } catch (e) {
        alert('操作失败')
    }
}

async function toggleFeatured(post) {
    try {
        await $fetch(`/api/admin/posts/${post.id}`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${authStore.token}` },
            body: { is_featured: !post.is_featured }
        })
        await refreshPosts()
    } catch (e) {
        alert('操作失败')
    }
}

// ----------------------------------------------------------------
// 古建数据校对逻辑
// ----------------------------------------------------------------
const { data: architectures, refresh: refreshArchs } = await useFetch('/api/admin/architectures', {
    headers: { Authorization: `Bearer ${authStore.token}` }
})

const editingArch = ref(null)

function startEdit(arch) {
    // 深拷贝以避免直接修改列表
    editingArch.value = JSON.parse(JSON.stringify(arch))
}

function cancelEdit() {
    editingArch.value = null
}

async function saveArch() {
    if (!editingArch.value) return

    try {
        await $fetch(`/api/admin/architectures/${editingArch.value.id}`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${authStore.token}` },
            body: editingArch.value
        })
        await refreshArchs()
        editingArch.value = null
        alert('保存成功')
    } catch (e) {
        alert('保存失败：' + e.message)
    }
}
</script>

<template>
    <div class="min-h-screen bg-bg-base text-text-secondary font-serif flex flex-col">
        <!-- 顶部导航 -->
        <header class="h-16 border-b border-border-default bg-bg-surface/80 backdrop-blur flex items-center justify-between px-8 fixed top-0 w-full z-50">
            <div class="flex items-center gap-4">
                <NuxtLink to="/profile" class="text-text-muted hover:text-text-secondary transition-colors">
                    ← 返回个人中心
                </NuxtLink>
                <h1 class="text-xl font-bold text-amber-500 flex items-center gap-2">
                    <span>⚒️</span> 营造司控制台
                </h1>
            </div>
            <div class="flex items-center gap-4 text-sm">
                <span>管理员：{{ authStore.user?.nickname }}</span>
            </div>
        </header>

        <!-- 主体内容 -->
        <div class="flex-1 pt-24 px-8 pb-12 w-full mx-auto">
            <!-- Tabs -->
            <div class="flex gap-4 mb-8 border-b border-border-default pb-1">
                <button 
                    @click="activeTab = 'dashboard'"
                    :class="['px-4 py-2 text-lg font-bold transition-colors border-b-2', activeTab === 'dashboard' ? 'text-amber-500 border-amber-500' : 'text-text-muted border-transparent hover:text-text-secondary']"
                >
                    数字大屏
                </button>
                <button 
                    @click="activeTab = 'users'"
                    :class="['px-4 py-2 text-lg font-bold transition-colors border-b-2', activeTab === 'users' ? 'text-amber-500 border-amber-500' : 'text-text-muted border-transparent hover:text-text-secondary']"
                >
                    用户账号管理
                </button>
                <button 
                    @click="activeTab = 'posts'"
                    :class="['px-4 py-2 text-lg font-bold transition-colors border-b-2', activeTab === 'posts' ? 'text-amber-500 border-amber-500' : 'text-text-muted border-transparent hover:text-text-secondary']"
                >
                    文章内容风控
                </button>
                <button 
                    @click="activeTab = 'architectures'"
                    :class="['px-4 py-2 text-lg font-bold transition-colors border-b-2', activeTab === 'architectures' ? 'text-amber-500 border-amber-500' : 'text-text-muted border-transparent hover:text-text-secondary']"
                >
                    营造数据校对
                </button>
            </div>

            <!-- 0. 数字大屏面板 -->
            <AdminDashboard v-if="activeTab === 'dashboard'" />

            <!-- 1. 文章管理面板 -->
            <div v-else-if="activeTab === 'posts'" class="animate-fade-in">
                <div class="bg-bg-surface rounded-xl border border-border-default overflow-hidden">
                    <table class="w-full text-left">
                        <thead class="bg-bg-base/50 text-text-muted uppercase text-xs tracking-wider font-medium">
                            <tr>
                                <th class="px-6 py-4">ID</th>
                                <th class="px-6 py-4">文章信息</th>
                                <th class="px-6 py-4">作者</th>
                                <th class="px-6 py-4">状态</th>
                                <th class="px-6 py-4 text-right">管理操作</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-stone-800">
                            <tr v-for="post in posts?.data" :key="post.id" class="hover:bg-bg-elevated/30 transition-colors">
                                <td class="px-6 py-4 text-text-muted font-mono text-xs">#{{ post.id }}</td>
                                <td class="px-6 py-4">
                                    <div class="font-bold text-text-primary mb-1 line-clamp-1">{{ post.title }}</div>
                                    <div class="text-xs text-text-muted">关联：{{ post.architecture_name || '未关联' }} | {{ new Date(post.created_at).toLocaleDateString() }}</div>
                                </td>
                                <td class="px-6 py-4 text-sm text-text-secondary">
                                    {{ post.author_name }}
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-2">
                                        <span v-if="post.is_featured" class="px-2 py-0.5 text-[10px] bg-amber-900/30 text-amber-500 rounded border border-amber-900/50">已置顶</span>
                                        <span :class="['px-2 py-0.5 text-[10px] rounded border', post.status === 'published' ? 'bg-green-900/20 text-green-500 border-green-900/30' : 'bg-red-900/20 text-red-500 border-red-900/30']">
                                            {{ post.status === 'published' ? '正常' : '已下架' }}
                                        </span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 text-right space-x-2">
                                    <button 
                                        @click="toggleFeatured(post)"
                                        :class="['px-3 py-1 text-xs rounded transition-colors border', post.is_featured ? 'border-amber-900/50 text-amber-500 hover:bg-amber-900/20' : 'border-border-subtle text-text-secondary hover:border-amber-500 hover:text-amber-500']"
                                    >
                                        {{ post.is_featured ? '取消置顶' : '置顶推广' }}
                                    </button>
                                    <button 
                                        @click="togglePostStatus(post)"
                                        :class="['px-3 py-1 text-xs rounded transition-colors border', post.status === 'published' ? 'border-red-900/50 text-red-500 hover:bg-red-900/20' : 'border-green-900/50 text-green-500 hover:bg-green-900/20']"
                                    >
                                        {{ post.status === 'published' ? '下架' : '上架' }}
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- 2. 古建数据校对面板 -->
            <div v-else-if="activeTab === 'architectures'" class="animate-fade-in">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- 左侧列表 -->
                    <div class="bg-bg-surface rounded-xl border border-border-default overflow-hidden flex flex-col h-[calc(100vh-200px)]">
                        <div class="p-4 border-b border-border-default bg-bg-base/30">
                            <h3 class="text-text-secondary text-sm font-bold uppercase">古建列表</h3>
                        </div>
                        <div class="overflow-y-auto flex-1 p-2 space-y-2">
                            <div 
                                v-for="arch in architectures?.data" 
                                :key="arch.id"
                                @click="startEdit(arch)"
                                :class="['p-4 rounded-lg cursor-pointer border transition-all', editingArch?.id === arch.id ? 'bg-amber-900/20 border-amber-600/50' : 'bg-bg-elevated/50 border-transparent hover:bg-bg-elevated']"
                            >
                                <div class="flex justify-between items-start mb-1">
                                    <span class="font-bold text-text-primary">{{ arch.name }}</span>
                                    <span class="text-xs px-2 py-0.5 bg-bg-base rounded text-text-muted">{{ arch.era }}</span>
                                </div>
                                <div class="text-xs text-text-muted truncate">{{ arch.description || '暂无简介' }}</div>
                            </div>
                        </div>
                    </div>

                    <!-- 右侧编辑区 -->
                    <div class="bg-bg-surface rounded-xl border border-border-default p-6 h-[calc(100vh-200px)] overflow-y-auto relative">
                        <div v-if="editingArch" class="space-y-6">
                            <div class="flex justify-between items-center border-b border-border-default pb-4 mb-6">
                                <h3 class="text-lg font-bold text-text-primary">编辑古建信息</h3>
                                <div class="space-x-3">
                                    <button @click="cancelEdit" class="text-text-muted hover:text-text-secondary">取消</button>
                                    <button @click="saveArch" class="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-text-primary rounded-lg transition-colors font-bold text-sm">保存修改</button>
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div class="col-span-1 space-y-2">
                                    <label class="text-xs text-text-muted">名称</label>
                                    <input v-model="editingArch.name" type="text" class="w-full bg-bg-base border border-border-default rounded p-2 text-text-primary focus:border-amber-500 outline-none">
                                </div>
                                <div class="col-span-1 space-y-2">
                                    <label class="text-xs text-text-muted">朝代</label>
                                    <input v-model="editingArch.era" type="text" class="w-full bg-bg-base border border-border-default rounded p-2 text-text-primary focus:border-amber-500 outline-none">
                                </div>
                                
                                <!-- 新增：行政区划 -->
                                <div class="col-span-2 grid grid-cols-3 gap-2">
                                    <div class="space-y-2">
                                        <label class="text-xs text-text-muted">省份</label>
                                        <input v-model="editingArch.province" type="text" class="w-full bg-bg-base border border-border-default rounded p-2 text-text-primary focus:border-amber-500 outline-none">
                                    </div>
                                    <div class="space-y-2">
                                        <label class="text-xs text-text-muted">城市</label>
                                        <input v-model="editingArch.city" type="text" class="w-full bg-bg-base border border-border-default rounded p-2 text-text-primary focus:border-amber-500 outline-none">
                                    </div>
                                    <div class="space-y-2">
                                        <label class="text-xs text-text-muted">区县</label>
                                        <input v-model="editingArch.district" type="text" class="w-full bg-bg-base border border-border-default rounded p-2 text-text-primary focus:border-amber-500 outline-none">
                                    </div>
                                </div>

                                <div class="col-span-1 space-y-2">
                                    <label class="text-xs text-text-muted">经度 (Lng)</label>
                                    <input v-model.number="editingArch.lng" type="number" step="0.000001" class="w-full bg-bg-base border border-border-default rounded p-2 text-text-primary focus:border-amber-500 outline-none">
                                </div>
                                <div class="col-span-1 space-y-2">
                                    <label class="text-xs text-text-muted">纬度 (Lat)</label>
                                    <input v-model.number="editingArch.lat" type="number" step="0.000001" class="w-full bg-bg-base border border-border-default rounded p-2 text-text-primary focus:border-amber-500 outline-none">
                                </div>
                            </div>

                            <div class="space-y-2">
                                <div class="flex justify-between items-end">
                                    <label class="text-xs text-text-muted">AI 简介 / 描述</label>
                                    <label class="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" v-model="editingArch.is_ai_generated" :true-value="1" :false-value="0" class="accent-amber-600">
                                        <span class="text-xs text-text-muted">标记为 AI 生成内容</span>
                                    </label>
                                </div>
                                <textarea 
                                    v-model="editingArch.description" 
                                    rows="10" 
                                    class="w-full bg-bg-base border border-border-default rounded p-3 text-text-secondary focus:border-amber-500 outline-none leading-relaxed"
                                    placeholder="输入古建的历史背景、建筑特色等描述..."
                                ></textarea>
                            </div>
                        </div>

                        <div v-else class="h-full flex flex-col items-center justify-center text-text-muted">
                            <div class="text-4xl mb-4">👈</div>
                            <p>请从左侧选择一个古建进行编辑</p>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 3. 用户账号管理面板 -->
            <div v-else-if="activeTab === 'users'" class="animate-fade-in">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-xl font-bold text-text-primary">用户列表</h2>
                    <button 
                        @click="showCreateUser = true"
                        class="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-text-primary rounded-lg transition-colors font-bold text-sm flex items-center gap-2"
                    >
                        <span>+</span> 新增用户
                    </button>
                </div>

                <div class="bg-bg-surface rounded-xl border border-border-default overflow-hidden">
                    <table class="w-full text-left">
                        <thead class="bg-bg-base/50 text-text-muted uppercase text-xs tracking-wider font-medium">
                            <tr>
                                <th class="px-6 py-4">ID</th>
                                <th class="px-6 py-4">用户信息</th>
                                <th class="px-6 py-4">角色</th>
                                <th class="px-6 py-4">发布文章数</th>
                                <th class="px-6 py-4">注册时间</th>
                                <th class="px-6 py-4 text-right">操作</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-stone-800">
                            <tr v-for="user in users?.data" :key="user.id" class="hover:bg-bg-elevated/30 transition-colors">
                                <td class="px-6 py-4 text-text-muted font-mono text-xs">#{{ user.id }}</td>
                                <td class="px-6 py-4">
                                    <div class="font-bold text-text-primary mb-1">{{ user.nickname || '未设置昵称' }}</div>
                                    <div class="text-xs text-text-muted">@{{ user.username }}</div>
                                </td>
                                <td class="px-6 py-4">
                                    <span :class="['px-2 py-0.5 text-[10px] rounded border', user.role === 'admin' ? 'bg-amber-900/20 text-amber-500 border-amber-900/30' : 'bg-bg-elevated text-text-secondary border-border-subtle']">
                                        {{ user.role === 'admin' ? '管理员' : '普通用户' }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-text-secondary font-mono">{{ user.post_count }}</td>
                                <td class="px-6 py-4 text-text-muted text-sm">{{ new Date(user.created_at).toLocaleDateString() }}</td>
                                <td class="px-6 py-4 text-right">
                                    <button 
                                        v-if="user.role !== 'admin'"
                                        @click="deleteUser(user)"
                                        class="px-3 py-1 text-xs rounded transition-colors border border-red-900/50 text-red-500 hover:bg-red-900/20"
                                    >
                                        删除账号
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- 创建用户弹窗 -->
    <div v-if="showCreateUser" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div class="bg-bg-surface w-full max-w-md rounded-xl border border-border-default shadow-2xl overflow-hidden animate-scale-in">
            <div class="p-6 border-b border-border-default flex justify-between items-center">
                <h3 class="text-xl font-bold text-text-primary">新增用户</h3>
                <button @click="showCreateUser = false" class="text-text-muted hover:text-text-secondary">✕</button>
            </div>
            
            <div class="p-6 space-y-4">
                <div class="space-y-2">
                    <label class="text-xs text-text-muted">用户名 <span class="text-red-500">*</span></label>
                    <input v-model="newUserForm.username" type="text" class="w-full bg-bg-base border border-border-default rounded p-2 text-text-primary focus:border-amber-500 outline-none">
                </div>
                <div class="space-y-2">
                    <label class="text-xs text-text-muted">密码 <span class="text-red-500">*</span></label>
                    <input v-model="newUserForm.password" type="password" class="w-full bg-bg-base border border-border-default rounded p-2 text-text-primary focus:border-amber-500 outline-none">
                </div>
                <div class="space-y-2">
                    <label class="text-xs text-text-muted">昵称</label>
                    <input v-model="newUserForm.nickname" type="text" class="w-full bg-bg-base border border-border-default rounded p-2 text-text-primary focus:border-amber-500 outline-none">
                </div>
                <div class="space-y-2">
                    <label class="text-xs text-text-muted">角色</label>
                    <select v-model="newUserForm.role" class="w-full bg-bg-base border border-border-default rounded p-2 text-text-primary focus:border-amber-500 outline-none">
                        <option value="user">普通用户</option>
                        <option value="admin">管理员</option>
                    </select>
                </div>
            </div>

            <div class="p-6 border-t border-border-default flex justify-end gap-3 bg-bg-surface/50">
                <button @click="showCreateUser = false" class="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors">取消</button>
                <button @click="createUser" class="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-text-primary rounded-lg transition-colors font-medium">创建</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.animate-scale-in {
    animation: scaleIn 0.2s ease-out;
}

@keyframes scaleIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
}

.animate-fade-in {
    animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>
