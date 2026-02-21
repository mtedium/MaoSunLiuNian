import bcrypt from 'bcryptjs'


export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { username, password } = body || {}

    // 参数校验
    if (!username || !password) {
        throw createError({
            statusCode: 400,
            statusMessage: '用户名和密码不能为空'
        })
    }

    const db = getDb()

    // 查找用户
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username)

    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: '用户名或密码错误'
        })
    }

    // 验证密码
    const isMatch = bcrypt.compareSync(password, user.password)

    if (!isMatch) {
        throw createError({
            statusCode: 401,
            statusMessage: '用户名或密码错误'
        })
    }

    // 签发 Token
    const token = signToken({
        id: user.id,
        username: user.username
    })

    // 返回用户信息和 Token
    return {
        code: 200,
        message: '登录成功',
        data: {
            token,
            user: {
                id: user.id,
                username: user.username,
                nickname: user.nickname || user.username,
                avatar: user.avatar || ''
            }
        }
    }
})
