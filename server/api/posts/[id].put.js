export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const db = getDb()

  try {
    const existingPost = db.prepare('SELECT * FROM posts WHERE id = ?').get(id)
    if (!existingPost) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Post not found'
      })
    }
    
    const updates = []
    const params = []
    
    if (body.title !== undefined) {
      updates.push('title = ?')
      params.push(body.title)
    }
    if (body.content !== undefined) {
      updates.push('content = ?')
      params.push(body.content)
    }
    if (body.cover_url !== undefined) {
      updates.push('cover_url = ?')
      params.push(body.cover_url)
    }
    if (body.architecture_id !== undefined) {
      updates.push('architecture_id = ?')
      params.push(body.architecture_id)
    }
    if (body.is_featured !== undefined) {
      updates.push('is_featured = ?')
      params.push(body.is_featured ? 1 : 0)
    }

    if (updates.length === 0) {
      return {
        ...existingPost,
        is_featured: Boolean(existingPost.is_featured)
      }
    }

    // 更新 updated_at 如果有该字段，这里只更新内容
    // 假设 created_at 是不可变的，如果需要 updated_at 字段，需要在表结构中添加

    params.push(id)
    const sql = `UPDATE posts SET ${updates.join(', ')} WHERE id = ?`
    
    db.prepare(sql).run(...params)

    // 更新点亮状态逻辑
    if (body.architecture_id !== undefined && existingPost.architecture_id !== body.architecture_id) {
      // 1. 如果旧关联存在，检查是否需要取消点亮
      if (existingPost.architecture_id) {
        const count = db.prepare('SELECT COUNT(*) as count FROM posts WHERE architecture_id = ?').get(existingPost.architecture_id).count
        if (count === 0) {
          db.prepare('UPDATE architectures SET is_lit = 0 WHERE id = ?').run(existingPost.architecture_id)
        }
      }
      
      // 2. 如果新关联存在，设置为点亮
      if (body.architecture_id) {
        db.prepare('UPDATE architectures SET is_lit = 1 WHERE id = ?').run(body.architecture_id)
      }
    }

    const updatedPost = db.prepare('SELECT * FROM posts WHERE id = ?').get(id)
    return {
      ...updatedPost,
      is_featured: Boolean(updatedPost.is_featured)
    }
  } catch (error) {
    console.error('Update post error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})
