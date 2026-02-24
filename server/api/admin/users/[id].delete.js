import { requireAdmin } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
    // 权限校验：仅限管理员访问
    const admin = requireAdmin(event)
    
    const id = getRouterParam(event, 'id')
    const db = getDb()
    
    // 防止删除自己
    if (parseInt(id) === admin.id) {
        throw createError({
            statusCode: 400,
            statusMessage: '不能删除当前登录的管理员账号'
        })
    }

    // 检查用户是否存在
    const user = db.prepare('SELECT id FROM users WHERE id = ?').get(id)
    if (!user) {
        throw createError({
            statusCode: 404,
            statusMessage: '用户不存在'
        })
    }

    try {
        // 删除用户（级联删除文章和收藏可能需要处理，这里简单处理，先保留文章但置空author_id，或者直接删除，取决于业务需求）
        // 假设数据库外键约束已设置 ON DELETE CASCADE，或者手动清理
        // 这里手动清理关联数据以确保安全
        
        // 1. 删除收藏
        db.prepare('DELETE FROM collections WHERE user_id = ?').run(id)
        
        // 2. 将该用户的文章 author_id 置为 NULL (保留内容) 或者 删除文章
        // 这里选择删除文章
        db.prepare('DELETE FROM posts WHERE author_id = ?').run(id)
        
        // 3. 删除用户
        db.prepare('DELETE FROM users WHERE id = ?').run(id)
        
        return {
            code: 200,
            message: '用户已删除'
        }
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: '删除失败: ' + error.message
        })
    }
})
