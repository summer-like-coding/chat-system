import type { PageParamsType } from '@/types/global'

/**
 * 获取请求的查询参数
 * @param request 请求
 * @returns 查询参数
 */
export function getParams(request: Request): Record<string, string | undefined> {
  const searchParams = new URLSearchParams(request.url.split('?')[1])
  const params: Record<string, string | undefined> = {}
  for (const [key, value] of searchParams) {
    params[key] = value
  }
  return params
}

/**
 * 获取分页参数
 * @param request 请求
 * @param defaultPage 默认页码
 * @param defaultSize 默认每页大小
 * @returns 分页参数
 */
export function getPageParams(request: Request, defaultPage = 1, defaultSize = 10): PageParamsType {
  const searchParams = getParams(request)
  const page = {
    page: searchParams.page ? Number.parseInt(searchParams.page) : defaultPage,
    size: searchParams.size ? Number.parseInt(searchParams.size) : defaultSize,
  }
  return {
    page: Math.max(1, page.page),
    size: Math.min(500, Math.max(1, page.size)),
  }
}
