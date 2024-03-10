import { Result } from '@/lib/result'
import { userService } from '@/services/user'
import { NextResponse } from 'next/server'

/**
 * 查询用户联系信息
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await userService.getById(params.id)
    if (!user)
      return NextResponse.json(Result.error('User not found'))
  }
  catch (e) {
  }
}
