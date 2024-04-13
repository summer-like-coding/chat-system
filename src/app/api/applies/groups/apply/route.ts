import type { NextRequest } from 'next/server'

import { authOptions } from '@/lib/auth'
import { groupApplyService } from '@/services/apply'
import { Result } from '@/utils/result'
import { getServerSession } from 'next-auth'
import { getToken } from 'next-auth/jwt'

/**
 * @swagger
 * /api/applies/groups/apply:
 *   post:
 *     summary: 申请加群 @deprecated
 *     description: |
 *       **过时**：使用 E2EE 的新接口 `POST /api/applies/e2ee/groups/apply`。
 *       需要鉴权，登录用户可申请加群
 *     tags:
 *      - 申请
 *     requestBody:
 *       description: '`{ groupId: string }`'
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - groupId
 *             properties:
 *               groupId:
 *                 type: string
 *                 description: 群组 ID
 *     responses:
 *       200:
 *         description: '`ResultType<GroupApplyVo>` 群组申请信息'
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return Result.error('未登录')
    }
    const { groupId } = await request.json()
    if (!groupId || !(typeof groupId === 'string')) {
      return Result.error('groupId 不能为空')
    }
    const token = await getToken({ req: request })
    const userId = token?.sub
    if (!userId) {
      return Result.error('未登录')
    }
    const apply = await groupApplyService.applyFor({
      groupId,
      userId,
    })
    return Result.success(groupApplyService.asVo(apply))
  }
  catch (error: any) {
    console.error('Error:', error)
    return Result.error(`错误: ${error.message}`)
  }
}
