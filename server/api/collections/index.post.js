import { getUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    const user = getUser(event)
    const body = await readBody(event)
    const { type, target_id } = body
    
    if (!type || !target_id) {
        throw createError({
            statusCode: 400,
            statusMessage: '参数错误: type 和 target_id 必填'
        })
    }
    
    const db = getDb()
    
    try {
        const stmt = db.prepare('INSERT INTO collections (user_id, type, target_id) VALUES (?, ?, ?)')
        stmt.run(user.id, type, target_id)
        
        return {
            code: 200,
            message: '收藏成功'
        }
    } catch (error) {
        // 唯一约束冲突，说明已收藏
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return {
                code: 200,
                message: '已收藏'
            }
        }
        throw error
    }
})
