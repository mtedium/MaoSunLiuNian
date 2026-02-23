export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  const db = getDb()

  try {
    const result = db.prepare('DELETE FROM posts WHERE id = ?').run(id)

    if (result.changes === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Post not found'
      })
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
