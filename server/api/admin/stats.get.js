import { getDb } from '../../utils/db'
import { verifyToken } from '../../utils/jwt'

export default defineEventHandler((event) => {
    // 权限校验
    const authHeader = getHeader(event, 'Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)
    if (!decoded) {
        throw createError({ statusCode: 401, statusMessage: 'Invalid Token' })
    }
    
    // 获取真实数据
    const db = getDb()

    // 核心数据
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count
    
    // 今日新增用户 (简单按日期判断，这里用sqlite datetime)
    const todayUsers = db.prepare("SELECT COUNT(*) as count FROM users WHERE date(created_at) = date('now', 'localtime')").get().count

    const totalPosts = db.prepare('SELECT COUNT(*) as count FROM posts').get().count
    
    // 简单算个地图点亮数（有文章的古建数量）
    const litArchs = db.prepare(`
        SELECT COUNT(DISTINCT architecture_id) as count 
        FROM posts 
        WHERE architecture_id IS NOT NULL AND status = 'published'
    `).get().count

    // 古建朝代分布（有文章的点亮古建）
    const dynastyStats = db.prepare(`
        SELECT a.era as name, COUNT(DISTINCT p.architecture_id) as value
        FROM architectures a
        JOIN posts p ON a.id = p.architecture_id
        WHERE p.status = 'published'
        GROUP BY a.era
        ORDER BY value DESC
    `).all()

    // 若没有任何点亮数据，提供一个默认展示结构以防图表报错
    const pieData = dynastyStats.length > 0 ? dynastyStats : [
        { name: '暂无点亮', value: 0 }
    ]

    // 活跃用户 Top 5（按发布文章数量排序）
    const activeUsers = db.prepare(`
        SELECT u.id, u.nickname, u.username, COUNT(p.id) as points
        FROM users u
        LEFT JOIN posts p ON u.id = p.author_id AND p.status = 'published'
        GROUP BY u.id
        ORDER BY points DESC
        LIMIT 5
    `).all().map(u => ({
        id: u.id,
        name: u.nickname || u.username,
        points: u.points,
        avatar: u.nickname ? u.nickname.charAt(0).toUpperCase() : u.username.charAt(0).toUpperCase()
    }))

    // 待办事项 (模拟一些系统级的提醒，比如待审核或新举报，这里我们拿最新发布的未关联古建的文章等)
    const recentPosts = db.prepare(`
        SELECT id, title, created_at
        FROM posts
        ORDER BY created_at DESC
        LIMIT 4
    `).all().map(p => ({
        id: p.id,
        text: `新文章发布: 《${p.title}》`,
        time: p.created_at,
        type: 'audit'
    }))

    // 近30天趋势 (模拟数据和真实数据结合，因为测试库可能没那么多跨度天数的数据)
    // 真实情况可以用按天 GROUP BY 获取，这里为了图表好看如果数据不够我们造一点过去几天的
    const trendData = {
        dates: [],
        posts: [],
        lights: []
    }
    
    for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        // 获取本地 YYYY-MM-DD
        const year = d.getFullYear()
        const month = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        const dateStr = `${year}-${month}-${day}`
        
        // 当天新增文章数
        const pCount = db.prepare("SELECT COUNT(*) as c FROM posts WHERE date(created_at, 'localtime') = ?").get(dateStr).c
        
        // 当天累计点亮 (简单化处理：获取到该天为止的所有点亮数)
        const lCount = db.prepare(`
            SELECT COUNT(DISTINCT architecture_id) as c 
            FROM posts 
            WHERE architecture_id IS NOT NULL 
              AND status = 'published'
              AND date(created_at, 'localtime') <= ?
        `).get(dateStr).c
        
        trendData.dates.push(`${month}-${day}`) // MM-DD
        trendData.posts.push(pCount)
        trendData.lights.push(lCount)
    }

    return {
        stats: {
            totalUsers,
            todayUsers,
            totalPosts,
            litArchs
        },
        pieData,
        activeUsers,
        todos: recentPosts.length > 0 ? recentPosts : [
            { id: 1, text: '系统例行检查正常', time: new Date().toISOString(), type: 'system' }
        ],
        trendData
    }
})
