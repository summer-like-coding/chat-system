import type { NextRequest } from 'next/server'

import { Result } from '@/utils/result'

/**
 * 获取用户的公钥
 * @swagger
 * /api/users/[id]/e2ee/pk:
 *   post:
 *     summary: "获取用户的公钥 (E2EE) @todo"
 *     description: 需要鉴权，登录用户可请求
 *     tags:
 *      - 用户
 */
export async function POST(request: NextRequest) {
  try {
    console.error('request:', request)
  }
  catch (error: any) {
    console.error('Error:', error)
    return Result.error(`错误: ${error.message}`)
  }
}
