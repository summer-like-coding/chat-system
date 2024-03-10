import type { UserContact } from '@prisma/client'

import { prisma } from '@/lib/db'

import { AbstractService } from './_base'

/**
 * 用户聊天
 */
export class ContactService extends AbstractService<UserContact> {
  delegate = prisma.userContact
}

export const contactService = new ContactService()
