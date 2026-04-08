export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  const db = getDb()

  try {
    // 获取文章关联的古建
    const post = db.prepare('SELECT architecture_id FROM posts WHERE id = ?').get(id)

    const result = db.prepare('DELETE FROM posts WHERE id = ?').run(id)

    if (result.changes === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Post not found'
      })
    }

    // 如果有关联古建，检查是否还有其他文章关联，如果没有则取消点亮
    if (post && post.architecture_id) {
      const count = db.prepare('SELECT COUNT(*) as count FROM posts WHERE architecture_id = ?').get(post.architecture_id).count
      if (count === 0) {
        db.prepare('UPDATE architectures SET is_lit = 0 WHERE id = ?').run(post.architecture_id)
      }
    }

    return { success: true, message: 'Post deleted successfully' }
  } catch (error) {
    console.error('Delete post error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})
