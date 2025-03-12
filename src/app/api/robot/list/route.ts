import type { NextRequest } from 'next/server'

import { Result } from '@/utils/result'

/**
 * 查询机器人列表
 * @swagger
 * /api/robot/list:
 *   get:
 *     summary: 查询机器人列表
 *     description: 无鉴权，目前返回静态数据
 *     tags:
 *      - 机器人
 *     responses:
 *       200:
 *         description: '`ResultType<RobotVo[]>` 机器人列表'
 */
const ROBOT_LIST = [
  {
    key: 'gpt-3.5-turbo',
    name: 'ChatGPT-3.5',
  },
  {
    key: 'gpt-4',
    name: 'GPT-4',
  },
  {
    key: 'gpt-4.5-preview',
    name: 'GPT-4.5 预览版',
  },
  {
    key: 'claude-3-opus-20240229',
    name: 'Claude 3 Opus',
  },
  {
    key: 'claude-3-sonnet-20240229',
    name: 'Claude 3 Sonnet',
  },
  {
    key: 'gemini-pro',
    name: 'Gemini',
  },
  {
    key: 'gemini-pro-vision',
    name: 'Gemini Pro',
  },
  {
    key: 'chatglm_turbo',
    name: 'ChatGLM',
  },
  {
    key: 'qwen-turbo',
    name: '通义千问',
  },
  {
    key: 'qwen-plus',
    name: '通义千问 Plus',
  },
  {
    key: 'gpt-4o',
    name: 'GPT-4o',
  },
  {
    key: 'deepseek-chat',
    name: 'DeepSeek Chat',
  },
  {
    key: 'Doubao-pro-32k',
    name: '豆包 Pro',
  },
  {
    key: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
  },
  {
    key: 'claude-3-7-sonnet-20250219',
    name: 'Claude 3.7 Sonnet',
  },
]
export async function GET(_request: NextRequest) {
  try {
    return Result.success(ROBOT_LIST)
  }
  catch (error: any) {
    console.error('Error:', error)
    return Result.error(`错误: ${error.message}`)
  }
}
