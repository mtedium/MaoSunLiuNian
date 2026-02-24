import { requireAdmin } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
    // 权限校验：仅限管理员访问
    requireAdmin(event)
    
    const db = getDb()
    
    // 获取所有古建列表
    const architectures = db.prepare('SELECT * FROM architectures ORDER BY id ASC').all()

    return {
        code: 200,
        data: architectures
    }
})
