/**
 * 事务最大重试次数
 */
export const TRANSACTION_MAX_RETRIES = 3
/**
 * 事务重试错误代码
 */
export const TRANSACTION_ERROR_CODES = [
  'P2034',
]

/**
 * Redis Key: 心跳
 */
export const REDIS_KEY_HEARTBEAT = 'im:heartbeat'
