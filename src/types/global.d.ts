/**
 * 返回结果
 */
export interface ResultType<T> {
  /**
   * 状态码
   */
  code: number
  /**
   * 数据
   */
  data: T
  /**
   * 消息
   */
  msg: string
}

/**
 * 分页查询结果
 */
export interface PageType<T> {
  /**
   * 数据
   */
  list: T[]
  /**
   * 当前页
   */
  page: number
  /**
   * 每页数量
   */
  size: number
  /**
   * 总数
   */
  total: number
}

/**
 * 分页查询参数
 */
export interface PageParamsType {
  /**
   * 当前页
   */
  page: number
  /**
   * 每页数量
   */
  size: number
}

export interface PathIdParams {
  params: { id: string }
}
