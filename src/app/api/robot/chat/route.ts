import type { NextRequest } from 'next/server'

import { openai } from '@/lib/openai'
import { getParams } from '@/utils/params'
import { OpenAIStream, StreamingTextResponse } from 'ai'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * @swagger
 * /api/robot/chat:
 *   get:
 *     summary: 与 GPT 机器人聊天 @deprecated
 *     description: "**过时**：请使用 `POST /api/robot/chat/`，此接口为 OpenAI 兼容接口"
 *     tags:
 *       - 机器人
 *     parameters:
 *      - name: prompt
 *        in: query
 *        description: 对话内容
 *        required: true
 *        type: string
 *      - name: model
 *        in: query
 *        description: 模型名称
 *        required: false
 *        type: string
 *        default: gpt-3.5-turbo
 *     responses:
 *       200:
 *         description: 流式数据 `text/event-stream`
 */
export async function GET(request: NextRequest) {
  const responseStream = new TransformStream()
  const writer = responseStream.writable.getWriter()
  const encoder = new TextEncoder()
  const url = new URL(request.nextUrl)
  const prompt = url.searchParams.get('prompt') || ''
  const model = url.searchParams.get('model') || 'gpt-3.5-turbo'

  const openaiStream = await openai.chat.completions.create(
    {
      messages: [
        {
          content: prompt,
          role: 'user',
        },
      ],
      model,
      stream: true,
    },
  );
  (async () => {
    try {
      for await (const chunk of openaiStream) {
        const chunkText = chunk.choices[0]?.delta?.content || ''
        await writer.write(encoder.encode(`${chunkText}`))
      }
    }
    catch (error) {
      await writer.write(encoder.encode(`ERROR: ${error}`))
    }
    finally {
      await writer.close()
    }
  })()
  return new Response(responseStream.readable, {
    headers: {
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'Content-Type': 'text/event-stream; charset=utf-8',
    },
  })
}

/**
 * @swagger
 * /api/robot/chat:
 *   post:
 *     summary: 与 GPT 机器人聊天
 *     description: OpenAI 兼容接口，需要鉴权，登录用户可调用
 *     tags:
 *       - 机器人
 *     parameters:
 *      - name: model
 *        in: query
 *        description: 模型名称
 *        required: false
 *        type: string
 *        default: gpt-3.5-turbo
 *     responses:
 *       200:
 *         description: 流式数据 `text/event-stream`
 */
export async function POST(request: Request) {
  const { messages = [] }: Partial<{ messages: Array<any> }> = await request.json()
  const { model } = getParams(request)
  const PickMessages = messages.map((message) => {
    return {
      content: message.content,
      role: message.role,
    }
  })
  const response = await openai.chat.completions.create({
    messages: [...PickMessages],
    model: model ?? 'gpt-3.5-turbo',
    stream: true,
  })

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}
