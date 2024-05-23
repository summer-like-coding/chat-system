import type { PathIdParams } from '@/types/global'
import type { NextRequest } from 'next/server'

import { authOptions } from '@/lib/auth'
import { rabbitPublisher } from '@/lib/mq'
import { userGroupService } from '@/services/group'
import { messageService } from '@/services/message'
import { friendRoomService, groupRoomService, roomService } from '@/services/room'
import { Result } from '@/utils/result'
import { MessageType } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { getToken } from 'next-auth/jwt'

/**
 * 在房间中聊天
 * @swagger
 * /api/rooms/[id]/chat:
 *   post:
 *     summary: 在房间中聊天 @deprecated
 *     description: |
 *       **过时**：请使用更高效的 `POST /api/rooms/[id]/push` 接口。
 *       需要鉴权，房间成员可调用
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
    const userId = token?.sub
    if (!userId) {
      return Result.error('未登录')
    }

    const { id: roomId } = params
    const room = await roomService.getById(roomId, { isDeleted: false })
    if (!room) {
      return Result.error('未找到房间')
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

    // 如果是单聊
    if (room.type === 'FRIEND') {
      const friendRoom = await friendRoomService.getByRoomId(room.id)
      if (!friendRoom) {
        return Result.error('未找到单聊房间')
      }
      if (friendRoom.user1Id !== userId && friendRoom.user2Id !== userId) {
        return Result.error('无权限在此房间发送消息')
      }
    }
    // 如果是群聊
    if (room.type === 'GROUP') {
      const groupRoom = await groupRoomService.getByRoomId(room.id)
      if (!groupRoom) {
        return Result.error('未找到群聊房间')
      }
      const targetGroupId = groupRoom.groupId
      const userGroup = await userGroupService.checkIsGroupMember(targetGroupId, userId)
      if (!userGroup) {
        return Result.error('无权限在此房间发送消息')
      }
    }
    const message = await messageService.createMessage({
      content: room.type === 'GROUP' ? content : JSON.parse(JSON.parse(content).content),
      roomId: room.id,
      type,
      userId,
    })
    await rabbitPublisher.send('im-events', message)
    return Result.success(messageService.asVo(message))
  }
  catch (error: any) {
    console.error('Error:', error)
    return Result.error(`错误: ${error.message}`)
  }
}
