import { requireAdmin } from '../../../utils/auth'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
    // 权限校验：仅限管理员访问
    requireAdmin(event)
    
    const db = getDb()
    
    // 获取所有用户列表，包含文章统计
    // 注意：这里使用了关联子查询或LEFT JOIN来统计文章数
    const users = db.prepare(`
        SELECT 
            u.id, 
            u.username, 
            u.nickname, 
            u.role, 
            u.created_at,
            (SELECT COUNT(*) FROM posts WHERE author_id = u.id) as post_count
        FROM users u
        ORDER BY u.created_at DESC
    `).all()

    return {
        code: 200,
        data: users
    }
})
