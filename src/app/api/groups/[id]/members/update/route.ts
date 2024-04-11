import type { PathIdParams } from '@/types/global'
import type { NextRequest } from 'next/server'

import { authOptions } from '@/lib/auth'
import { userGroupService } from '@/services/group'
import { Result } from '@/utils/result'
import { getServerSession } from 'next-auth'
import { getToken } from 'next-auth/jwt'

/**
 * 更新群成员信息
 * @swagger
 * /api/groups/[id]/members/update:
 *   post:
 *     summary: 更新群成员信息，
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
 *       description: "`{ userId: string, groupRole?: 'ADMIN' | 'MEMBER', remark?: string }`"
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
 *                 description: 用户 ID
 *               groupRole:
 *                 type: string
 *                 description: 群角色
 *                 enum: [ADMIN, MEMBER]
 *               remark:
 *                 type: string
 *                 description: 备注
 *     responses:
 *       200:
 *         description: '`ResultType<UserGroupVo & { user: UserVo }>` 群成员'
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
    const { groupRole, remark, userId: targetId } = await request.json()
    if (typeof targetId !== 'string') {
      return Result.error('用户 ID 格式错误')
    }
    if (groupRole && groupRole !== 'ADMIN' && groupRole !== 'MEMBER') {
      return Result.error('群角色错误')
    }
    if (remark && typeof remark !== 'string') {
      return Result.error('备注格式错误')
    }
    if (!groupRole && !remark) {
      return Result.error('参数错误，至少需要一个字段')
    }
    const userGroup = await userGroupService.checkHasGroupPermission(groupId, userId)
    if (!userGroup) {
      return Result.error('无权限')
    }
    const userGroupResult = await userGroupService.updateGroupMember(groupId, targetId, groupRole, remark)
    return Result.success(userGroupService.asVo(userGroupResult))
  }
  catch (error: any) {
    console.error('Error:', error)
    return Result.error(`错误: ${error.message}`)
  }
}
