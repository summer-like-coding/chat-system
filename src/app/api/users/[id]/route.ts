import type { PathIdParams } from '@/types/global'

import { userService } from '@/services/user'
import { Result } from '@/utils/result'

/**
 * 查询用户信息
 */
export async function GET(request: Request, { params }: PathIdParams) {
  try {
    const user = await userService.getById(params.id)
    if (!user)
      return Result.error('未找到用户')
    return Result.success(userService.asVo(user))
  }
  catch (e) {
    console.error('Error:', e)
    return Result.error('未知错误')
  }
}
