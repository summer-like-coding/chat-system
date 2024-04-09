import type { PageParamsType } from '@/types/global'
import type { Room, User, UserContact } from '@prisma/client'

import { prisma } from '@/lib/db'

import { AbstractService } from './_base'
import { roomVo, userVo } from './_mapper'

/**
 * 用户聊天
 */
export class ContactService extends AbstractService<UserContact> {
  delegate = prisma.userContact

  asVo(data?: UserContact & {
    room?: Room
    user?: User
  } | null) {
    return {
      ...data,
      room: roomVo(data?.room) ?? undefined,
      user: userVo(data?.user) ?? undefined,
    }
  }

  /**
   *
   * @param userId 用户 ID
   * @param page 分页参数
   * @returns 联系信息
   */
  async getByUserId(userId: string, page: PageParamsType): Promise<(UserContact & { room: Room })[]> {
    return await this.delegate.findMany({
      include: {
        room: true,
      },
      skip: (page.page - 1) * page.size,
      take: page.size,
      where: {
        isDeleted: false,
        userId,
      },
    })
  }

  /**
   * 获取详细信息
   * @param contactId 联系 ID
   * @returns 联系详细信息
   */
  async getDetails(contactId: string): Promise<UserContact & { room: Room, user: User } | null> {
    return await this.delegate.findUnique({
      include: {
        room: true,
        user: true,
      },
      where: {
        id: contactId,
        isDeleted: false,
      },
    })
  }
}

export const contactService = new ContactService()
