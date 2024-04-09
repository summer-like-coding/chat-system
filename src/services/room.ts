import type { FriendRoom, GroupRoom, Room } from '@prisma/client'

import { prisma } from '@/lib/db'

import { AbstractService } from './_base'

/**
 * 房间服务
 */
export class Roomervice extends AbstractService<Room> {
  delegate = prisma.room

  /**
   * 通过好友 ID 获取好友房间
   * @param user1Id 用户 1 ID
   * @param user2Id 用户 2 ID
   * @returns 好友房间信息
   */
  async getByFriendTupleId(user1Id: string, user2Id: string) {
    const [userSmallerId, userLargerId] = user1Id < user2Id ? [user1Id, user2Id] : [user2Id, user1Id]
    return await prisma.friendRoom.findFirst({
      include: {
        room: true,
      },
      where: {
        isDeleted: false,
        user1Id: userSmallerId,
        user2Id: userLargerId,
      },
    })
  }
}

export const roomService = new Roomervice()

/**
 * 单聊房间
 */
export class FriendRoomService extends AbstractService<FriendRoom> {
  delegate = prisma.friendRoom

  /**
   * 获取单聊房间
   * @param roomId 房间 ID
   */
  async getByRoomId(roomId: string) {
    return this.delegate.findFirst({
      where: {
        isDeleted: false,
        roomId,
      },
    })
  }
}

export const friendRoomService = new FriendRoomService()

/**
 * 群聊房间
 */
export class GroupRoomervice extends AbstractService<GroupRoom> {
  delegate = prisma.groupRoom

  /**
   * 获取群聊房间
   * @param roomId 房间 ID
   */
  async getByRoomId(roomId: string) {
    return this.delegate.findFirst({
      where: {
        isDeleted: false,
        roomId,
      },
    })
  }
}

export const groupRoomService = new GroupRoomervice()
