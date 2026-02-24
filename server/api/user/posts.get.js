import { getUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    const user = getUser(event)
    const db = getDb()

    // 获取当前用户的所有文章
    const posts = db.prepare(`
        SELECT 
            p.*, 
            a.name as architecture_name 
        FROM posts p
        LEFT JOIN architectures a ON p.architecture_id = a.id
        WHERE p.author_id = ?
        ORDER BY p.created_at DESC
    `).all(user.id)

    return {
        code: 200,
        data: posts.map(post => ({
            ...post,
            is_featured: Boolean(post.is_featured)
        }))
    }
})
