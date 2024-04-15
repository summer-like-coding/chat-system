import type { PathIdParams } from '@/types/global'
import type { NextRequest } from 'next/server'

import { REDIS_KEY_ROOM_USER_PREFIX } from '@/constants/settings'
import { authOptions } from '@/lib/auth'
import { rabbitPublisher } from '@/lib/mq'
import { redisClient } from '@/lib/redis'
import { hex2Buffer } from '@/utils/buffer'
import { Result } from '@/utils/result'
import { type Message, MessageType } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { getToken } from 'next-auth/jwt'
import { randomUUID } from 'node:crypto'

/**
 * 在房间中推送消息
 * @swagger
 * /api/rooms/[id]/push:
 *   post:
 *     summary: 在房间中聊天
 *     description: 需要鉴权，房间成员可调用
 *     tags:
 *      - 房间
 *     parameters:
 *      - name: id
 *        in: path
 *        description: 房间 ID
 *        required: true
 *        type: string
 *     requestBody:
 *       description: '`{ content: string, type: MessageType }`'
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/definitions/MessageBody'
 *     responses:
 *       200:
 *         description: '`ResultType<PartialMessageVo>` 消息'
 */
export async function POST(request: NextRequest, { params }: PathIdParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return Result.error('未登录')
    }
    const token = await getToken({ req: request })
    const userId = token?.sub
    const { id: roomId } = params
    if (!userId) {
      return Result.error('未登录')
    }
    const isMember = await redisClient.sIsMember(
      `${REDIS_KEY_ROOM_USER_PREFIX}${roomId}`,
      hex2Buffer(userId),
    )
    if (!isMember) {
      return Result.error('不是房间成员')
    }
    const { content, type } = await request.json()
    if (!type || ![
      MessageType.FILE,
      MessageType.IMAGE,
      MessageType.TEXT,
    ].includes(type)) {
      return Result.error('消息类型错误')
    }
    if (!content || !(typeof content === 'string')) {
      return Result.error('消息内容不能为空')
    }
    const uuid = randomUUID()
    const message: Pick<Message, 'content' | 'roomId' | 'type' | 'userId' | 'uuid'> = {
      content,
      roomId,
      type,
      userId,
      uuid,
    }
    await rabbitPublisher.send('im-events', message)
    return Result.success(message)
  }
  catch (error: any) {
    console.error('Error:', error)
    return Result.error(`错误: ${error.message}`)
  }
}
