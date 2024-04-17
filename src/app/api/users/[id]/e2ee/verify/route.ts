import type { NextRequest } from 'next/server'

import { Result } from '@/utils/result'

/**
 * 向目标用户发起验证 (E2EE)
 * @swagger
 * /api/users/[id]/e2ee/verify:
 *   post:
 *     summary: "向目标用户发起验证 (E2EE) @todo"
 *     description: 需要鉴权，仅用户自己可请求
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
