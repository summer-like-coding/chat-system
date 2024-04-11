import type { NextRequest } from 'next/server'

import { authOptions } from '@/lib/auth'
import { contactService } from '@/services/contact'
import { groupService, userGroupService } from '@/services/group'
import { groupRoomService, roomService } from '@/services/room'
import { Result } from '@/utils/result'
import { getServerSession } from 'next-auth'
import { getToken } from 'next-auth/jwt'

/**
 * 准备群聊
 * @swagger
 * /api/contacts/groups/prepare:
 *   post:
 *     summary: 准备群聊
 *     description: |
 *       需要鉴权，仅群成员可调用。
 *       此接口用于保证 Contact 对象在聊天中存在，保证客户端能更新消息状态
 *     tags:
 *      - 联系
 *     requestBody:
 *       description: '`{ groupId: string }`'
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - groupId
 *             properties:
 *               groupId:
 *                 type: string
 *                 description: 群组 ID
 *     responses:
 *       200:
 *         description: '`ResultType<{ contact: ContactVo, group: GroupVo, room: RoomVo }>` 聊天初始化信息'
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
    const { groupId } = await request.json()
    if (!groupId || !(typeof groupId === 'string')) {
      return Result.error('群组 ID 不能为空')
    }
    const userGroup = await userGroupService.checkIsGroupMember(groupId, userId)
    if (!userGroup) {
      return Result.error('不是群成员')
    }
    const groupRoom = await groupRoomService.getByGroupId(groupId)
    if (!groupRoom) {
      return Result.error('系统错误，群房间不存在')
    }
    const contact = await contactService.prepareGroup(userId, groupId, groupRoom.roomId)
    return Result.success({
      contact: contactService.asVo(contact),
      group: groupService.asVo(groupRoom.group),
      room: roomService.asVo(groupRoom.room),
    })
  }
  catch (error: any) {
    console.error('Error:', error)
    return Result.error(`错误: ${error.message}`)
  }
}
