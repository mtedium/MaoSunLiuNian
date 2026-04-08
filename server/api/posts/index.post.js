export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const db = getDb()

  // 简单验证
  if (!body.title || !body.content) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Title and content are required'
    })
  }

  // 模拟当前用户 ID，实际应从 session 获取
  // 如果 body 中没有 author_id，默认设为 1 (管理员)
  const author_id = body.author_id || 1 

  const stmt = db.prepare(`
    INSERT INTO posts (title, content, cover_url, architecture_id, author_id, is_featured)
    VALUES (?, ?, ?, ?, ?, ?)
  `)

  try {
    const info = stmt.run(
      body.title,
      body.content,
      body.cover_url || null,
      body.architecture_id || null,
      author_id,
      body.is_featured ? 1 : 0
    )

    // 点亮逻辑：如果关联了古建，更新 architectures 表的 is_lit 字段为 1
    // (article_count 现在通过联表动态计算，不再直接修改字段)
    if (body.architecture_id) {
      db.prepare(`
        UPDATE architectures 
        SET is_lit = 1
        WHERE id = ?
      `).run(body.architecture_id)
    }

    // 获取插入后的数据
    const newPost = db.prepare('SELECT * FROM posts WHERE id = ?').get(info.lastInsertRowid)

    return {
      ...newPost,
      is_featured: Boolean(newPost.is_featured)
    }
  } catch (error) {
    console.error('Create post error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})
