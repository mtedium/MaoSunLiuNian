import { getDb } from '../../utils/db'

export default defineEventHandler((event) => {
    try {
        const db = getDb()
        // 只需获取必要信息用于地图展示
        const list = db.prepare('SELECT id, name, era, lng, lat, is_lit, article_count FROM architectures').all()

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
