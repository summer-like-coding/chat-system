import type {
  ContactVo,
  FriendApplyVo,
  FriendRoomVo,
  GroupApplyVo,
  GroupRoomVo,
  GroupVo,
  MessageVo,
  RoomVo,
  UserFriendVo,
  UserGroupVo,
  UserVo,
} from '@/types/views'
import type {
  FriendApply,
  FriendRoom,
  Group,
  GroupApply,
  GroupRoom,
  Message,
  Room,
  User,
  UserContact,
  UserFriend,
  UserGroup,
} from '@prisma/client'

import { omit } from 'radash'

export function userVo(user?: User | null): UserVo | null {
  if (!user) {
    return null
  }
  return omit(user, ['isDeleted', 'password'])
}

export function userFriendVo(userFriend?: UserFriend | null): UserFriendVo | null {
  if (!userFriend) {
    return null
  }
  return omit(userFriend, ['isDeleted'])
}

export function groupVo(group?: Group | null): GroupVo | null {
  if (!group) {
    return null
  }
  return omit(group, ['isDeleted'])
}

export function userGroupVo(userGroup?: UserGroup | null): UserGroupVo | null {
  if (!userGroup) {
    return null
  }
  return omit(userGroup, ['isDeleted'])
}

export function contactVo(contact?: UserContact | null): ContactVo | null {
  if (!contact) {
    return null
  }
  return omit(contact, ['isDeleted'])
}

export function roomVo(room?: Room | null): RoomVo | null {
  if (!room) {
    return null
  }
  return omit(room, ['isDeleted'])
}

export function friendRoomVo(friendRoom?: FriendRoom | null): FriendRoomVo | null {
  if (!friendRoom) {
    return null
  }
  return omit(friendRoom, ['isDeleted'])
}

export function groupRoomVo(groupRoom?: GroupRoom | null): GroupRoomVo | null {
  if (!groupRoom) {
    return null
  }
  return omit(groupRoom, ['isDeleted'])
}

export function friendApplyVo(friendApply?: FriendApply | null): FriendApplyVo | null {
  if (!friendApply) {
    return null
  }
  return omit(friendApply, ['isDeleted'])
}

export function groupApplyVo(groupApply?: GroupApply | null): GroupApplyVo | null {
  if (!groupApply) {
    return null
  }
  return omit(groupApply, ['isDeleted'])
}

export function messageVo(message?: Message | null): MessageVo | null {
  if (!message) {
    return null
  }
  return omit(message, ['isDeleted'])
}
