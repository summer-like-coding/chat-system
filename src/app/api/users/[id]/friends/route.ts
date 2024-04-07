/**
 * 查询用户的好友列表
 */
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
 * 查询用户的好友列表
 * @swagger
 * /api/users/[id]/friends/:
 *   get:
 *     summary: 查询用户的好友列表
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
 *         description: '`ResultType<Friends[]>` 用户的好友列表'
 */
export async function GET(request: NextRequest, { params }: PathIdParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return Result.error('未登录')
    }
    const token = await getToken({ req: request })
    if (token?.sub !== params.id) {
      return Result.error('无权限查询用户好友列表')
    }
    const page = getPageParams(request)
    const friends = await friendService.getFriends(params.id, page)
    return Result.success(userService.asVoList(friends))
  }
  catch (error) {
    console.error('Error:', error)
    return Result.error('未知错误')
  }
}
