import { getUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    const user = getUser(event)
    const db = getDb()

    // 1. 文章数
    const postCount = db.prepare('SELECT COUNT(*) as count FROM posts WHERE author_id = ?').get(user.id).count

    // 2. 获赞总数
    const likeCount = db.prepare('SELECT COALESCE(SUM(likes), 0) as count FROM posts WHERE author_id = ?').get(user.id).count

    // 3. 点亮建筑数
    const litCount = db.prepare('SELECT COUNT(DISTINCT architecture_id) as count FROM posts WHERE author_id = ?').get(user.id).count

    // 4. 点亮的所有建筑坐标列表 (用于前端发光图)
    const litArchitectures = db.prepare(`
        SELECT DISTINCT a.id, a.name, a.lng, a.lat 
        FROM architectures a 
        JOIN posts p ON a.id = p.architecture_id 
        WHERE p.author_id = ?
    `).all(user.id)

    return {
        code: 200,
        data: {
            stats: {
                postCount,
                likeCount,
                litCount
            },
            litArchitectures
        }
    }
})
