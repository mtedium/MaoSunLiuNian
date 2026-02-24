export default defineNuxtRouteMiddleware(async (to, from) => {
    // 仅拦截 /admin 开头的路由
    if (to.path.startsWith('/admin')) {
        const authStore = useAuthStore()
        
        // 如果未登录或状态未恢复，尝试恢复
        if (!authStore.isLoggedIn) {
            if (import.meta.client) {
                await authStore.restore()
            }
        }
        
        // 检查角色
        if (!authStore.isLoggedIn || authStore.user?.role !== 'admin') {
            return navigateTo('/404') // 或者 navigateTo('/')
        }
    }
})
