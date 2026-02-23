export default defineEventHandler((event) => {
  const query = getQuery(event)
  const db = getDb()
  const keyword = query.keyword || ''

  if (!keyword) {
    return []
  }

  const stmt = db.prepare('SELECT id, name, era FROM architectures WHERE name LIKE ? LIMIT 10')
  return stmt.all(`%${keyword}%`)
})
