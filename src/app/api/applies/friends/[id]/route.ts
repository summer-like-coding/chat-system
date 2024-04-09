import type { PathIdParams } from '@/types/global'
import type { NextRequest } from 'next/server'

import { authOptions } from '@/lib/auth'
import { friendApplyService } from '@/services/apply'
import { Result } from '@/utils/result'
import { getServerSession } from 'next-auth'
import { getToken } from 'next-auth/jwt'

/**
 * @swagger
 * /api/applies/friends/[id]:
 *   get:
 *     summary: 查询好友申请信息
 *     description: 需要鉴权，只有申请人和被申请人才有权限查询
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
 *         description: '`ResultType<FriendApplyVo & { target: UserVo, user: UserVo }>` 申请信息'
 */
export async function GET(request: NextRequest, { params }: PathIdParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return Result.error('未登录')
    }
    const token = await getToken({ req: request })

    const apply = await friendApplyService.getDetails(params.id)
    if (!apply) {
      return Result.error('未找到申请')
    }

    if (token?.sub !== apply.userId && token?.sub !== apply.targetId) {
      return Result.error('无权限查询用户申请记录')
    }
    return Result.success(friendApplyService.asVo(apply))
  }
  catch (error: any) {
    console.error('Error:', error)
    return Result.error(`错误: ${error.message}`)
  }
}
