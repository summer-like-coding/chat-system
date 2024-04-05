import type { NextRequest } from 'next/server'

import { groupService } from '@/services/group'
import { getPageParams } from '@/utils/params'
import { Result } from '@/utils/result'

/**
 * 搜索群组
 * @swagger
 * /api/groups/search/:
 *   post:
 *     summary: 搜索群组
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
    const { keyword } = await request.json()
    const page = getPageParams(request)
    const res = await groupService.searchGroups(keyword, page)
    return Result.success(groupService.asVoList(res))
  }
  catch (error) {
    console.error('Error:', error)
    return Result.error('未知错误')
  }
}
