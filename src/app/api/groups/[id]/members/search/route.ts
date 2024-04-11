import type { PathIdParams } from '@/types/global'
import type { NextRequest } from 'next/server'

import { authOptions } from '@/lib/auth'
import { userGroupService } from '@/services/group'
import { userService } from '@/services/user'
import { getPageParams } from '@/utils/params'
import { Result } from '@/utils/result'
import { getServerSession } from 'next-auth'

/**
 * 搜索群组成员
 * @swagger
 * /api/groups/[id]/members/search:
 *   post:
 *     summary: 搜索群组成员
 *     description: 需要鉴权，登录用户可调用
 *     tags:
 *      - 群组
 *     parameters:
 *      - name: id
 *        in: path
 *        description: 群组 ID
 *        required: true
 *        type: string
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
 *         description: '`ResultType<UserVo[]>` 用户列表'
 */
export async function GET(request: NextRequest, { params }: PathIdParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return Result.error('未登录')
    }
    const { id: groupId } = params
    const page = getPageParams(request)
    const { keyword } = await request.json()
    if (typeof keyword !== 'string') {
      return Result.error('关键词格式错误')
    }
    const users = await userGroupService.searchMembers(groupId, keyword, page)
    return Result.success(userService.asVoList(users))
  }
  catch (error: any) {
    console.error('Error:', error)
    return Result.error(`错误: ${error.message}`)
  }
}
