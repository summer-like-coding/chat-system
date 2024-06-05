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
 * /api/users/resetPassword:
 *   post:
 *     summary: 重置密码
 *     description: 需要鉴权，仅用户自己可重置
 *     tags:
 *      - 用户
 *     parameters:
 *      - name: id
 *        in: path
 *        description: 用户 ID
 *        required: true
 *        type: string
 *     requestBody:
 *       description: '`{ oldPassword: string, newPassword: string }`'
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

    const { id: userId } = params
    const user = await userService.getById(userId, { isDeleted: false })
    if (!user) {
      return Result.error('未找到用户')
    }
    const { newPassword, oldPassword } = await request.json()
    if (!(typeof newPassword === 'string') || (
      !/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[^\da-zA-Z\s]).{8,20}$/.test(newPassword)
    )) {
      return Result.error('密码不符合规范，请使用 8-20 位字符，包含数字、字母和特殊字符')
    }
    const res = await userService.resetPassword(params.id, oldPassword, newPassword)
    return Result.success(userService.asVo(res))
  }
  catch (error: any) {
    console.error('Error:', error)
    return Result.error(`错误: ${error.message}`)
  }
}
