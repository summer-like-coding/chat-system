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

export type UserVo = Omit<User, 'isDeleted' | 'password'>
export type UserFriendVo = Omit<UserFriend, 'isDeleted'>
export type GroupVo = Omit<Group, 'isDeleted'>
export type UserGroupVo = Omit<UserGroup, 'isDeleted'>
export type ContactVo = Omit<UserContact, 'isDeleted'>
export type RoomVo = Omit<Room, 'isDeleted'>
export type FriendRoomVo = Omit<FriendRoom, 'isDeleted'>
export type GroupRoomVo = Omit<GroupRoom, 'isDeleted'>
export type FriendApplyVo = Omit<FriendApply, 'isDeleted'>
export type GroupApplyVo = Omit<GroupApply, 'isDeleted'>
export type MessageVo = Omit<Message, 'isDeleted'>
