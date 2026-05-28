/*
 * @Author: Mtedium mtedium@outlook.com
 * @Date: 2026-02-21 19:42:39
 * @LastEditors: Mtedium mtedium@outlook.com
 * @LastEditTime: 2026-05-28 17:26:51
 * @FilePath: \榫卯流年\server\utils\jwt.js
 * @Description: 
 * 
 * Copyright (c) 2026 by Mtedium, All Rights Reserved. 
 */
import jwt from 'jsonwebtoken'

// JWT 密钥，生产环境应使用环境变量
const JWT_SECRET = process.env.JWT_SECRET || 'maosunliunian-secret-key-2026'

// Token 过期时间
const TOKEN_EXPIRES_IN = '7d'

/**
 * 签发 JWT Token
 * @param {Object} payload - 载荷数据
 * @returns {string} token
 */
export function signToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN })
}

/**
 * 验证 JWT Token
 * @param {string} token
 * @returns {Object|null} 解码后的载荷，失败返回 null
 */
export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET)
    } catch {
        return null
    }
}
