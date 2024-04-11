import type { NextRequest } from 'next/server'

import { authOptions } from '@/lib/auth'
import { groupService } from '@/services/group'
import { getPageParams } from '@/utils/params'
import { Result } from '@/utils/result'
import { getServerSession } from 'next-auth'

/**
 * 搜索群组
 * @swagger
 * /api/groups/search:
 *   post:
 *     summary: 搜索群组
 *     description: 需要鉴权，登录用户可调用
 *     tags:
 *      - 群组
 *     parameters:
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
 *     requestBody:
 *       description: '`{ keyword: string }`'
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - keyword
 *             properties:
 *               keyword:
 *                 type: string
 *                 description: 关键词
 *     responses:
 *       200:
 *         description: '`ResultType<GroupVo[]>` 群组列表'
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return Result.error('未登录')
    }
    const { keyword } = await request.json()
    const page = getPageParams(request)
    const res = await groupService.searchGroups(keyword, page)
    return Result.success(groupService.asVoList(res))
  }
  catch (error: any) {
    console.error('Error:', error)
    return Result.error(`错误: ${error.message}`)
  }
}
