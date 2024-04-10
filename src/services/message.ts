import type { Message, MessageType, Room, User } from '@prisma/client'

import { prisma } from '@/lib/db'

import { AbstractService } from './_base'
import { messageVo, roomVo, userVo } from './_mapper'

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

  asVo(data?: Message & {
    room?: Room
    user?: User
  } | null) {
    return {
      ...messageVo(data),
      room: roomVo(data?.room) ?? undefined,
      user: userVo(data?.user) ?? undefined,
    }
  }

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
