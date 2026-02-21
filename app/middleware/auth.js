/**
 * 认证路由中间件
 * 用于保护需要登录才能访问的页面
 * 在页面中使用: definePageMeta({ middleware: 'auth' })
 */
export default defineNuxtRouteMiddleware((to) => {
    // 仅在客户端执行
    if (import.meta.server) return

    const token = localStorage.getItem('auth_token')

    if (!token) {
        return navigateTo('/login')
    }
})
