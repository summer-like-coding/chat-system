import type { NextRequest } from 'next/server'

import { Result } from '@/utils/result'

/**
 * 处理加好友申请
 * @swagger
 * /api/applies/e2ee/friends/[id]/audit:
 *   post:
 *     summary: "处理加好友申请 (E2EE) @todo"
 *     description: |
 *       需要鉴权，目标用户可处理。此接口提供端到端验证的好友申请
 *     tags:
 *      - 申请
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
