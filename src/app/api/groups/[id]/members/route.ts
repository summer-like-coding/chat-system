import type { PathIdParams } from '@/types/global'
import type { NextRequest } from 'next/server'

import { authOptions } from '@/lib/auth'
import { groupService, userGroupService } from '@/services/group'
import { getPageParams } from '@/utils/params'
import { Result } from '@/utils/result'
import { getServerSession } from 'next-auth'

/**
 * 查询群组成员
 * @swagger
 * /api/groups/[id]/members:
 *   get:
 *     summary: 查询群组成员
 *     description: 需要鉴权，登录用户可调用
 *     tags:
 *      - 群组
 *     parameters:
 *      - name: id
 *        in: path
 *        description: 用户 ID
 *        required: true
 *      - name: page
 *        in: query
 *        description: 页码
 *        required: false
 *        type: integer
 *        default: 1
 *      - name: size
 *        in: query
 *        description: 每页数量
 *        required: false
 *        type: integer
 *        default: 10
 *     responses:
 *       200:
 *         description: '`ResultType<(UserGroup & { user: UserVo })[]>` 用户列表'
 */
export async function GET(request: NextRequest, { params }: PathIdParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return Result.error('未登录')
    }
    const { id: groupId } = params
    const group = await groupService.getById(groupId, { isDeleted: false })
    if (!group) {
      return Result.error('群组不存在')
    }
    const page = getPageParams(request)
    const members = await userGroupService.getMembers(groupId, page)
    return Result.success(userGroupService.asVoList(members))
  }
  catch (error: any) {
    console.error('Error:', error)
    return Result.error(`错误: ${error.message}`)
  }
}
