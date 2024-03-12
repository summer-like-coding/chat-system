import type { Role } from '@prisma/client'

import { prisma } from '@/lib/db'

import { AbstractService } from './_base'

/**
 * 角色服务
 */
export class RoleService extends AbstractService<Role> {
  delegate = prisma.role
}

export const roleService = new RoleService()
