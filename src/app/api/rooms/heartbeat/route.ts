import type { NextRequest } from 'next/server'

import { REDIS_KEY_HEARTBEAT_EXPIRE, REDIS_KEY_HEARTBEAT_PREFIX } from '@/constants/settings'
import { authOptions } from '@/lib/auth'
import { redisClient } from '@/lib/redis'
import { Result } from '@/utils/result'
import { getServerSession } from 'next-auth'
import { getToken } from 'next-auth/jwt'

/**
 * 发送心跳信息
 * @swagger
 * /api/rooms/heartbeat:
 *   get:
 *     summary: 发送心跳信息
 *     description: 需要鉴权，登录用户可请求
 *     tags:
 *      - 房间
 *     responses:
 *       200:
 *         description: '`ResultType<null>`'
 */
export async function GET(request: NextRequest) {
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
    await redisClient.setEx(
      `${REDIS_KEY_HEARTBEAT_PREFIX}${userId}`,
      REDIS_KEY_HEARTBEAT_EXPIRE,
      Date.now().toString(),
    )
    return Result.success(null)
  }
  catch (error: any) {
    console.error('Error:', error)
    return Result.error(`错误: ${error.message}`)
  }
}
