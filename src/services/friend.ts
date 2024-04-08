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
   */
  async getFriends(userId: string, page: PageParamsType) {
    const userIdList = await this.delegate.findMany({
      select: {
        friendId: true,
      },
      skip: (page.page - 1) * page.size,
      take: page.size,
      where: {
        isDeleted: false,
        userId,
      },
    })
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: userIdList.map(x => x.friendId),
        },
        isDeleted: false,
      },
    })
    return users
  }
}

export const friendService = new FriendService()
