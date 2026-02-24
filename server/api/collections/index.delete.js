import { getUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    const user = getUser(event)
    const query = getQuery(event)
    const { type, target_id } = query
    
    if (!type || !target_id) {
        throw createError({
            statusCode: 400,
            statusMessage: '参数错误: type 和 target_id 必填'
        })
    }
    
    const db = getDb()
    
    db.prepare('DELETE FROM collections WHERE user_id = ? AND type = ? AND target_id = ?')
      .run(user.id, type, target_id)
      
    return {
        code: 200,
        message: '取消收藏成功'
    }
})
