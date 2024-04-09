import type { PageParamsType } from '@/types/global'
import type { UserFriend } from '@prisma/client'

import { prisma } from '@/lib/db'

import { AbstractService } from './_base'

/**
 * 好友服务
 */
export class FriendService extends AbstractService<UserFriend> {
  delegate = prisma.userFriend

  /**
   * 获取用户的好友列表
   * @param userId 用户 ID
   * @param page 分页参数
   * @returns 用户列表
   */
  async getFriends(userId: string, page: PageParamsType) {
    const userFriend = await this.delegate.findMany({
      include: {
        friend: true,
      },
      skip: (page.page - 1) * page.size,
      take: page.size,
      where: {
        isDeleted: false,
        userId,
      },
    })
    return userFriend.map(item => item.friend)
  }

  /**
   * 搜索用户的好友
   * @param userId 用户 ID
   * @param keyword 关键词
   * @param page 分页参数
   * @returns 用户列表
   */
  async searchFriends(userId: string, keyword: string, page: PageParamsType) {
    const userFriend = await this.delegate.findMany({
      include: {
        friend: true,
      },
      skip: (page.page - 1) * page.size,
      take: page.size,
      where: {
        isDeleted: false,
        user: {
          username: {
            contains: keyword,
          },
        },
        userId,
      },
    })
    return userFriend.map(item => item.friend)
  }
}

export const friendService = new FriendService()
