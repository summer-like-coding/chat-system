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
 * /api/applies/groups/[id]/audit:
 *   post:
 *     summary: 处理群申请
 *     description: 需要鉴权，仅群管理员或群主可处理申请
 *     tags:
 *      - 申请
 *     parameters:
 *      - name: id
 *        in: path
 *        description: 申请 ID
 *        required: true
 *        type: string
 *     requestBody:
 *       description: "`{ opinion: 'accept' | 'reject' | 'ignore' }`"
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - opinion
 *             properties:
 *               opinion:
 *                 type: string
 *                 description: 意见
 *                 enum:
 *                  - accept
 *                  - reject
 *                  - ignore
 *     responses:
 *       200:
 *         description: '`ResultType<FriendApplyVo>` 好友申请信息'
 */
export async function POST(request: NextRequest, { params }: PathIdParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return Result.error('未登录')
    }
    const { opinion } = await request.json()
    if (!opinion || !['accept', 'ignore', 'reject'].includes(opinion)) {
      return Result.error('参数错误')
    }
    const { id: applyId } = params
    const token = await getToken({ req: request })
    const userId = token?.sub
    if (!userId) {
      return Result.error('未登录')
    }
    const groupApply = await groupApplyService.getById(applyId, { isDeleted: false })
    if (!groupApply) {
      return Result.error('申请不存在')
    }
    const userGroup = await userGroupService.checkHasGroupPermission(userId, userId)
    if (!userGroup) {
      return Result.error('无权处理该申请')
    }

    if (opinion === 'accept') {
      const { groupApply } = await groupApplyService.accept(applyId)
      return Result.success(groupApplyService.asVo(groupApply))
    }
    else if (opinion === 'reject') {
      const { groupApply } = await groupApplyService.reject(applyId)
      return Result.success(groupApplyService.asVo(groupApply))
    }
    else {
      const { groupApply } = await groupApplyService.reject(applyId, 'IGNORED')
      return Result.success(groupApplyService.asVo(groupApply))
    }
  }
  catch (error: any) {
    console.error('Error:', error)
    return Result.error(`错误: ${error.message}`)
  }
}
