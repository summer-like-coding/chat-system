import type { PathIdParams } from '@/types/global'
import type { NextRequest } from 'next/server'

import { authOptions } from '@/lib/auth'
import { groupApplyService } from '@/services/apply'
import { userGroupService } from '@/services/group'
import { Result } from '@/utils/result'
import { getServerSession } from 'next-auth'
import { getToken } from 'next-auth/jwt'

/**
 * @swagger
 * /api/applies/groups/[id]:
 *   get:
 *     summary: 查询群申请信息
 *     description: 需要鉴权，只能查询自己的申请，或者是自己有权限的群组的申请
 *     tags:
 *      - 申请
 *     parameters:
 *      - name: id
 *        in: path
 *        description: 申请 ID
 *        required: true
 *        type: string
 *     responses:
 *       200:
 *         description: '`ResultType<GroupApplyVo & { group: GroupVo, user: UserVo }>` 申请信息'
 */
export async function GET(request: NextRequest, { params }: PathIdParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return Result.error('未登录')
    }
    const token = await getToken({ req: request })
    const userId = token?.sub
    const { id: groupApplyId } = params
    if (!userId || !groupApplyId) {
      return Result.error('参数错误')
    }

    const groupApply = await groupApplyService.getDetails(groupApplyId)
    if (!groupApply) {
      return Result.error('申请不存在')
    }
    const userGroupAdmin = await userGroupService.checkHasGroupPermission(groupApply.groupId, userId)
    if (groupApply.userId !== userId || !userGroupAdmin) {
      return Result.error('无权限')
    }
    return Result.success(groupApplyService.asVo(groupApply))
  }
  catch (error: any) {
    console.error('Error:', error)
    return Result.error(`错误: ${error.message}`)
  }
}
