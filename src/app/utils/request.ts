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

export async function request<T = unknown>(url: string, params?: Record<string, string>, options?: RequestOption): Promise<T | null> {
  const searchParams = new URLSearchParams(params)
  const fetchUrl = `${url}?${searchParams.toString()}`
  const response = await fetch(fetchUrl, {
    method: options?.method,
    ...options,
    body: options?.data && JSON.stringify(options.data),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
  })
  const res: ResultType<T> = await response.json()
  if (response.ok && res.code === 0) {
    return res.data ?? null
  }
  message.error(errorHandle(res.code as keyof typeof errorMap, res.msg))
  throw new Error(res.msg)
}

export async function requestEventStream(url: string, params?: Record<string, string>, onMessage?: (data: string) => void, onEnd?: () => void, options?: RequestOption) {
  const abort = new AbortController()
  const searchParams = new URLSearchParams(params)
  const fetchUrl = `${url}?${searchParams.toString()}`
  const response = await fetch(fetchUrl, {
    method: options?.method,
    ...options,
    body: options?.data && JSON.stringify(options.data),
    credentials: 'include',
    mode: 'cors',
    signal: abort.signal,
  })

  const reader = response.body?.getReader()
  if (reader) {
    const decoder = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        onEnd?.()
        break
      }
      const data = decoder.decode(value)
      onMessage?.(data)
    }
  }
  return {
    abort: abort.abort,
    response,
  }
}
