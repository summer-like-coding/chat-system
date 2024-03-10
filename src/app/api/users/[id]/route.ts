import { Result } from '@/lib/result'
import { userService } from '@/services/user'
import { NextResponse } from 'next/server'

/**
 * 查询用户信息
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await userService.getById(params.id)
    if (!user)
      return NextResponse.json(Result.error('User not found'))
    const result = {
      avatar: user.avatar,
      birthday: user.birthday,
      createdAt: user.createdAt,
      description: user.description,
      email: user.email,
      gender: user.gender,
      id: user.id,
      nickname: user.nickname,
      phone: user.phone,
      status: user.status,
      updatedAt: user.updatedAt,
      username: user.username,
    }
    return NextResponse.json(Result.success(result))
  }
  catch (e) {
    console.error('Error:', e)
    return NextResponse.json(Result.error('Internal Server Error'))
  }
}
