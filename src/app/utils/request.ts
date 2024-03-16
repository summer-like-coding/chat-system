import type { ResultType } from '@/types/global'

import { message } from 'antd'

interface RequestOption extends RequestInit {
  data: Record<string, unknown>
}

// 统一错误处理

const errorMap = {
  400: '请求错误',
  401: '未登录',
  403: '无权限',
  404: '接口不存在',
  500: '服务器错误',
}

function errorHandle(code: keyof typeof errorMap, msg: string) {
  return errorMap[code] || msg
}

export async function request<T = unknown>(url: string, options: RequestOption): Promise<T> {
  const response = await fetch(url, {
    method: options.method,
    ...options,
    body: JSON.stringify(options.data),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
  })
  const res: ResultType<T> = await response.json()
  if (response.ok && res.code === 0) {
    return res.data
  }
  message.error(errorHandle(res.code as keyof typeof errorMap, res.msg))
  throw new Error(res.msg)
}
