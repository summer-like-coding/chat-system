import type { PathIdParams } from '@/types/global'
import type { NextRequest } from 'next/server'

import { authOptions } from '@/lib/auth'
import { groupService } from '@/services/group'
import { Result } from '@/utils/result'
import { getServerSession } from 'next-auth'

/**
 * 查询群组信息
 * @swagger
 * /api/groups/[id]/:
 *   get:
 *     summary: 查询群组信息
 *     tags:
 *      - 群组
 *     parameters:
 *      - name: id
 *        in: path
 *        description: 群组 ID
 *        required: true
 *        type: string
 *     responses:
 *       200:
 *         description: '`ResultType<GroupVo>` 群组信息'
 */
export async function GET(request: NextRequest, { params }: PathIdParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return Result.error('未登录')
    }
    const group = await groupService.getById(params.id)
    if (!group)
      return Result.error('未找到群组')
    return Result.success(groupService.asVo(group))
  }
  catch (error) {
    console.error('Error:', error)
    return Result.error('未知错误')
  }
}
