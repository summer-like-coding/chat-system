import type { Permission } from '@prisma/client'

import { prisma } from '@/lib/db'

import { AbstractService } from './_base'

/**
 * 权限服务
 */
export class PermissionService extends AbstractService<Permission> {
  delegate = prisma.permission
}

export const permissionService = new PermissionService()
