import { requireAdmin } from '../../../utils/auth'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
    // 权限校验：仅限管理员访问
    requireAdmin(event)
    
    const body = await readBody(event)
    const { username, password, nickname, role } = body
    
    if (!username || !password) {
        throw createError({
            statusCode: 400,
            statusMessage: '用户名和密码不能为空'
        })
    }
    
    const db = getDb()
    
    // 检查用户名是否已存在
    const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username)
    if (existing) {
        throw createError({
            statusCode: 400,
            statusMessage: '用户名已存在'
        })
    }
    
    const hashedPassword = bcrypt.hashSync(password, 10)
    
    try {
        const stmt = db.prepare(`
            INSERT INTO users (username, password, nickname, role) 
            VALUES (?, ?, ?, ?)
        `)
        const info = stmt.run(
            username, 
            hashedPassword, 
            nickname || '新用户', 
            role || 'user'
        )
        
        return {
            code: 200,
            message: '用户创建成功',
            data: { id: info.lastInsertRowid }
        }
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: '创建用户失败'
        })
    }
})
