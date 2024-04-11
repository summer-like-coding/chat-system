import type { PathIdParams } from '@/types/global'
import type { NextRequest } from 'next/server'

import { authOptions } from '@/lib/auth'
import { userGroupService } from '@/services/group'
import { userService } from '@/services/user'
import { Result } from '@/utils/result'
import { getServerSession } from 'next-auth'
import { getToken } from 'next-auth/jwt'

/**
 * 移除群组成员
 * @swagger
 * /api/groups/[id]/members/remove:
 *   post:
 *     summary: 向群组移除成员
 *     description: 需要鉴权，仅群管理员或群主可调用
 *     tags:
 *      - 群组
 *     parameters:
 *      - name: id
 *        in: path
 *        description: 群组 ID
 *        required: true
 *        type: string
 *     requestBody:
 *       description: '`{ userIdList: string[] }`'
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - userIdList
 *             properties:
 *               userIdList:
 *                 type: string
 *                 description: 用户 ID 列表
 *     responses:
 *       200:
 *         description: '`ResultType<UserVo[]>` 用户列表'
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
    const { id: groupId } = params
    const { userIdList } = await request.json()
    if (
      !userIdList
      || !Array.isArray(userIdList)
      || userIdList.length === 0
      || userIdList.length > 100
      || userIdList.some(userId => typeof userId !== 'string')) {
      return Result.error('参数错误')
    }
    const userGroup = await userGroupService.checkHasGroupPermission(groupId, userId)
    if (!userGroup) {
      return Result.error('无权限')
    }
    if (userIdList.includes(userId)) {
      return Result.error('不能移除自己')
    }
    const users = await userGroupService.removeGroupMembers(groupId, userIdList)
    return Result.success(userService.asVoList(users))
  }
  catch (error: any) {
    console.error('Error:', error)
    return Result.error(`错误: ${error.message}`)
  }
}
