import type { PathIdParams } from '@/types/global'
import type { NextRequest } from 'next/server'

import { authOptions } from '@/lib/auth'
import { groupService, userGroupService } from '@/services/group'
import { friendRoomService, groupRoomService, roomService } from '@/services/room'
import { Result } from '@/utils/result'
import { RoomType } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { getToken } from 'next-auth/jwt'

/**
 * 查询房间信息
 * @swagger
 * /api/rooms/[id]:
 *   get:
 *     summary: 查询房间信息
 *     description: 需要鉴权，仅有访问权限的用户可以查询
 *     tags:
 *      - 房间
 *     parameters:
 *      - name: id
 *        in: path
 *        description: 房间 ID
 *        required: true
 *        type: string
 *     responses:
 *       200:
 *         description: '`ResultType<RoomVo>` 房间信息'
 */
export async function GET(request: NextRequest, { params }: PathIdParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return Result.error('未登录')
    }
    const token = await getToken({ req: request })
    const userId = token?.sub
    const { id: roomId } = params
    const room = await roomService.getById(roomId, { isDeleted: false })
    if (!userId) {
      return Result.error('未登录')
    }
    if (!room) {
      return Result.error('房间不存在')
    }
    if (room.type === RoomType.FRIEND) {
      // 如果是单聊房间
      const friendRoom = await friendRoomService.getByRoomId(roomId)
      if (!friendRoom) {
        return Result.error('系统错误，房间不存在')
      }
      if (friendRoom.user1Id !== userId && friendRoom.user2Id !== userId) {
        return Result.error('无权访问')
      }
      return Result.success({
        ...roomService.asVo(room),
        friendRoom: friendRoomService.asVo(friendRoom),
      })
    }
    else if (room.type === RoomType.GROUP) {
      // 如果是群聊房间
      const groupRoom = await groupRoomService.getByRoomId(roomId)
      if (!groupRoom) {
        return Result.error('系统错误，房间不存在')
      }
      const userGroup = await groupService.checkIsGroupMember(groupRoom.groupId, userId)
      if (!userGroup) {
        return Result.error('无权访问')
      }
      return Result.success({
        ...roomService.asVo(room),
        groupRoom: groupRoomService.asVo(groupRoom),
        userGroup: userGroupService.asVo(userGroup),
      })
    }
    throw new Error('未知房间类型')
  }
  catch (error: any) {
    console.error('Error:', error)
    return Result.error(`错误: ${error.message}`)
  }
}
