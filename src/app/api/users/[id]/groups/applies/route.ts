import type { PathIdParams } from '@/types/global'
import type { ApplyStatusType } from '@prisma/client'
import type { NextRequest } from 'next/server'

import { authOptions } from '@/lib/auth'
import { groupApplyService } from '@/services/apply'
import { getPageParams, getParams } from '@/utils/params'
import { Result } from '@/utils/result'
import { getServerSession } from 'next-auth'
import { getToken } from 'next-auth/jwt'

/**
 * @swagger
 * /api/users/[id]/groups/applies:
 *   get:
 *     summary: 查询用户的群申请记录
 *     description: 需要鉴权，只有用户自己才有权限查询
 *     tags:
 *      - 用户
 *     parameters:
 *      - name: id
 *        in: path
 *        description: 用户 ID
 *        required: true
 *        type: string
 *      - name: page
 *        in: query
 *        description: 页码
 *        required: false
 *        type: integer
 *        default: 1
 *      - name: size
 *        in: query
 *        description: 每页数量
 *        required: false
 *        type: integer
 *        default: 10
 *      - name: status
 *        in: query
 *        description: "`'PENDING' | 'ACCEPTED' | 'REJECTED' | 'IGNORED'` 申请状态，默认为全部"
 *        required: false
 *        type: string
 *        default: ''
 *        enum:
 *         - PENDING
 *         - ACCEPTED
 *         - REJECTED
 *     responses:
 *       200:
 *         description: '`ResultType<(GroupApplyVo & { group: GroupVo })[]>` 用户的申请记录'
 */
export async function GET(request: NextRequest, { params }: PathIdParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return Result.error('未登录')
    }
    const token = await getToken({ req: request })
    const { id: userId } = params
    if (token?.sub !== userId) {
      return Result.error('无权限查询用户申请记录')
    }
    const page = getPageParams(request)
    const { status } = getParams(request)

    if (status && !['ACCEPTED', 'IGNORED', 'PENDING', 'REJECTED'].includes(status.toUpperCase())) {
      return Result.error('申请状态错误')
    }

    const applies = await groupApplyService.getAppliesByUserId(
      userId,
      page,
      (status && status.toUpperCase()) as ApplyStatusType,
    )
    return Result.success(groupApplyService.asVoList(applies))
  }
  catch (error: any) {
    console.error('Error:', error)
    return Result.error(`错误: ${error.message}`)
  }
}
