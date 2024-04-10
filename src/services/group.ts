import type { PageParamsType } from '@/types/global'
import type { User, UserGroup } from '@prisma/client'

import { prisma, transaction } from '@/lib/db'
import { CommonStatusType, type Group } from '@prisma/client'

import { AbstractService } from './_base'
import { groupVo, userGroupVo, userVo } from './_mapper'

/**
 * 群组服务
 */
export class Groupervice extends AbstractService<Group> {
  delegate = prisma.group

  asVo(data?: Group | null) {
    return groupVo(data)
  }

  /**
   * 创建群组
   * @param group 群聊信息
   * @param userIdList 初始用户 ID 列表
   * @param ownerId 群主 ID
   * @returns 群组信息
   */
  async initializeGroup(group: Partial<Group>, userIdList: string[], ownerId: string): Promise<Group> {
    if (group.name === undefined) {
      throw new Error('群组名称不能为空')
    }
    // 去重 userIdList
    const userIdSet = new Set(userIdList)
    userIdSet.add(ownerId)
    const userIdListDedup = Array.from(userIdSet)

    const groupCreated = await transaction(async (ctx) => {
      const users = await ctx.user.findMany({
        where: {
          id: {
            in: userIdListDedup,
          },
          isDeleted: false,
        },
      })
      if (users.length !== userIdListDedup.length) {
        throw new Error('存在一些用户不存在')
      }
      const groupCreated = await ctx.group.create({
        data: {
          avatar: group.avatar,
          description: group.description,
          name: group.name!,
          status: CommonStatusType.ACTIVE,
        },
      })
      await ctx.userGroup.createMany({
        data: userIdListDedup.map(userId => ({
          groupId: groupCreated.id,
          groupRole: userId === ownerId ? 'OWNER' : 'MEMBER',
          userId,
        })),
      })
      return groupCreated
    })
    return groupCreated
  }

  /**
   * 搜索群组
   * @param keyword 关键词
   * @param page 分页参数
   * @returns 群组列表
   */
  async searchGroups(keyword: string, page: PageParamsType) {
    return await this.delegate.findMany({
      skip: (page.page - 1) * page.size,
      take: page.size,
      where: {
        isDeleted: false,
        name: {
          contains: keyword,
        },
        status: CommonStatusType.ACTIVE,
      },
    })
  }

  /**
   * 更新群组信息
   * @param groupId 群组 ID
   * @param group 群组信息
   * @returns 更新后的群组信息
   */
  async updateGroup(groupId: string, group: Partial<Group>) {
    return await this.delegate.update({
      data: group,
      where: {
        id: groupId,
        isDeleted: false,
      },
    })
  }
}

export const groupService = new Groupervice()

/**
 * 用户群组服务
 */
export class UserGroupervice extends AbstractService<UserGroup> {
  delegate = prisma.userGroup

  asVo(data?: UserGroup & {
    group?: Group
    user?: User
  } | null) {
    return {
      ...userGroupVo(data),
      group: groupVo(data?.group) ?? undefined,
      user: userVo(data?.user) ?? undefined,
    }
  }

  /**
   * 检查用户是否有群组管理权限
   * @param groupId 群组 ID
   * @param userId 用户 ID
   */
  async checkHasGroupPermission(groupId: string, userId: string): Promise<UserGroup | null> {
    return await this.delegate.findFirst({
      where: {
        groupId,
        groupRole: {
          in: ['OWNER', 'ADMIN'],
        },
        isDeleted: false,
        userId,
      },
    })
  }

  /**
   * 检查用户是否是群组成员
   * @param groupId 群组 ID
   * @param userId 用户 ID
   * @returns 是否是群组成员
   */
  async checkIsGroupMember(groupId: string, userId: string): Promise<UserGroup | null> {
    return await this.delegate.findFirst({
      where: {
        groupId,
        isDeleted: false,
        userId,
      },
    })
  }

  /**
   * 通过用户 ID 查询用户的群组列表
   * @param userId 用户 ID
   * @param page 分页参数
   * @returns 群组列表
   */
  async getByUsername(userId: string, page: PageParamsType): Promise<Group[]> {
    const userGroups = await this.delegate.findMany({
      include: {
        group: true,
      },
      skip: (page.page - 1) * page.size,
      take: page.size,
      where: {
        isDeleted: false,
        userId,
      },
    })
    return userGroups.map(item => item.group)
  }

  /**
   * 查询群组成员
   * @param groupId 群组 ID
   * @param page 分页参数
   * @returns 群组成员列表
   */
  async getMembers(groupId: string, page: PageParamsType): Promise<(UserGroup & {
    user: User
  })[]> {
    return await this.delegate.findMany({
      include: {
        user: true,
      },
      skip: (page.page - 1) * page.size,
      take: page.size,
      where: {
        groupId,
        isDeleted: false,
      },
    })
  }
}

export const userGroupService = new UserGroupervice()
