import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
    const token = ref('')
    const user = ref(null)

    const isLoggedIn = computed(() => !!token.value && !!user.value)
    const displayName = computed(() => user.value?.nickname || user.value?.username || '未登录')

    /**
     * 登录
     */
    async function login(username, password) {
        const res = await $fetch('/api/auth/login', {
            method: 'POST',
            body: { username, password }
        })

        token.value = res.data.token
        user.value = res.data.user

        // 持久化到 localStorage
        if (import.meta.client) {
            localStorage.setItem('auth_token', res.data.token)
            localStorage.setItem('auth_user', JSON.stringify(res.data.user))
        }

        return res
    }

    /**
     * 登出
     */
    function logout() {
        token.value = ''
        user.value = null

        if (import.meta.client) {
            localStorage.removeItem('auth_token')
            localStorage.removeItem('auth_user')
        }
    }

    /**
     * 从 localStorage 恢复登录状态
     */
    async function restore() {
        if (!import.meta.client) return

        const savedToken = localStorage.getItem('auth_token')
        const savedUser = localStorage.getItem('auth_user')

        if (savedToken && savedUser) {
            token.value = savedToken
            user.value = JSON.parse(savedUser)

            // 验证 token 是否仍然有效
            try {
                const res = await $fetch('/api/auth/me', {
                    headers: { Authorization: `Bearer ${savedToken}` }
                })
                user.value = res.data.user
            } catch {
                // token 失效，清除登录状态
                logout()
            }
        }
    }

    return {
        token,
        user,
        isLoggedIn,
        displayName,
        login,
        logout,
        restore
    }
})
