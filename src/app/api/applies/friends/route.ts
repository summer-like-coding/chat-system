import type { NextRequest } from 'next/server'

import { authOptions } from '@/lib/auth'
import { friendApplyService } from '@/services/apply'
import { Result } from '@/utils/result'
import { getServerSession } from 'next-auth'
import { getToken } from 'next-auth/jwt'

/**
 * @swagger
 * definitions:
 *  AppliesFriendsBody:
 *   type: object
 *   required:
 *    - targetId
 *    - userId
 *   properties:
 *     targetId:
 *       type: string
 *       description: 目标用户 ID
 *     userId:
 *       type: string
 *       description: 用户 ID
 *     type:
 *       type: string
 *       description: 申请类型
 *     reason:
 *       type: string
 *       description: 申请理由
 *     selfRemark:
 *       type: string
 *       description: 自己的备注
 *     answer:
 *       type: string
 *       description: 回复
 */

/**
 * @swagger
 * /api/applies/friends/:
 *   post:
 *     summary: 申请加好友 @todo
 *     tags:
 *      - 申请
 *     requestBody:
 *       description: |
 *        `{
 *          targetId: string,
 *          userId: string,
 *          type?: string,
 *          reason?: string,
 *          selfRemark?: string,
 *          answer?: string
 *        }`
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/definitions/AppliesFriendsBody'
 *     responses:
 *       200:
 *         description: '`ResultType<ApplyVo>` 申请信息'
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return Result.error('未登录')
    }
    const {
      answer,
      reason,
      selfRemark,
      targetId,
      type,
      userId,
    } = await request.json()
    if (!userId || !targetId) {
      return Result.error('参数错误，缺少 userId 或 targetId')
    }
    const token = await getToken({ req: request })
    if (token?.sub !== userId) {
      return Result.error('无权限添加好友')
    }
    const apply = await friendApplyService.applyFor({
      answer,
      reason,
      selfRemark,
      targetId,
      type,
      userId,
    })
    return Result.success(apply)
  }
  catch (error: any) {
    console.error('Error:', error)
    return Result.error(`错误: ${error.message}`)
  }
}
