'use server'

import type { User } from '@prisma/client'

import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

interface RegisterUserType {
  password: string
  username: string
}

/**
 * 注册用户
 * @param data 表单数据
 * @returns 注册信息
 */
export async function registerUser(data: RegisterUserType): Promise<{
  error?: string
  user?: User
}> {
  const { password, username } = data
  const user = await prisma.user.findFirst({
    where: {
      username,
    },
  })
  if (user)
    return { error: 'Username already exists' }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  const newUser = await prisma.user.create({
    data: {
      password: hashedPassword,
      username,
    },
  })
  return { user: newUser }
}
