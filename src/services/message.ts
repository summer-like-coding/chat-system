import type { Message } from '@prisma/client'

import { prisma } from '@/lib/db'

import { AbstractService } from './_base'

/**
 * 角色服务
 */
export class MessageService extends AbstractService<Message> {
  delegate = prisma.message
}

export const messageService = new MessageService()
