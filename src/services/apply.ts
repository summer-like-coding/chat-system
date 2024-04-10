import type { PageParamsType } from '@/types/global'
import type { Group, User } from '@prisma/client'

import { prisma, transaction } from '@/lib/db'
import { ApplyStatusType, type FriendApply, type GroupApply, RoomType } from '@prisma/client'

import { AbstractService } from './_base'
import { friendApplyVo, groupApplyVo, groupVo, userVo } from './_mapper'

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
    return transaction(async (ctx) => {
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
      if (apply.userId === apply.targetId) {
        throw new Error('不能添加自己为好友')
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

      // 有序的用户 ID
      const [userSmaller, userLarger] = user1.id < user2.id ? [user1, user2] : [user2, user1]
      const friendRoom = await ctx.friendRoom.create({
        data: {
          key: `${userSmaller.id}-${userLarger.id}`,
          roomId: room.id,
          user1Id: userSmaller.id,
          user2Id: userLarger.id,
        },
      })

      // 更新申请状态
      const friendApply = await ctx.friendApply.update({
        data: {
          status: ApplyStatusType.ACCEPTED,
        },
        include: {
          target: true,
          user: true,
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
    return transaction(async (ctx) => {
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

  asVo(data?: FriendApply & {
    target?: User
    user?: User
  } | null) {
    return {
      ...friendApplyVo(data),
      target: userVo(data?.target) ?? undefined,
      user: userVo(data?.user) ?? undefined,
    }
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
      include: {
        target: true,
        user: true,
      },
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
      include: {
        target: true,
        user: true,
      },
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
   * 获取详细信息
   * @param applyId 申请 ID
   */
  async getDetails(applyId: string): Promise<FriendApply & {
    target: User
    user: User
  } | null> {
    return await this.delegate.findUnique({
      include: {
        target: true,
        user: true,
      },
      where: {
        id: applyId,
        isDeleted: false,
      },
    })
  }

  /**
   * 拒绝/忽略好友申请
   * @param applyId 申请 ID
   * @returns 申请记录
   */
  async reject(
    applyId: string,
    statusType: ApplyStatusType = 'REJECTED',
  ) {
    return transaction(async (ctx) => {
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
          status: statusType,
        },
        include: {
          target: true,
          user: true,
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

  asVo(data?: GroupApply & {
    group?: Group
    user?: User
  } | null) {
    return {
      ...groupApplyVo(data),
      group: groupVo(data?.group) ?? undefined,
      user: userVo(data?.user) ?? undefined,
    }
  }

  /**
   * 根据 userId 查找申请记录
   * @param userId 用户 ID
   * @param page 分页参数
   * @param status 申请状态
   * @returns 申请记录列表
   */
  async getAppliesByUserId(userId: string, page: PageParamsType, status?: ApplyStatusType): Promise<(GroupApply & {
    group: Group
  })[]> {
    const applies = await this.delegate.findMany({
      include: {
        group: true,
      },
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
   * 根据 ID 查找申请记录
   * @param applyId 申请 ID
   * @returns 申请记录
   */
  async getDetails(applyId: string): Promise<GroupApply & {
    group: Group
    user: User
  } | null> {
    return await this.delegate.findUnique({
      include: {
        group: true,
        user: true,
      },
      where: {
        id: applyId,
        isDeleted: false,
      },
    })
  }
}

export const groupApplyService = new GroupApplyService()
