/**
 * 查询用户对话信息
 */
import type { PathIdParams } from '@/types/global'
import type { NextRequest } from 'next/server'

import { authOptions } from '@/lib/auth'
import { contactService } from '@/services/contact'
import { getPageParams } from '@/utils/params'
import { Result } from '@/utils/result'
import { getServerSession } from 'next-auth'
import { getToken } from 'next-auth/jwt'

export async function GET(request: NextRequest, { params }: PathIdParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return Result.error('未登录')
    }
    const token = await getToken({ req: request })
    if (token?.sub !== params.id) {
      return Result.error('无权限查询用户对话信息')
    }
    const page = getPageParams(request)
    const contacts = await contactService.getByUserId(params.id, page)
    return Result.success(contactService.asVoList(contacts))
  }
  catch (error) {
    console.error('Error:', error)
    return Result.error('未知错误')
  }
}
