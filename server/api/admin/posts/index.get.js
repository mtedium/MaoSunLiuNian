import { requireAdmin } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
    // 权限校验：仅限管理员访问
    requireAdmin(event)
    
    const db = getDb()
    
    // 获取全站所有文章列表
    const posts = db.prepare(`
        SELECT 
            p.id, 
            p.title, 
            p.content, 
            p.cover_url, 
            p.likes, 
            p.is_featured, 
            p.status, 
            p.created_at,
            u.nickname as author_name,
            u.avatar as author_avatar,
            a.name as architecture_name
        FROM posts p
        LEFT JOIN users u ON p.author_id = u.id
        LEFT JOIN architectures a ON p.architecture_id = a.id
        ORDER BY p.created_at DESC
    `).all()

    return {
        code: 200,
        data: posts
    }
})
