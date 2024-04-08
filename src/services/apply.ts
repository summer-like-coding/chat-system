import type { PageParamsType } from '@/types/global'

import { prisma } from '@/lib/db'
import { ApplyStatusType, type FriendApply, type GroupApply, RoomType } from '@prisma/client'

import { AbstractService } from './_base'

/**
 * 好友申请服务
 */
export class FriendApplyService extends AbstractService<FriendApply> {
  delegate = prisma.friendApply

  /**
   * 接受好友申请
   * @param applyId 申请 ID
   */
  async accept(applyId: string) {
    return prisma.$transaction(async (ctx) => {
      const apply = await ctx.friendApply.findUnique({
        where: {
          id: applyId,
          isDeleted: false,
        },
      })
      if (!apply) {
        throw new Error('申请不存在')
      }
      if (apply.status !== ApplyStatusType.PENDING) {
        throw new Error('申请状态不正确')
      }
      const user1 = await ctx.user.findUnique({
        where: {
          id: apply.userId,
          isDeleted: false,
        },
      })
      if (!user1) {
        throw new Error('用户不存在')
      }
      const user2 = await ctx.user.findUnique({
        where: {
          id: apply.targetId,
          isDeleted: false,
        },
      })
      if (!user2) {
        throw new Error('目标用户不存在')
      }

      // 检查是否已经是好友
      const friend = await ctx.userFriend.findFirst({
        where: {
          friendId: user2.id,
          isDeleted: false,
          userId: user1.id,
        },
      })
      if (friend) {
        throw new Error('已经是好友了')
      }

      // 创建好友关系
      await ctx.userFriend.createMany({
        data: [
          {
            friendId: user2.id,
            userId: user1.id,
          },
          {
            friendId: user1.id,
            userId: user2.id,
          },
        ],
      })

      // 创建好友房间
      const room = await ctx.room.create({
        data: {
          type: RoomType.FRIEND,
        },
      })
      const friendRoom = await ctx.friendRoom.create({
        data: {
          key: [user1.id, user2.id].sort().join('-'),
          roomId: room.id,
          user1Id: user1.id,
          user2Id: user2.id,
        },
      })

      // 更新申请状态
      const friendApply = await ctx.friendApply.update({
        data: {
          status: ApplyStatusType.ACCEPTED,
        },
        where: {
          id: apply.id,
        },
      })
      return {
        friendApply,
        friendRoom,
        room,
      }
    })
  }

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

  /**
   * 忽略好友申请
   * @param applyId 申请 ID
   * @returns 申请记录
   */
  async ignore(applyId: string) {
    return prisma.$transaction(async (ctx) => {
      const apply = await ctx.friendApply.findUnique({
        where: {
          id: applyId,
          isDeleted: false,
        },
      })
      if (!apply) {
        throw new Error('申请不存在')
      }
      if (apply.status !== ApplyStatusType.PENDING) {
        throw new Error('申请状态不正确')
      }
      const friendApply = await ctx.friendApply.update({
        data: {
          status: ApplyStatusType.IGNORED,
        },
        where: {
          id: apply.id,
        },
      })
      return {
        friendApply,
      }
    })
  }

  /**
   *  拒绝好友申请
   * @param applyId 申请 ID
   * @returns 申请记录
   */
  async reject(applyId: string) {
    return prisma.$transaction(async (ctx) => {
      const apply = await ctx.friendApply.findUnique({
        where: {
          id: applyId,
          isDeleted: false,
        },
      })
      if (!apply) {
        throw new Error('申请不存在')
      }
      if (apply.status !== ApplyStatusType.PENDING) {
        throw new Error('申请状态不正确')
      }
      const friendApply = await ctx.friendApply.update({
        data: {
          status: ApplyStatusType.REJECTED,
        },
        where: {
          id: apply.id,
        },
      })
      return {
        friendApply,
      }
    })
  }
}

export const friendApplyService = new FriendApplyService()

/**
 * 群组申请服务
 */
export class GroupApplyService extends AbstractService<GroupApply> {
  delegate = prisma.groupApply

  /**
   * 根据 userId 查找申请记录
   * @param userId 用户 ID
   * @param page 分页参数
   * @param status 申请状态
   * @returns 申请记录列表
   */
  async getAppliesByUserId(userId: string, page: PageParamsType, status?: ApplyStatusType) {
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
}

export const groupApplyService = new GroupApplyService()
