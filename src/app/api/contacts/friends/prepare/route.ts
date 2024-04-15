import type { NextRequest } from 'next/server'

import { authOptions } from '@/lib/auth'
import { contactService } from '@/services/contact'
import { friendService } from '@/services/friend'
import { friendRoomService, roomService } from '@/services/room'
import { Result } from '@/utils/result'
import { getServerSession } from 'next-auth'
import { getToken } from 'next-auth/jwt'

/**
 * 准备与好友聊天
 * @swagger
 * /api/contacts/friends/prepare:
 *   post:
 *     summary: 准备与好友聊天
 *     description: |
 *       需要鉴权，仅用户自己可调用。
 *       此接口用于保证 Contact 对象在聊天中存在，保证客户端能更新消息状态
 *     tags:
 *      - 联系
 *     requestBody:
 *       description: '`{ userId: string }`'
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: 好友 ID
 *     responses:
 *       200:
 *         description: '`ResultType<{ contact: ContactVo, friend: UserVo, room: RoomVo }>` 聊天初始化信息'
 */
export async function POST(request: NextRequest) {
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
    const { userId: friendId } = await request.json()
    if (!friendId || !(typeof friendId === 'string')) {
      return Result.error('好友 ID 不能为空')
    }
    const friend = await friendService.checkIsFriend(userId, friendId)
    if (!friend) {
      return Result.error('好友不存在')
    }
    const friendRoom = await friendRoomService.getByFriendTupleId(userId, friendId)
    if (!friendRoom) {
      return Result.error('系统错误，好友房间不存在')
    }
    const room = friendRoom.room
    const contact = await contactService.prepareFriend(userId, friendId, room.id)
    return Result.success({
      contact: contactService.asVo(contact),
      friend: friendService.asVo(friend),
      room: roomService.asVo(room),
    })
  }
  catch (error: any) {
    console.error('Error:', error)
    return Result.error(`错误: ${error.message}`)
  }
}
