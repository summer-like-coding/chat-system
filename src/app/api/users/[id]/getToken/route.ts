import type { PathIdParams } from '@/types/global'
import type { NextRequest } from 'next/server'

import { authOptions } from '@/lib/auth'
import { userService } from '@/services/user'
import { Result } from '@/utils/result'
import { getServerSession } from 'next-auth'
import { getToken } from 'next-auth/jwt'

/**
 * 获取用户 Token
 * @swagger
 * /api/users/[id]/getToken:
 *   get:
 *     summary: 获取用户 Token
 *     description: 用于连接 Socket.IO 等外部模块的鉴权。需要鉴权，仅用户自己可操作
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
 *         description: '`ResultType<{ token: string }>` Token 信息'
 */
export async function GET(request: NextRequest, { params }: PathIdParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return Result.error('未登录')
    }
    const token = await getToken({ req: request })
    const userId = token?.sub
    if (!userId || userId !== params.id) {
      return Result.error('无权限')
    }
    const userToken = await userService.genToken(userId)
    return Result.success({ token: userToken })
  }
  catch (error: any) {
    console.error('Error:', error)
    return Result.error(`错误: ${error.message}`)
  }
}
