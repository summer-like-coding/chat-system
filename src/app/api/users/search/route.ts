import type { NextRequest } from 'next/server'

import { authOptions } from '@/lib/auth'
import { userService } from '@/services/user'
import { getPageParams } from '@/utils/params'
import { Result } from '@/utils/result'
import { getServerSession } from 'next-auth'

/**
 * 搜索用户
 * @swagger
 * /api/users/search:
 *   post:
 *     summary: 搜索用户
 *     description: 需要鉴权，登录用户可请求
 *     tags:
 *      - 用户
 *     parameters:
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
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return Result.error('未登录')
    }
    const { keyword } = await request.json()
    if (!(typeof keyword === 'string')) {
      return Result.error('关键词格式错误')
    }
    const page = getPageParams(request)
    const res = await userService.searchUsers(keyword, page)
    return Result.success(userService.asVoList(res))
  }
  catch (error: any) {
    console.error('Error:', error)
    return Result.error(`错误: ${error.message}`)
  }
}
