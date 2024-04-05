import type { PathIdParams } from '@/types/global'
import type { NextRequest } from 'next/server'

import { authOptions } from '@/lib/auth'
import { roomService } from '@/services/room'
import { Result } from '@/utils/result'
import { getServerSession } from 'next-auth'
import { getToken } from 'next-auth/jwt'

/**
 * 拉取房间中的消息
 * @swagger
 * /api/rooms/[id]/pull/:
 *   get:
 *     summary: 拉取房间中的消息 @todo
 *     tags:
 *      - 房间
 *     parameters:
 *      - name: id
 *        in: path
 *        description: 房间 ID
 *        required: true
 *        type: string
 *     responses:
 *       200:
 *         description: '`ResultType<MessageVo>` 消息'
 */
export async function GET(request: NextRequest, { params }: PathIdParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return Result.error('未登录')
    }
    const token = await getToken({ req: request })
    if (!token)
      return Result.error('未登录')
    const room = await roomService.getById(params.id)
    if (!room)
      return Result.error('未找到房间')
  }
  catch (error) {
    console.error('Error:', error)
    return Result.error('未知错误')
  }
}
