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
        try {
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
        } catch (error) {
            console.error('[DB] Database initialization failed:', error)
            throw error // 重新抛出错误，确保应用知晓数据库不可用
        }
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
      role       TEXT    DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

    // 检查是否已有用户，如果没有则创建默认管理员
    const count = _db.prepare('SELECT COUNT(*) as count FROM users').get()
    if (count.count === 0) {
        const hashedPassword = bcrypt.hashSync('admin123', 10)
        _db.prepare(
            'INSERT INTO users (username, password, nickname, role) VALUES (?, ?, ?, ?)'
        ).run('admin', hashedPassword, '管理员', 'admin')

        console.log('[DB] 默认管理员账号已创建 — 用户名: admin, 密码: admin123')
    }

    // 检查并添加缺失字段 (Schema Migration - users)
    const userColumns = _db.prepare('PRAGMA table_info(users)').all()
    const userColumnNames = userColumns.map(c => c.name)

    if (!userColumnNames.includes('role')) {
        _db.prepare("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'").run()
        // 更新现有 admin 用户为 admin 角色
        _db.prepare("UPDATE users SET role = 'admin' WHERE username = 'admin'").run()
        console.log('[DB] Migrated: Added column role to users')
    }

    _db.exec(`
    CREATE TABLE IF NOT EXISTS architectures (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      name            TEXT    NOT NULL,
      era             TEXT    NOT NULL,
      province        TEXT    DEFAULT '',
      city            TEXT    DEFAULT '',
      district        TEXT    DEFAULT '',
      lng             REAL    NOT NULL,
      lat             REAL    NOT NULL,
      description     TEXT    DEFAULT '',
      article_count   INTEGER DEFAULT 0,
      is_lit          BOOLEAN DEFAULT 0,
      is_ai_generated BOOLEAN DEFAULT 0
    )
    `)

    // 检查并添加缺失字段 (Schema Migration)
    const columns = _db.prepare('PRAGMA table_info(architectures)').all()
    const columnNames = columns.map(c => c.name)

    const newFields = ['is_lit', 'article_count', 'province', 'city', 'district', 'is_ai_generated']
    const fieldTypes = {
        is_lit: 'BOOLEAN DEFAULT 0',
        article_count: 'INTEGER DEFAULT 0',
        province: "TEXT DEFAULT ''",
        city: "TEXT DEFAULT ''",
        district: "TEXT DEFAULT ''",
        is_ai_generated: "BOOLEAN DEFAULT 0"
    }

    newFields.forEach(field => {
        if (!columnNames.includes(field)) {
            _db.prepare(`ALTER TABLE architectures ADD COLUMN ${field} ${fieldTypes[field]}`).run()
            console.log(`[DB] Migrated: Added column ${field} to architectures`)
        }
    })

    _db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      title           TEXT    NOT NULL,
      content         TEXT,
      cover_url       TEXT,
      architecture_id INTEGER,
      author_id       INTEGER,
      likes           INTEGER DEFAULT 0,
      is_featured     BOOLEAN DEFAULT 0,
      status          TEXT    DEFAULT 'published',
      created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (architecture_id) REFERENCES architectures(id),
      FOREIGN KEY (author_id) REFERENCES users(id)
    )
    `)

    // 检查并添加缺失字段 (Schema Migration - posts)
    const postColumns = _db.prepare('PRAGMA table_info(posts)').all()
    const postColumnNames = postColumns.map(c => c.name)

    if (!postColumnNames.includes('status')) {
        _db.prepare("ALTER TABLE posts ADD COLUMN status TEXT DEFAULT 'published'").run()
        console.log('[DB] Migrated: Added column status to posts')
    }

    _db.exec(`
    CREATE TABLE IF NOT EXISTS collections (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id    INTEGER NOT NULL,
      type       TEXT    NOT NULL, -- 'post' or 'architecture'
      target_id  INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(user_id, type, target_id)
    )
    `)

    const archCount = _db.prepare('SELECT COUNT(*) as count FROM architectures').get()
    if (archCount.count === 0) {
        const stmt = _db.prepare('INSERT INTO architectures (name, era, lng, lat, description, article_count) VALUES (?, ?, ?, ?, ?, ?)')
        stmt.run('应县木塔', '辽代', 113.179, 39.554, '', 0)
        stmt.run('佛光寺', '唐代', 113.385, 38.927, '', 0)
        stmt.run('独乐寺', '辽代', 117.404, 40.046, '', 0)
        console.log('[DB] 初始化古建测试数据（含应县木塔、佛光寺、独乐寺）')
    }
}
