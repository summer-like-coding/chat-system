import type { Message, MessageType } from '@prisma/client'

import { prisma } from '@/lib/db'

import { AbstractService } from './_base'

export interface MessageCreateType {
  content: string
  roomId: string
  type: MessageType
  userId: string
}

/**
 * 角色服务
 */
export class MessageService extends AbstractService<Message> {
  delegate = prisma.message

  /**
   * 创建消息
   * @returns 消息
   */
  async createMessage({ content, roomId, type, userId }: MessageCreateType) {
    return this.delegate.create({
      data: {
        content,
        roomId,
        type,
        userId,
      },
    })
  }
}

export const messageService = new MessageService()
