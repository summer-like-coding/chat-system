import type { NextRequest } from 'next/server'

import { Result } from '@/utils/result'

/**
 * 申请加入群聊
 * @swagger
 * /api/applies/e2ee/groups/apply:
 *   post:
 *     summary: "申请加入群聊 (E2EE) @todo"
 *     description: |
 *       需要鉴权，登录用户可请求。此接口提供端到端验证的群组申请
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
