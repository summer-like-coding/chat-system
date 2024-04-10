import type { PathIdParams } from '@/types/global'
import type { NextRequest } from 'next/server'

import { authOptions } from '@/lib/auth'
import { friendApplyService } from '@/services/apply'
import { Result } from '@/utils/result'
import { getServerSession } from 'next-auth'
import { getToken } from 'next-auth/jwt'

/**
 * @swagger
 * /api/applies/friends/[id]/audit:
 *   post:
 *     summary: 处理好友申请
 *     description: 需要鉴权，仅用户自己可处理申请
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
 *         description: '`ResultType<FriendApplyVo & { user: UserVo, target: UserVo }>` 好友申请信息'
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

    const friendApply = await friendApplyService.getById(applyId, { isDeleted: false })
    if (!friendApply) {
      return Result.error('未找到好友申请')
    }
    if (friendApply.targetId !== userId) {
      return Result.error('无权处理该申请')
    }

    if (opinion === 'accept') {
      // 处理同意申请
      const { friendApply } = await friendApplyService.accept(applyId)
      return Result.success(friendApplyService.asVo(friendApply))
    }
    else if (opinion === 'reject') {
      // 处理拒绝申请
      const { friendApply } = await friendApplyService.reject(applyId)
      return Result.success(friendApplyService.asVo(friendApply))
    }
    else {
      // 处理忽略申请
      const { friendApply } = await friendApplyService.reject(applyId, 'IGNORED')
      return Result.success(friendApplyService.asVo(friendApply))
    }
  }
  catch (error: any) {
    console.error('Error:', error)
    return Result.error(`错误: ${error.message}`)
  }
}
