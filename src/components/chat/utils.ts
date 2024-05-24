import type { GroupVo, RoomVo, UserVo } from '@/types/views'
import type { FriendRoom, UserContact, UserFriend } from '@prisma/client'

import { request } from '@/app/utils/request'
/**
 * @description 获取聊天室id
 * @param key
 * @param type
 * @returns {Promise<{roomId: string, roomType: string}>}
 */
export async function getRoomId(key: string, type: string) {
  let res: {
    contact: UserContact
    friend?: UserFriend
    group?: GroupVo
    room: RoomVo
  } = {} as any
  if (type === 'people') {
    res = await request<{
      contact: UserContact
      friend: UserFriend
      room: RoomVo
    }>('/api/contacts/friends/prepare', {}, {
      data: {
        userId: key,
      },
      method: 'POST',
    }) || {} as any
  }
  else if (type === 'group') {
    res = await request<{
      contact: UserContact
      group: GroupVo
      room: RoomVo
    }>('/api/contacts/groups/prepare', {}, {
      data: {
        groupId: key,
      },
      method: 'POST',
    }) || {} as any
  }
  return {
    roomId: res!.room.id,
    roomType: res!.room.type,
  }
}

/**
 * @description 获取聊天室信息
 */
export async function getRoomInfo({ room }: { room: RoomVo }) {
  return await request<{
    contact: UserContact
    friendRoom: FriendRoom
    groupRoom: GroupVo
    room: RoomVo
  }>(`/api/rooms/${room.id}`, {})
}

/**
 * @description 获取单聊对方信息
 */
export async function getFriendInfo(id: string, userID: string) {
  if (!id) {
    throw new Error('id is required')
  }
  if (!userID) {
    throw new Error('userID is required')
  }
  const roomInfo = await getRoomInfo({ room: { id } as RoomVo })
  const user1ID = roomInfo?.friendRoom.user1Id
  const user2ID = roomInfo?.friendRoom.user2Id
  if (user1ID === userID) {
    return await getUserInfo(user2ID!)
  }
  else {
    return await getUserInfo(user1ID!)
  }
}

/**
 * @description 获取群聊信息
 */
export async function getGroupInfo(id: string) {
  return await request<GroupVo>(`/api/groups/${id}`, {})
}

/**
 * @description 获取用户信息
 */
export async function getUserInfo(id: string) {
  return await request<UserVo>(`/api/users/${id}`, {})
}

/**
 * @description 获取联系记录
 */
export async function getContactRecord(id: string, type: string) {
  let res: {
    avatar: null | string
    name?: null | string
    nickname?: null | string
  } = {
    avatar: null,
  }
  if (type === 'GROUP') {
    res = await getGroupInfo(id) as GroupVo
  }
  else {
    res = await getUserInfo(id) as UserVo
  }
  return {
    avatar: res!.avatar,
    name: res!.name || res!.nickname,
  }
}

/**
 * @description 获取当前房间的对称性密钥
 */
export function getSymmetricKey(roomId: string) {
  const roomKeysMap = JSON.parse(localStorage.getItem('roomKeysMap') || '{}')
  if (roomKeysMap[roomId]) {
    return roomKeysMap[roomId] as string
  }
  return null
}
