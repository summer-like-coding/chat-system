import type { PathIdParams } from '@/types/global'
import type { NextRequest } from 'next/server'

import { authOptions } from '@/lib/auth'
import { groupApplyService } from '@/services/apply'
import { Result } from '@/utils/result'
import { getServerSession } from 'next-auth'
import { getToken } from 'next-auth/jwt'

/**
 * @swagger
 * /api/applies/groups/[id]/audit:
 *   post:
 *     summary: 处理群申请 @todo
 *     description: 需要鉴权，仅群管理员可处理申请
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
 *                 description: 关键词
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
    const _userId = token?.sub

    const _groupApply = await groupApplyService.getById(applyId, { isDeleted: false })
    // doing
  }
  catch (error: any) {
    console.error('Error:', error)
    return Result.error(`错误: ${error.message}`)
  }
}
