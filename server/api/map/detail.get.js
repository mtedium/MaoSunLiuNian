import { getDb } from '../../utils/db'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const id = query.id

    if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'Missing architecture ID' })
    }

    const db = getDb()
    const arch = db.prepare('SELECT * FROM architectures WHERE id = ?').get(id)

    if (!arch) {
        throw createError({ statusCode: 404, statusMessage: 'Architecture not found' })
    }

    // 如果简介为空，调用 AI 接口获取并更新数据库
    if (!arch.description) {
        let newDescription = ''
        try {
            // 尝试调用 AI 接口生成简介
            const apiKey = process.env.OPENAI_API_KEY || ''
            if (apiKey) {
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        model: 'gpt-3.5-turbo',
                        messages: [
                            {
                                role: 'system',
                                content: '你是一位古建筑学专家，请围绕建筑本身提供一段简明扼要的专业介绍（约150字左右），强调其木结构与榫卯工艺等历史价值。'
                            },
                            {
                                role: 'user',
                                content: `古建筑：${arch.name}，朝代：${arch.era}`
                            }
                        ]
                    })
                })

                if (response.ok) {
                    const data = await response.json()
                    if (data.choices && data.choices[0]?.message?.content) {
                        newDescription = data.choices[0].message.content.trim()
                    } else {
                        throw new Error('Invalid response payload')
                    }
                } else {
                    throw new Error(`AI API failed with status ${response.status}`)
                }
            } else {
                // 如果没有配置API KEY，故意抛错进入 fallback
                throw new Error('No API Key configured, fallback to default text.')
            }
        } catch (error) {
            console.error('[AI Detail API] 获取AI简介失败:', error.message)
            // 异常处理：返回预设默认文案，不要阻断
            newDescription = `${arch.name}（${arch.era}）是现存极为珍贵的古建筑实例，体现了当时最高水准的木构技术和榫卯工艺。其精巧的梁架体系与斗栱结构，展现了古典营造法则在空间与受力上的完美融合，具有极高的历史与科学价值。`
        }

        // 无论是成功通过AI生成，还是使用了默认 fallback 文案，都更新到数据库中并返回
        if (newDescription) {
            const stmt = db.prepare('UPDATE architectures SET description = ? WHERE id = ?')
            stmt.run(newDescription, id)
            arch.description = newDescription
        }
    }

    return {
        code: 200,
        data: arch
    }
})
