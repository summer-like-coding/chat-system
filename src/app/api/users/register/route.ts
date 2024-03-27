import type { NextRequest } from 'next/server'

import { userService } from '@/services/user'
import { Result } from '@/utils/result'

/**
 * 注册新用户
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const res = await userService.registerUser(data)
    if (res.error)
      return Result.error(res.error)
    return Result.success(userService.asVo(res.user))
  }
  catch (error) {
    console.error('Error:', error)
    return Result.error('未知错误')
  }
}
