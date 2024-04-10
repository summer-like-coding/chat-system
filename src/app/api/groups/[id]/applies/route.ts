import type { PathIdParams } from '@/types/global'
import type { ApplyStatusType } from '@prisma/client'
import type { NextRequest } from 'next/server'

import { authOptions } from '@/lib/auth'
import { groupApplyService } from '@/services/apply'
import { groupService, userGroupService } from '@/services/group'
import { getPageParams, getParams } from '@/utils/params'
import { Result } from '@/utils/result'
import { getServerSession } from 'next-auth'
import { getToken } from 'next-auth/jwt'

/**
 * 查询群组申请列表
 * @swagger
 * /api/groups/[id]/applies:
 *   get:
 *     summary: 查询群组申请列表
 *     tags:
 *      - 群组
 *     parameters:
 *      - name: id
 *        in: path
 *        description: 群组 ID
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
 *         description: '`ResultType<(GroupApplyVo & { user: UserVo })[]>` 群组申请列表'
 */
export async function GET(request: NextRequest, { params }: PathIdParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return Result.error('未登录')
    }
    const { id: groupId } = params
    if (!groupId) {
      return Result.error('参数错误')
    }
    const token = await getToken({ req: request })
    const userId = token?.sub
    if (!userId) {
      return Result.error('未登录')
    }
    const page = getPageParams(request)
    const { status } = getParams(request)
    if (status && !['ACCEPTED', 'IGNORED', 'PENDING', 'REJECTED'].includes(status.toUpperCase())) {
      return Result.error('申请状态错误')
    }

    const group = await groupService.getById(groupId, { isDeleted: false })
    if (!group) {
      return Result.error('群组不存在')
    }
    const userGroup = await userGroupService.checkHasGroupPermission(groupId, userId)
    if (!userGroup) {
      return Result.error('无权查看该群组申请')
    }

    const applies = await groupApplyService.getByGroupId(
      groupId,
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
