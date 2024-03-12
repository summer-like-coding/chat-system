import { userService } from '@/services/user'
import { Result } from '@/utils/result'

/**
 * 注册新用户
 */
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const res = await userService.registerUser(data)
    if (res.error)
      return Result.error(res.error)
    return Result.success(userService.asVo(res.user!))
  }
  catch (e) {
    console.error('Error:', e)
    return Result.error('Internal Server Error')
  }
}
