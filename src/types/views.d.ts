import type { Group, Room, User, UserContact } from '@prisma/client'

export type UserVo = Omit<User, 'isDeleted' | 'password'>
export type GroupVo = Omit<Group, 'isDeleted'>
export type ContactVo = Omit<UserContact, 'isDeleted'>
export type RoomVo = Omit<Room, 'isDeleted'>
