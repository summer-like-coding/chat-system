import type { Room } from '@prisma/client'

import { prisma } from '@/lib/db'

import { AbstractService } from './_base'

/**
 * 房间服务
 */
export class Roomervice extends AbstractService<Room> {
  delegate = prisma.room
}

export const roomService = new Roomervice()

/**
 * 单聊房间
 */
export class FriendRoomService extends AbstractService<Room> {
  delegate = prisma.friendRoom

  /**
   * 获取单聊房间
   * @param roomId 房间 ID
   */
  async getByRoomId(roomId: string) {
    return this.delegate.findFirst({
      where: { roomId },
    })
  }
}

export const friendRoomService = new FriendRoomService()

/**
 * 群聊房间
 */
export class GroupRoomervice extends AbstractService<Room> {
  delegate = prisma.groupRoom

  /**
   * 获取群聊房间
   * @param roomId 房间 ID
   */
  async getByRoomId(roomId: string) {
    return this.delegate.findFirst({
      where: { roomId },
    })
  }
}

export const groupRoomService = new GroupRoomervice()
