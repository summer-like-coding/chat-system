import type { NextRequest } from 'next/server'

import { openai } from '@/lib/openai'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

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
