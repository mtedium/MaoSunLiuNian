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

    // 如果简介为空，或者虽然不为空但不是AI生成的（即可能是上次fallback生成的废话），尝试调用 AI 接口
    // 判断逻辑：如果 is_ai_generated 为 0，说明它是默认文案或者空，需要重新生成
    if (!arch.description || !arch.is_ai_generated) {
        let newDescription = ''
        let isSuccess = false

        try {
            // 尝试调用 AI 接口生成简介 (Kimi / Moonshot)
            const config = useRuntimeConfig()
            const apiKey = config.aiApiKey || process.env.AI_API_KEY
            const apiBase = config.aiApiBase || process.env.AI_API_BASE
            const apiModel = config.aiModelMap || process.env.AI_MODEL_MAP



            if (apiKey) {
                const response = await fetch(`${apiBase}/chat/completions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        model: apiModel, // 使用 Kimi 的模型
                        messages: [
                            {
                                role: 'system',
                                content: '你是一位古建筑学专家，请围绕建筑本身提供一段简明扼要的专业介绍（约150字左右），强调其木结构与榫卯工艺等历史价值。'
                            },
                            {
                                role: 'user',
                                content: `古建筑：${arch.name}，朝代：${arch.era}，位置：${arch.province}${arch.city}${arch.district}`
                            }
                        ],
                        temperature: 0.3
                    })
                })

                if (response.ok) {
                    const data = await response.json()
                    if (data.choices && data.choices[0]?.message?.content) {
                        newDescription = data.choices[0].message.content.trim()
                        isSuccess = true
                    } else {
                        throw new Error('Invalid response payload')
                    }
                } else {
                    const errorText = await response.text()
                    throw new Error(`AI API failed with status ${response.status}: ${errorText}`)
                }
            } else {
                // 如果没有配置API KEY，故意抛错进入 fallback
                throw new Error('No AI API Key configured')
            }
        } catch (error) {
            console.error('[AI Detail API] 获取AI简介失败:', error.message)
            // 异常处理：只有当简介完全为空时，才填入 fallback 文案
            // 如果原本就有（比如上次生成的），就保留原样，不覆盖
            if (!arch.description) {
                newDescription = `${arch.name}（${arch.era}）是现存极为珍贵的古建筑实例，体现了当时最高水准的木构技术和榫卯工艺。其精巧的梁架体系与斗栱结构，展现了古典营造法则在空间与受力上的完美融合，具有极高的历史与科学价值。`
                isSuccess = false // 标记为非 AI 生成
            }
        }

        // 更新数据库
        if (newDescription) {
            const stmt = db.prepare('UPDATE architectures SET description = ?, is_ai_generated = ? WHERE id = ?')
            const isAiGenerated = isSuccess ? 1 : 0
            stmt.run(newDescription, isAiGenerated, id)
            
            // 更新返回对象
            arch.description = newDescription
            arch.is_ai_generated = isAiGenerated
        }
    }

    return {
        code: 200,
        data: arch
    }
})
