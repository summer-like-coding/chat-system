import type { NextRequest } from 'next/server'

import { authOptions } from '@/lib/auth'
import { groupService } from '@/services/group'
import { Result } from '@/utils/result'
import { getServerSession } from 'next-auth'
import { getToken } from 'next-auth/jwt'

/**
 * 创建群组
 * @swagger
 * /api/groups/create:
 *   post:
 *     summary: 创建群组
 *     description: 需要鉴权，创建后自己成为群主，其他用户成为群成员，自动去重
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
    const session = await getServerSession(authOptions)
    if (!session) {
      return Result.error('未登录')
    }
    const token = await getToken({ req: request })
    const userId = token?.sub
    if (!userId) {
      return Result.error('未登录')
    }
    const { name, userIdList } = await request.json()
    if (
      !name || !(typeof name === 'string') || !(name.length > 20) || !(name.length < 2)
    ) {
      return Result.error('群组名称不合法，必须在 2-20 个字符之间')
    }
    if (!userIdList || !Array.isArray(userIdList) || userIdList.length < 1 || userIdList.length > 100) {
      return Result.error('用户 ID 列表不合法')
    }
    const res = await groupService.initializeGroup({ name }, userIdList, userId)
    return Result.success(groupService.asVo(res))
  }
  catch (error: any) {
    console.error('Error:', error)
    return Result.error(`错误: ${error.message}`)
  }
}
