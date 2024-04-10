import type { ApplyStatusType } from '@prisma/client'

/**
 * 申请状态映射
 */
export const applyStatusMapping: Record<ApplyStatusType, string> = {
  ACCEPTED: '已接受',
  IGNORED: '已忽略',
  PENDING: '待处理',
  REJECTED: '已拒绝',
}
