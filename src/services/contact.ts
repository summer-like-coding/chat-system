import type { PageParamsType } from '@/types/global'
import type { UserContact } from '@prisma/client'

import { prisma } from '@/lib/db'

import { AbstractService } from './_base'

/**
 * 用户聊天
 */
export class ContactService extends AbstractService<UserContact> {
  delegate = prisma.userContact

  async getByUserId(userId: string, page?: PageParamsType): Promise<UserContact[]> {
    if (page) {
      return this.delegate.findMany({
        skip: (page.page - 1) * page.size,
        take: page.size,
        where: {
          userId,
        },
      })
    }
    return this.delegate.findMany({
      where: {
        userId,
      },
    })
  }
}

export const contactService = new ContactService()
