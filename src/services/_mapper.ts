import type { ContactVo, GroupVo, RoomVo, UserVo } from '@/types/views'
import type { Group, Room, User, UserContact } from '@prisma/client'

import { omit } from 'radash'

export function userVo(user?: User | null): UserVo | null {
  if (!user) {
    return null
  }
  return omit(user, ['isDeleted', 'password'])
}

export function groupVo(group?: Group | null): GroupVo | null {
  if (!group) {
    return null
  }
  return omit(group, ['isDeleted'])
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
