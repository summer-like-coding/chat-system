import type { Permission } from '@prisma/client'

import { prisma } from '@/lib/db'

import { AbstractService } from './_base'

/**
 * 权限服务
 */
export class Permissionervice extends AbstractService<Permission> {
  delegate = prisma.permission
}

export const permissionService = new Permissionervice()
