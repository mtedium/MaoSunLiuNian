import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'
import { resolve } from 'path'
import { existsSync, mkdirSync } from 'fs'

// 数据库文件存放在项目根目录的 data 文件夹中
const dbPath = resolve(process.cwd(), 'data', 'app.db')

let _db

/**
 * 获取数据库实例（单例模式）
 */
export function getDb() {
    if (!_db) {
        // 确保 data 目录存在
        const dir = resolve(process.cwd(), 'data')
        if (!existsSync(dir)) {
            mkdirSync(dir, { recursive: true })
        }

        _db = new Database(dbPath)

        // 启用 WAL 模式提升性能
        _db.pragma('journal_mode = WAL')

        // 初始化表结构
        initTables()
    }
    return _db
}

/**
 * 初始化数据库表
 */
function initTables() {
    _db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      username   TEXT    NOT NULL UNIQUE,
      password   TEXT    NOT NULL,
      nickname   TEXT    DEFAULT '',
      avatar     TEXT    DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

    // 检查是否已有用户，如果没有则创建默认管理员
    const count = _db.prepare('SELECT COUNT(*) as count FROM users').get()
    if (count.count === 0) {
        const hashedPassword = bcrypt.hashSync('admin123', 10)
        _db.prepare(
            'INSERT INTO users (username, password, nickname) VALUES (?, ?, ?)'
        ).run('admin', hashedPassword, '管理员')

        console.log('[DB] 默认管理员账号已创建 — 用户名: admin, 密码: admin123')
    }
}
