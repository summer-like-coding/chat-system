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
export class FirendRoomService extends AbstractService<Room> {
  delegate = prisma.friendRoom
}

export const firendRoomService = new FirendRoomService()

/**
 * 群聊房间
 */
export class GroupRoomervice extends AbstractService<Room> {
  delegate = prisma.groupRoom
}

export const groupRoomService = new GroupRoomervice()
