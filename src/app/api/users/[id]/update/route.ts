import type { PathIdParams } from '@/types/global'
import type { NextRequest } from 'next/server'

import { authOptions } from '@/lib/auth'
import { userService } from '@/services/user'
import { Result } from '@/utils/result'
import { getServerSession } from 'next-auth'
import { getToken } from 'next-auth/jwt'

/**
 * 更新用户信息
 * @swagger
 * /api/users/[id]/update/:
 *   post:
 *     summary: 更新用户信息
 *     tags:
 *      - 用户
 *     parameters:
 *      - name: id
 *        in: path
 *        description: 用户 ID
 *        required: true
 *        type: string
 *     requestBody:
 *       description: |
 *        `{
 *          avatar?: string,
 *          birthday?: string,
 *          description?: string,
 *          email?: string,
 *          gender?: string,
 *          nickname?: string,
 *          phone?: string
 *         }`
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/definitions/UserBody'
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
    const user = await userService.getById(params.id)
    if (!user)
      return Result.error('未找到用户')
    const token = await getToken({ req: request })
    if (token?.sub !== params.id) {
      return Result.error('无权限查询用户信息')
    }
    const { avatar, birthday, description, email, gender, nickname, phone } = await request.json()
    const res = await userService.updateById(params.id, {
      avatar,
      birthday: birthday ? new Date(birthday) : undefined,
      description,
      email,
      gender,
      nickname,
      phone,
    })
    return Result.success(userService.asVo(res))
  }
  catch (error) {
    console.error('Error:', error)
    return Result.error('未知错误')
  }
}
