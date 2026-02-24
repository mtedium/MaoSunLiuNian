import { getUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    const user = getUser(event)
    const query = getQuery(event)
    const type = query.type // 可选参数：'post' 或 'architecture'
    
    const db = getDb()
    
    let sql = `SELECT * FROM collections WHERE user_id = ?`
    const params = [user.id]
    
    if (type) {
        sql += ` AND type = ?`
        params.push(type)
    }
    
    sql += ` ORDER BY created_at DESC`
    
    const collections = db.prepare(sql).all(...params)
    
    if (collections.length === 0) {
        return {
            code: 200,
            data: []
        }
    }

    // 获取详细信息
    const postIds = collections.filter(c => c.type === 'post').map(c => c.target_id)
    const archIds = collections.filter(c => c.type === 'architecture').map(c => c.target_id)
    
    let posts = []
    let architectures = []
    
    if (postIds.length > 0) {
        // 使用参数化查询避免注入，虽然这里 ID 列表是内部生成的
        const placeholders = postIds.map(() => '?').join(',')
        const postDetails = db.prepare(`
            SELECT 
                p.*, 
                a.name as architecture_name,
                u.nickname as author_name,
                u.avatar as author_avatar
            FROM posts p 
            LEFT JOIN architectures a ON p.architecture_id = a.id
            LEFT JOIN users u ON p.author_id = u.id
            WHERE p.id IN (${placeholders})
        `).all(...postIds)
        posts = postDetails
    }
    
    if (archIds.length > 0) {
        const placeholders = archIds.map(() => '?').join(',')
        const archDetails = db.prepare(`SELECT * FROM architectures WHERE id IN (${placeholders})`).all(...archIds)
        architectures = archDetails
    }
    
    // 将详情合并回收藏列表
    const result = collections.map(item => {
        let detail = null
        if (item.type === 'post') {
            detail = posts.find(p => p.id === item.target_id)
            if (detail) {
                detail.is_featured = Boolean(detail.is_featured)
            }
        } else if (item.type === 'architecture') {
            detail = architectures.find(a => a.id === item.target_id)
        }
        
        // 如果关联的内容已被删除，detail 可能为空
        return {
            ...item,
            detail
        }
    }).filter(item => item.detail) // 过滤掉失效的收藏

    return {
        code: 200,
        data: result
    }
})
