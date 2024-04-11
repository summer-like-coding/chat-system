import type { PageParamsType } from '@/types/global'
import type { Room, User, UserContact } from '@prisma/client'

import { prisma, transaction } from '@/lib/db'

import { AbstractService } from './_base'
import { contactVo, roomVo, userVo } from './_mapper'

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
      ...contactVo(data),
      room: roomVo(data?.room) ?? undefined,
      user: userVo(data?.user) ?? undefined,
    }
  }

  /**
   * 通过房间 ID 获取联系信息
   * @param roomId 房间 ID
   * @returns 联系信息
   */
  async getByRoomId(roomId: string): Promise<UserContact | null> {
    return await this.delegate.findFirst({
      where: {
        isDeleted: false,
        roomId,
      },
    })
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

  /**
   * 准备联系信息
   * @param userId 用户 ID
   * @param friendId 好友 ID
   * @param roomId 房间 ID
   * @returns 联系信息
   */
  async prepareFriend(userId: string, friendId: string, roomId: string): Promise<UserContact> {
    return await transaction(async (ctx) => {
      const contact = await ctx.userContact.findFirst({
        where: {
          roomId,
          userId,
        },
      })
      const friendContact = await ctx.userContact.findFirst({
        where: {
          roomId,
          userId: friendId,
        },
      })
      if (!friendContact) {
        await ctx.userContact.create({
          data: {
            roomId,
            userId: friendId,
          },
        })
      }
      if (contact) {
        return contact
      }
      const contactCreated = await ctx.userContact.create({
        data: {
          roomId,
          userId,
        },
      })
      return contactCreated
    })
  }

  async prepareGroup(userId: string, groupId: string, roomId: string): Promise<UserContact> {
    return await transaction(async (ctx) => {
      const contact = await ctx.userContact.findFirst({
        where: {
          roomId,
          userId,
        },
      })
      if (contact) {
        return contact
      }
      const contactCreated = await ctx.userContact.create({
        data: {
          roomId,
          userId,
        },
      })
      return contactCreated
    })
  }
}

export const contactService = new ContactService()
