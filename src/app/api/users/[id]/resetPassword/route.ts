import type { PathIdParams } from '@/types/global'
import type { NextRequest } from 'next/server'

import { authOptions } from '@/lib/auth'
import { userService } from '@/services/user'
import { Result } from '@/utils/result'
import { getServerSession } from 'next-auth'
import { getToken } from 'next-auth/jwt'

/**
 * @swagger
 * definitions:
 *   UserResetPasswordBody:
 *     required:
 *      - oldPassword
 *      - newPassword
 *     properties:
 *       oldPassword:
 *         type: string
 *         description: 旧密码
 *       newPassword:
 *         type: string
 *         description: 新密码
 */

/**
 * 重置密码
 * @swagger
 * /api/resetPassword/:
 *   post:
 *     summary: 重置密码
 *     tags:
 *      - 用户
 *     parameters:
 *      - name: id
 *        in: path
 *        description: 用户 ID
 *        required: true
 *        type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/definitions/UserResetPasswordBody'
 *     responses:
 *       200:
 *         description: '`ResultType<UserVo>` 用户信息'
 */
export async function POST(request: NextRequest, { params }: PathIdParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return Result.error('未登录')
    }
    const token = await getToken({ req: request })
    if (token?.sub !== params.id) {
      return Result.error('无重置密码的权限')
    }
    const user = await userService.getById(params.id)
    if (!user)
      return Result.error('未找到用户')
    const { newPassword, oldPassword } = await request.json()
    const res = await userService.resetPassword(params.id, oldPassword, newPassword)
    if (res.error)
      return Result.error(res.error)
    return Result.success(userService.asVo(res.user))
  }
  catch (error) {
    console.error('Error:', error)
    return Result.error('未知错误')
  }
}
