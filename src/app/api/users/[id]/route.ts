import type { PathIdParams } from '@/types/global'
import type { NextRequest } from 'next/server'

import { authOptions } from '@/lib/auth'
import { userService } from '@/services/user'
import { Result } from '@/utils/result'
import { getServerSession } from 'next-auth'

/**
 * 查询用户信息
 * @swagger
 * /api/users/[id]/:
 *   get:
 *     summary: 查询用户信息
 *     tags:
 *      - 用户
 *     parameters:
 *      - name: id
 *        in: path
 *        description: 用户 ID
 *        required: true
 *        type: string
 *     responses:
 *       200:
 *         description: ResultType\<UserVo> 用户信息
 */
export async function GET(request: NextRequest, { params }: PathIdParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return Result.error('未登录')
    }
    const user = await userService.getById(params.id)
    if (!user)
      return Result.error('未找到用户')
    return Result.success(userService.asVo(user))
  }
  catch (error) {
    console.error('Error:', error)
    return Result.error('未知错误')
  }
}
