import { verifyToken } from './jwt'

export const getUser = (event) => {
    const authHeader = getHeader(event, 'authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw createError({
            statusCode: 401,
            statusMessage: '未提供认证令牌'
        })
    }

    const token = authHeader.replace('Bearer ', '')
    const payload = verifyToken(token)

    if (!payload) {
        throw createError({
            statusCode: 401,
            statusMessage: '令牌无效或已过期'
        })
    }

    const db = getDb()
    const user = db.prepare('SELECT id, username, nickname, avatar, role, created_at FROM users WHERE id = ?').get(payload.id)

    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: '用户不存在'
        })
    }

    return user
}

export const requireAdmin = (event) => {
    const user = getUser(event)
    if (user.role !== 'admin') {
        throw createError({
            statusCode: 403,
            statusMessage: '权限不足，仅管理员可访问'
        })
    }
    return user
}
