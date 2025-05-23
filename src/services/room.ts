import type { FriendRoom, Group, GroupRoom, Room, User } from '@prisma/client'

import { prisma } from '@/lib/db'

import { AbstractService } from './_base'
import { friendRoomVo, groupRoomVo, groupVo, roomVo, userVo } from './_mapper'

/**
 * 房间服务
 */
export class RoomService extends AbstractService<Room> {
  delegate = prisma.room

  asVo(data?: Room | null) {
    return roomVo(data)
  }
}

export const roomService = new RoomService()

/**
 * 单聊房间
 */
export class FriendRoomService extends AbstractService<FriendRoom> {
  delegate = prisma.friendRoom

  asVo(data?: {
    room?: Room
    user1?: User
    user2?: User
  } & FriendRoom | null) {
    return {
      ...friendRoomVo(data),
      room: roomVo(data?.room) ?? undefined,
      user1: userVo(data?.user1) ?? undefined,
      user2: userVo(data?.user2) ?? undefined,
    }
  }

  /**
   * 通过好友 ID 获取好友房间
   * @param user1Id 用户 1 ID
   * @param user2Id 用户 2 ID
   * @returns 好友房间信息
   */
  async getByFriendTupleId(user1Id: string, user2Id: string) {
    const [userSmallerId, userLargerId] = user1Id < user2Id ? [user1Id, user2Id] : [user2Id, user1Id]
    return await this.delegate.findFirst({
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
export class GroupRoomService extends AbstractService<GroupRoom> {
  delegate = prisma.groupRoom

  asVo(data?: {
    group?: Group
    room?: Room
  } & GroupRoom | null) {
    return {
      ...groupRoomVo(data),
      group: groupVo(data?.group) ?? undefined,
      room: roomVo(data?.room) ?? undefined,
    }
  }

  /**
   * 获取群聊房间
   * @param groupId 群组 ID
   * @returns 群聊房间
   */
  async getByGroupId(groupId: string) {
    return this.delegate.findFirst({
      include: {
        group: true,
        room: true,
      },
      where: {
        groupId,
        isDeleted: false,
      },
    })
  }

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

export const groupRoomService = new GroupRoomService()
