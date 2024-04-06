import type { PageParamsType } from '@/types/global'

import { prisma } from '@/lib/db'
import { CommonStatusType, type Group } from '@prisma/client'

import { AbstractService } from './_base'

/**
 * 群组服务
 */
export class Groupervice extends AbstractService<Group> {
  delegate = prisma.group

  /**
   * 创建群组
   * @param group 群聊信息
   * @param userIdList 初始用户 ID 列表
   * @returns 群组信息
   */
  async initializeGroup(group: Partial<Group>, userIdList: string[]): Promise<Group> {
    if (group.name === undefined) {
      throw new Error('群组名称不能为空')
    }

    const groupCreated = await prisma.$transaction(async (ctx) => {
      const users = await ctx.user.findMany({
        where: {
          id: {
            in: userIdList,
          },
          isDeleted: false,
        },
      })
      if (users.length !== userIdList.length) {
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
      ctx.userGroup.createMany({
        data: userIdList.map(userId => ({
          groupId: groupCreated.id,
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
    return this.delegate.findMany({
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
}

export const groupService = new Groupervice()
