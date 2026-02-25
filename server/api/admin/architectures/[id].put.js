import { requireAdmin } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
    // 权限校验：仅限管理员访问
    requireAdmin(event)
    
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    const db = getDb()

    // 验证古建是否存在
    const arch = db.prepare('SELECT id FROM architectures WHERE id = ?').get(id)
    if (!arch) {
        throw createError({
            statusCode: 404,
            statusMessage: '古建不存在'
        })
    }

    // 可更新的字段
    const allowedFields = ['name', 'era', 'lng', 'lat', 'description', 'province', 'city', 'district', 'is_ai_generated']
    const updates = []
    const params = []

    for (const field of allowedFields) {
        if (typeof body[field] !== 'undefined') {
            updates.push(`${field} = ?`)
            params.push(body[field])
        }
    }

    if (updates.length > 0) {
        params.push(id)
        db.prepare(`UPDATE architectures SET ${updates.join(', ')} WHERE id = ?`).run(...params)
    }

    return {
        code: 200,
        message: '更新成功'
    }
})
