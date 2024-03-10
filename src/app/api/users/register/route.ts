import { Result } from '@/lib/result'
import { userService } from '@/services/user'
import { NextResponse } from 'next/server'

/**
 * 注册新用户
 */
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const res = await userService.registerUser(data)
    if (res.error)
      return NextResponse.json(Result.error(res.error))
    return NextResponse.json(Result.success(res.user))
  }
  catch (e) {
    console.error('Error:', e)
    return NextResponse.json(Result.error('Internal Server Error'))
  }
}
