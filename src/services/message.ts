import type { Message, MessageType, Room, User } from '@prisma/client'

import { prisma, transaction } from '@/lib/db'

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

  asVo(data?: {
    room?: Room
    user?: User
  } & Message | null) {
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
    return await transaction(async (ctx) => {
      const message = await ctx.message.create({
        data: {
          content,
          roomId,
          type,
          userId,
        },
      })
      await ctx.room.update({
        data: {
          lastMessageId: message.id,
          lastUpdatedAt: message.createdAt,
        },
        where: {
          id: roomId,
          isDeleted: false,
        },
      })
      return message
    })
  }

  /**
   * 拉取消息
   * @param roomId 房间 ID
   * @param lastMessageTime 最后一条消息的时间
   * @returns 消息
   */
  async pullNewMessages(roomId: string, lastMessageTime: number) {
    return await this.delegate.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
      where: {
        createdAt: {
          gte: new Date(lastMessageTime),
        },
        isDeleted: false,
        roomId,
      },
    })
  }

  /**
   * 反向回溯消息
   * @param roomId 房间 ID
   * @param firstMessageTime 第一条消息的时间
   * @returns 消息
   */
  async pullPreviousMessages(roomId: string, firstMessageTime: number) {
    return await this.delegate.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
      where: {
        createdAt: {
          lte: new Date(firstMessageTime),
        },
        isDeleted: false,
        roomId,
      },
    })
  }
}

export const messageService = new MessageService()
export interface MessageQueryType {
  content: string
  type: MessageType
}
