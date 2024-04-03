import type { NextRequest } from 'next/server'

import { authOptions } from '@/lib/auth'
import { userService } from '@/services/user'
import { Result } from '@/utils/result'
import { getServerSession } from 'next-auth'
/**
 * 根据用户名获取用户信息
 * @swagger
 * /api/getByUsername/:
 *   get:
 *     summary: 根据用户名获取用户信息
 *     tags:
 *      - 用户
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: 用户名
 *     responses:
 *       200:
 *         description: ResultType\<UserVo> 用户信息
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return Result.error('未登录')
    }
    const { username } = await request.json()
    const user = await userService.getUserByUsername(username)
    if (!user)
      return Result.error('未找到用户')
    return Result.success(userService.asVo(user))
  }
  catch (error) {
    console.error('Error:', error)
    return Result.error('未知错误')
  }
}
