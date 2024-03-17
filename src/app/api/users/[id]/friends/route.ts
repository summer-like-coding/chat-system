/**
 * 查询用户的好友列表
 */
import type { PathIdParams } from '@/types/global'
import type { NextRequest } from 'next/server'

import { authOptions } from '@/lib/auth'
import { friendService } from '@/services/friend'
import { userService } from '@/services/user'
import { getPageParams } from '@/utils/params'
import { Result } from '@/utils/result'
import { getServerSession } from 'next-auth'

export async function GET(request: NextRequest, { params }: PathIdParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return Result.error('未登录')
    }
    const page = getPageParams(request)
    const friends = await friendService.getFriends(params.id, page)
    return Result.success(userService.asVoList(friends))
  }
  catch (error) {
    console.error('Error:', error)
    return Result.error('未知错误')
  }
}
