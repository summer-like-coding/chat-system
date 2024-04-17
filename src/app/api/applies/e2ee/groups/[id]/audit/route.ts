import type { NextRequest } from 'next/server'

import { Result } from '@/utils/result'

/**
 * 处理加入群聊申请
 * @swagger
 * /api/applies/e2ee/groups/[id]/audit:
 *   post:
 *     summary: "处理加入群聊申请 (E2EE) @todo"
 *     description: |
 *       需要鉴权，群管理员可处理。此接口提供端到端验证的群组申请
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
