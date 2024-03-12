import type { Group } from '@prisma/client'

import { prisma } from '@/lib/db'

import { AbstractService } from './_base'

/**
 * 群组服务
 */
export class Groupervice extends AbstractService<Group> {
  delegate = prisma.group
}

export const groupService = new Groupervice()
