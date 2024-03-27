/**
 * 重置密码
 */
import type { PathIdParams } from '@/types/global'
import type { NextRequest } from 'next/server'

import { authOptions } from '@/lib/auth'
import { userService } from '@/services/user'
import { Result } from '@/utils/result'
import { getServerSession } from 'next-auth'
import { getToken } from 'next-auth/jwt'

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
