export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  const db = getDb()

  try {
    const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(id)

    if (!post) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Post not found'
      })
    }

    return {
      ...post,
      is_featured: Boolean(post.is_featured)
    }
  } catch (error) {
    console.error('Get post detail error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})
