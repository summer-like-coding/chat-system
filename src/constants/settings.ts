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
export const REDIS_KEY_HEARTBEAT_PREFIX = 'im:heartbeat:'
/**
 * Redis Key: 心跳过期时间
 */
export const REDIS_KEY_HEARTBEAT_EXPIRE = 60
/**
 * Redis Key: 用户房间映射表
 */
export const REDIS_KEY_USER_ROOM_PREFIX = 'im:user.rooms:'
/**
 * Redis Key: 房间用户映射表
 */
export const REDIS_KEY_ROOM_USER_PREFIX = 'im:room.users:'
