import type { NextRequest } from 'next/server'

import { Result } from '@/utils/result'

/**
 * 查询机器人列表
 * @swagger
 * /api/robot/list:
 *   get:
 *     summary: 查询机器人列表
 *     description: 目前返回静态数据
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
    key: 'google-palm',
    name: 'Google PaLM',
  },
  {
    key: 'ERNIE-Bot-turbo',
    name: '文心一言',
  },
  {
    key: 'glm-3-turbo',
    name: 'ChatGLM 3',
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
