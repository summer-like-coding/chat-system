import type { PathIdParams } from '@/types/global'
import type { NextRequest } from 'next/server'

import { authOptions } from '@/lib/auth'
import { groupService, userGroupService } from '@/services/group'
import { Result } from '@/utils/result'
import { getServerSession } from 'next-auth'
import { getToken } from 'next-auth/jwt'

/**
 * @swagger
 * definitions:
 *   GroupBody:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *         description: 群组名称
 *       avatar:
 *         type: string
 *         description: 群组头像
 *       description:
 *         type: string
 *         description: 群组描述
 */

/**
 * 更新群组信息
 * @swagger
 * /api/groups/[id]/update:
 *   post:
 *     summary: 更新群组信息
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
 *       description: '`{ name?: string, avatar?: string, description?: string }`'
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/definitions/GroupBody'
 *     responses:
 *       200:
 *         description: '`ResultType<GroupVo>` 群组信息'
 */
export async function POST(request: NextRequest, { params }: PathIdParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return Result.error('未登录')
    }
    const { id: groupId } = params
    const token = await getToken({ req: request })
    const userId = token?.sub
    if (!userId || !groupId) {
      return Result.error('参数错误')
    }
    const group = await groupService.getById(groupId, { isDeleted: false })
    if (!group) {
      return Result.error('群组不存在')
    }
    const userGroup = await userGroupService.checkHasGroupPermission(groupId, userId)
    if (!userGroup) {
      return Result.error('无权限')
    }
    const { avatar, description, name } = await request.json()
    const result = await groupService.updateGroup(groupId, { avatar, description, name })
    return Result.success(groupService.asVo(result))
  }
  catch (error: any) {
    console.error('Error:', error)
    return Result.error(`错误: ${error.message}`)
  }
}
