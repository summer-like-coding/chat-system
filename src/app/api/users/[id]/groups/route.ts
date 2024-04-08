import type { PathIdParams } from '@/types/global'
import type { NextRequest } from 'next/server'

import { authOptions } from '@/lib/auth'
import { groupService, userGroupService } from '@/services/group'
import { getPageParams } from '@/utils/params'
import { Result } from '@/utils/result'
import { getServerSession } from 'next-auth'
import { getToken } from 'next-auth/jwt'

/**
 * 查询用户的群聊列表
 * @swagger
 * /api/users/[id]/groups/:
 *   get:
 *     summary: 查询用户的好友列表
 *     description: 需要鉴权，仅用户自己可查询
 *     tags:
 *      - 用户
 *     parameters:
 *      - name: id
 *        in: path
 *        description: 用户 ID
 *        required: true
 *        type: string
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
 *         description: '`ResultType<Group[]>` 用户的好友列表'
 */
export async function GET(request: NextRequest, { params }: PathIdParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return Result.error('未登录')
    }
    const token = await getToken({ req: request })
    const { id: userId } = params
    if (token?.sub !== userId) {
      return Result.error('无权限查询用户好友列表')
    }
    const page = getPageParams(request)
    const groups = await userGroupService.getByUsername(userId, page)
    return Result.success(groupService.asVoList(groups))
  }
  catch (error: any) {
    console.error('Error:', error)
    return Result.error(`错误: ${error.message}`)
  }
}
