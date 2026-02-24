import { requireAdmin } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
    // 权限校验：仅限管理员访问
    requireAdmin(event)
    
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    const db = getDb()

    // 验证帖子是否存在
    const post = db.prepare('SELECT id FROM posts WHERE id = ?').get(id)
    if (!post) {
        throw createError({
            statusCode: 404,
            statusMessage: '文章不存在'
        })
    }

    // 更新字段 (仅允许更新 is_featured 和 status)
    const updates = []
    const params = []

    if (typeof body.is_featured !== 'undefined') {
        updates.push('is_featured = ?')
        params.push(body.is_featured ? 1 : 0)
    }

    if (typeof body.status !== 'undefined') {
        updates.push('status = ?')
        params.push(body.status)
    }

    if (updates.length > 0) {
        params.push(id)
        db.prepare(`UPDATE posts SET ${updates.join(', ')} WHERE id = ?`).run(...params)
    }

    return {
        code: 200,
        message: '更新成功'
    }
})
