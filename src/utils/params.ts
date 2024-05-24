import type { PageParamsType } from '@/types/global'

/**
 * 获取请求的查询参数
 * @param request 请求
 * @returns 查询参数
 */
export function getParams(request: Request): Record<string, string | undefined> {
  const url = new URL(request.url)
  const params: Record<string, string | undefined> = {}
  for (const [key, value] of url.searchParams) {
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
export function getPageParams(request: Request, defaultPage = 1, defaultSize = 20): PageParamsType {
  const { page, size } = getParams(request)
  const res = {
    page: page ? Number.parseInt(page) : defaultPage,
    size: size ? Number.parseInt(size) : defaultSize,
  }
  return {
    page: Math.min(1000, Math.max(1, res.page)),
    size: Math.min(100, Math.max(1, res.size)),
  }
}
