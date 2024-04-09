import type { NextRequest } from 'next/server'

import { authOptions } from '@/lib/auth'
import { oss } from '@/lib/oss'
import { Result } from '@/utils/result'
import { getServerSession } from 'next-auth'
import { Buffer } from 'node:buffer'

function getRandomKey() {
  return (
    `${Math.random().toString(36).slice(2)}`
    + `${Math.random().toString(36).slice(2)}-${Date.now()}`
  )
}

const BASE_URL = 'https://files.alexsun.top'

/**
 * 上传文件
 * @swagger
 * /api/upload/files:
 *   post:
 *     summary: 上传文件
 *     description: 需要鉴权，登录后可以上传文件
 *     tags:
 *      - 上传
 *     requestBody:
 *       description: '`{ file: File }`'
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *              - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: '`ResultType<{ path: string, status: number, url: string }>` 路径和链接等'
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return Result.error('未登录')
    }
    const form = await request.formData()
    const file = form.get('file') as File | null
    if (!file) {
      return Result.error('文件不存在')
    }
    const ext = file.name.split('.').pop()
    if (!ext) {
      return Result.error('文件类型不支持')
    }
    const uid = getRandomKey()
    const path = `/upload/files/${uid}.${ext}`
    const result = await oss.put(path, Buffer.from(await file.arrayBuffer()))
    return Result.success({
      path,
      status: result.res.status,
      url: BASE_URL + path,
    })
  }
  catch (error: any) {
    console.error('Error:', error)
    return Result.error(`错误: ${error.message}`)
  }
}
