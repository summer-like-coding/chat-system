import type { PathIdParams } from '@/types/global'
import type { NextRequest } from 'next/server'

import { authOptions } from '@/lib/auth'
import { friendService } from '@/services/friend'
import { userService } from '@/services/user'
import { getPageParams } from '@/utils/params'
import { Result } from '@/utils/result'
import { getServerSession } from 'next-auth'
import { getToken } from 'next-auth/jwt'

/**
 * 搜索用户好友列表
 * @swagger
 * /api/users/[id]/friends/search:
 *   post:
 *     summary: 搜索用户好友列表
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
 *     requestBody:
 *       description: '`{ keyword: string }`'
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - keyword
 *             properties:
 *               keyword:
 *                 type: string
 *                 description: 关键词
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
    const { id: userId } = params
    if (token?.sub !== userId) {
      return Result.error('无权限查询用户好友列表')
    }
    const { keyword } = await request.json()
    if (!(typeof keyword === 'string')) {
      return Result.error('关键词格式错误')
    }
    const page = getPageParams(request)
    const users = await friendService.searchFriends(userId, keyword, page)
    return Result.success(userService.asVoList(users))
  }
  catch (error: any) {
    console.error('Error:', error)
    return Result.error(`错误: ${error.message}`)
  }
}
