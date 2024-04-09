import type { PathIdParams } from '@/types/global'
import type { MessageType } from '@prisma/client'
import type { NextRequest } from 'next/server'

import { authOptions } from '@/lib/auth'
import { messageService } from '@/services/message'
import { friendRoomService, groupRoomService, roomService } from '@/services/room'
import { Result } from '@/utils/result'
import { getServerSession } from 'next-auth'
import { getToken } from 'next-auth/jwt'

export interface MessageQueryType {
  content: string
  type: MessageType
}

async function createMessage(data: MessageQueryType, roomId: string, userId: string) {
  // 创建消息
  const message = await messageService.createMessage({
    content: data.content,
    roomId,
    type: data.type,
    userId,
  })

  // 更新消息日期
  await roomService.updateById(roomId, {
    lastMessageId: message.id,
    lastUpdatedAt: message.createdAt,
  })

  return message
}

/**
 * 在房间中聊天
 * @swagger
 * /api/rooms/[id]/chat:
 *   post:
 *     summary: 在房间中聊天 @todo
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
 *         description: '`ResultType<MessageVo>` 消息'
 */
export async function POST(request: NextRequest, { params }: PathIdParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return Result.error('未登录')
    }
    const token = await getToken({ req: request })
    if (!token)
      return Result.error('未登录')

    const { id: roomId } = params
    const room = await roomService.getById(roomId, { isDeleted: false })
    if (!room)
      return Result.error('未找到房间')
    const data: MessageQueryType = await request.json()

    // 创建消息
    const message = await createMessage(data, room.id, token.sub!)

    // 如果是单聊
    if (room.type === 'FRIEND') {
      const friendRoom = await friendRoomService.getByRoomId(room.id)
      if (!friendRoom)
        return Result.error('未找到单聊房间')
      const targetUserId = token?.sub === friendRoom.user1Id ? friendRoom.user2Id : friendRoom.user1Id
      console.warn('targetUserId:', targetUserId)

      // TODO: 消息队列推送消息，向 targetUserId 队列推送消息
    }
    // 如果是群聊
    if (room.type === 'GROUP') {
      const groupRoom = await groupRoomService.getByRoomId(room.id)
      if (!groupRoom)
        return Result.error('未找到群聊房间')
      const targetGroupId = groupRoom.groupId
      console.warn('targetGroupId:', targetGroupId)

      // TODO: 消息队列推送消息，向 targetGroupId 队列推送消息
    }

    return Result.success(messageService.asVo(message))
  }
  catch (error: any) {
    console.error('Error:', error)
    return Result.error(`错误: ${error.message}`)
  }
}
