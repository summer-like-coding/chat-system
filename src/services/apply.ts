import type { FriendApply, GroupApply } from '@prisma/client'

import { prisma } from '@/lib/db'

import { AbstractService } from './_base'

/**
 * 好友申请服务
 */
export class FriendApplyService extends AbstractService<FriendApply> {
  delegate = prisma.friendApply
}

export const friendApplyService = new FriendApplyService()

/**
 * 群组申请服务
 */
export class GroupApplyService extends AbstractService<GroupApply> {
  delegate = prisma.groupApply
}

export const groupApplyService = new GroupApplyService()
