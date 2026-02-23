import { streamText } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  const apiKey = config.aiApiKey
  const apiBase = config.aiApiBase
  const apiModel = config.aiModel

  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Server configuration error: Missing AI API Key',
    })
  }

  const body = await readBody(event)
  const { messages } = body

  if (!messages || !Array.isArray(messages)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request: messages must be an array',
    })
  }

  // 系统提示词（Soul）
  const systemPrompt = {
    role: 'system',
    content: `你是“营造大师”，一位博古通今的中国古建筑专家。你性格儒雅、专业，自称“老朽”，称呼用户为“小友”。你擅长用通俗易懂的语言解释《营造法式》、榫卯结构等古建筑知识。你的回答应富有文化底蕴，引用古籍时要解释其含义，引导用户感受中国传统建筑之美。
    
    引导要求：
    在回答结束时，请根据内容偶尔（约 30% 概率）加上引导语，例如：“小友若想一睹实物，可去【流年地图】探寻其方位”或“【营造社区】中亦有同好之人的实地记录，不妨一读”。`
  }

  // 构建完整的对话历史：将系统提示词放在首位
  const fullMessages = [systemPrompt, ...messages]

  try {
    // 请求 AI API (DeepSeek / OpenAI Compatible)
    const response = await fetch(`${apiBase}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: apiModel,
        messages: fullMessages,
        temperature: 1, // 适度创造性 kimi-k2.5只能1
        stream: true // 开启流式传输
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw createError({
        statusCode: response.status,
        statusMessage: 'Failed to communicate with AI service',
        data: errorData
      })
    }

    // 设置响应头为 Server-Sent Events
    setResponseHeader(event, 'Content-Type', 'text/event-stream')
    setResponseHeader(event, 'Cache-Control', 'no-cache')
    setResponseHeader(event, 'Connection', 'keep-alive')

    // 使用 sendStream 发送流
    return sendStream(event, response.body)

  } catch (error) {
    console.error('AI API Request Failed:', error)
    // 如果已经开始发送流，则无法再抛出标准错误，只能记录日志
    // 如果还没开始发送，可以抛出错误
    if (!event.node.res.headersSent) {
      throw createError({
        statusCode: 502,
        statusMessage: 'Failed to communicate with AI service',
        data: error.data || error.message
      })
    }
  }
})
