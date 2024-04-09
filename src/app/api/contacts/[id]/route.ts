import type { PathIdParams } from '@/types/global'
import type { NextRequest } from 'next/server'

import { authOptions } from '@/lib/auth'
import { contactService } from '@/services/contact'
import { Result } from '@/utils/result'
import { getServerSession } from 'next-auth'
import { getToken } from 'next-auth/jwt'

/**
 * 查询联系信息
 * @swagger
 * /api/contacts/[id]:
 *   get:
 *     summary: 查询联系信息
 *     description: 需要鉴权，仅用户自己可查询
 *     tags:
 *      - 联系
 *     parameters:
 *      - name: id
 *        in: path
 *        description: 联系 ID
 *        required: true
 *        type: string
 *     responses:
 *       200:
 *         description: '`ResultType<ContactVo>` 联系信息'
 */
export async function GET(request: NextRequest, { params }: PathIdParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return Result.error('未登录')
    }
    const token = await getToken({ req: request })
    const userId = token?.sub
    const contact = await contactService.getById(params.id)
    if (!contact) {
      return Result.error('未找到联系信息')
    }
    if (contact.userId !== userId) {
      return Result.error('无权限查询联系信息')
    }
    return Result.success(contactService.asVo(contact))
  }
  catch (error: any) {
    console.error('Error:', error)
    return Result.error(`错误: ${error.message}`)
  }
}
