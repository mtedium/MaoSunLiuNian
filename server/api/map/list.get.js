import { getDb } from '../../utils/db'

export default defineEventHandler((event) => {
    try {
        const db = getDb()
        // 只需获取必要信息用于地图展示，并联表查询文章数量
        const list = db.prepare(`
            SELECT a.id, a.name, a.era, a.lng, a.lat, a.province, a.city, a.district, a.is_lit, COUNT(p.id) as article_count 
            FROM architectures a
            LEFT JOIN posts p ON a.id = p.architecture_id
            GROUP BY a.id
        `).all()

        return {
            code: 200,
            data: list.map(item => ({
                ...item,
                is_lit: Boolean(item.is_lit)
            }))
        }
    } catch (error) {
        console.error('[API map/list] Fetch architectures failed:', error)
        return {
            code: 500,
            message: 'Internal server error'
        }
    }
})
