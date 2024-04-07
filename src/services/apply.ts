import type { PageParamsType } from '@/types/global'

import { prisma } from '@/lib/db'
import { ApplyStatusType, type FriendApply, type GroupApply } from '@prisma/client'

import { AbstractService } from './_base'

/**
 * 好友申请服务
 */
export class FriendApplyService extends AbstractService<FriendApply> {
  delegate = prisma.friendApply

  /**
   * 创建好友申请
   */
  async applyFor({ answer, reason, selfRemark, targetId, type, userId }: Pick<
    Partial<FriendApply>,
    'answer' | 'reason' | 'selfRemark' | 'targetId' | 'type' | 'userId'
  >) {
    return prisma.$transaction(async (ctx) => {
      const user1 = await ctx.user.findUnique({
        where: {
          id: userId,
          isDeleted: false,
        },
      })
      if (!user1) {
        throw new Error('用户不存在')
      }
      const user2 = await ctx.user.findUnique({
        where: {
          id: targetId,
          isDeleted: false,
        },
      })
      if (!user2) {
        throw new Error('目标用户不存在')
      }
      if (user1.id === user2.id) {
        throw new Error('不能添加自己为好友')
      }
      const apply = await ctx.friendApply.findFirst({
        where: {
          status: ApplyStatusType.PENDING,
          targetId: user2.id,
          userId: user1.id,
        },
      })
      if (apply) {
        throw new Error('已经申请过了，请等待申请结果')
      }
      const applyCreated = await ctx.friendApply.create({
        data: {
          answer,
          reason,
          selfRemark,
          targetId: user2.id,
          type,
          userId: user1.id,
        },
      })
      return applyCreated
    })
  }

  /**
   * 根据 userId 查找申请记录
   * @param userId 用户 ID
   * @param page 分页参数
   * @param status 申请状态
   * @returns 申请记录列表
   */
  async getApplies(userId: string, page: PageParamsType, status?: ApplyStatusType) {
    const applies = await this.delegate.findMany({
      skip: (page.page - 1) * page.size,
      take: page.size,
      where: {
        isDeleted: false,
        status,
        userId,
      },
    })
    return applies
  }

  /**
   * 根据 targetId 查找申请记录
   * @param targetId 目标用户 ID
   * @param page 分页参数
   * @param status 申请状态
   * @returns 申请记录列表
   */
  async getAppliesByTargetId(targetId: string, page: PageParamsType, status?: ApplyStatusType) {
    const applies = await this.delegate.findMany({
      skip: (page.page - 1) * page.size,
      take: page.size,
      where: {
        isDeleted: false,
        status,
        targetId,
      },
    })
    return applies
  }
}

export const friendApplyService = new FriendApplyService()

/**
 * 群组申请服务
 */
export class GroupApplyService extends AbstractService<GroupApply> {
  delegate = prisma.groupApply
}

export const groupApplyService = new GroupApplyService()
