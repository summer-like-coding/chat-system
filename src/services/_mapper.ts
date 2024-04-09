import type { Group, User } from '@prisma/client'

import { omit } from 'radash'

export function userVo(user?: User | null) {
  if (!user) {
    return null
  }
  return omit(user, ['isDeleted', 'password'])
}

export function groupVo(group?: Group | null): Omit<Group, 'isDeleted'> | null {
  if (!group) {
    return null
  }
  return omit(group, ['isDeleted'])
}
