export default defineEventHandler((event) => {
  const query = getQuery(event)
  const db = getDb()

  let sql = `
    SELECT p.*, a.name as architecture_name 
    FROM posts p
    LEFT JOIN architectures a ON p.architecture_id = a.id
  `
  const params = []

  if (query.architecture_id) {
    sql += ' WHERE p.architecture_id = ?'
    params.push(query.architecture_id)
  }

  sql += ' ORDER BY p.created_at DESC'

  try {
    const posts = db.prepare(sql).all(...params)

    return posts.map(post => ({
      ...post,
      is_featured: Boolean(post.is_featured),
      architecture_name: post.architecture_name || null // Ensure consistent property
    }))
  } catch (error) {
    console.error('Get posts error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})
