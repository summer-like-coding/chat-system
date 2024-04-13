import type { PathIdParams } from '@/types/global'
import type { NextRequest } from 'next/server'

import { authOptions } from '@/lib/auth'
import { userGroupService } from '@/services/group'
import { messageService } from '@/services/message'
import { friendRoomService, groupRoomService, roomService } from '@/services/room'
import { Result } from '@/utils/result'
import { getServerSession } from 'next-auth'
import { getToken } from 'next-auth/jwt'

/**
 * 拉取房间中的消息
 * @swagger
 * /api/rooms/[id]/pull:
 *   post:
 *     summary: 拉取房间中的消息
 *     description: 需要鉴权，`back` 表示从后向前拉取，`forward` 表示从前向后拉取
 *     tags:
 *      - 房间
 *     parameters:
 *      - name: id
 *        in: path
 *        description: 房间 ID
 *        required: true
 *        type: string
 *     requestBody:
 *       description: "`{ time: number, type: 'previous' | 'new' }` 分别表示拉取时间戳和拉取类型"
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - time
 *              - type
 *             properties:
 *               time:
 *                 type: integer
 *                 description: 消息时间戳
 *               type:
 *                 type: string
 *                 description: 拉取类型
 *                 enum:
 *                  - back
 *                  - forward
 *     responses:
 *       200:
 *         description: '`ResultType<(MessageVo & { user: UserVo })[]>` 消息'
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
    const { time, type } = await request.json()
    if (!time || !['new', 'previous'].includes(type)) {
      return Result.error('参数错误')
    }

    const { id: roomId } = params
    const room = await roomService.getById(roomId, { isDeleted: false })
    if (!room) {
      return Result.error('未找到房间')
    }

    // 如果是单聊
    if (room.type === 'FRIEND') {
      const friendRoom = await friendRoomService.getByRoomId(room.id)
      if (!friendRoom) {
        return Result.error('未找到单聊房间')
      }
      if (friendRoom.user1Id !== userId && friendRoom.user2Id !== userId) {
        return Result.error('无权限在此房间拉取消息')
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
        return Result.error('无权限在此房间拉取消息')
      }
    }
    if (type === 'previous') {
      const messages = await messageService.pullPreviousMessages(roomId, time)
      return Result.success(messageService.asVoList(messages))
    }
    else {
      const messages = await messageService.pullNewMessages(roomId, time)
      return Result.success(messageService.asVoList(messages))
    }
  }
  catch (error: any) {
    console.error('Error:', error)
    return Result.error(`错误: ${error.message}`)
  }
}
