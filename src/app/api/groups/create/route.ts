import type { NextRequest } from 'next/server'

import { groupService } from '@/services/group'
import { Result } from '@/utils/result'

/**
 * 创建群组
 * @swagger
 * /api/groups/create/:
 *   post:
 *     summary: 创建群组
 *     tags:
 *      - 群组
 *     requestBody:
 *       description: '`{ name: string, userIdList: string[] }`'
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - name
 *              - userIdList
 *             properties:
 *               name:
 *                 type: string
 *                 description: 群组名称
 *               userIdList:
 *                 type: object
 *                 description: 初始用户 ID 列表
 *     responses:
 *       200:
 *         description: '`ResultType<GroupVo>` 群组信息'
 */
export async function POST(request: NextRequest) {
  try {
    const { name, userIdList } = await request.json()
    const res = await groupService.initializeGroup({ name }, userIdList)
    return Result.success(groupService.asVo(res))
  }
  catch (error) {
    console.error('Error:', error)
    return Result.error('未知错误')
  }
}
