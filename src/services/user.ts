import type { User } from '@prisma/client'

import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

import { AbstractService } from './_base'

/**
 * 注册用户表单数据
 */
interface RegisterUserType {
  email?: string
  password: string
  username: string
}

/**
 * 用户服务
 */
export class UserService extends AbstractService<User> {
  delegate = prisma.user

  asVo(user?: User | null) {
    if (!user)
      return null
    return {
      avatar: user.avatar,
      birthday: user.birthday,
      createdAt: user.createdAt,
      description: user.description,
      email: user.email,
      gender: user.gender,
      id: user.id,
      nickname: user.nickname,
      phone: user.phone,
      status: user.status,
      updatedAt: user.updatedAt,
      username: user.username,
    }
  }

  /**
   * 通过用户名查询用户
   * @param username 用户名
   * @returns 用户信息
   */
  async getUserByUsername(username: string): Promise<User | null> {
    return await prisma.user.findFirst({
      where: {
        username,
      },
    })
  }

  /**
   * 注册用户
   * @param data 表单数据
   * @returns 注册信息
   */
  async registerUser(data: RegisterUserType): Promise<{
    error?: string
    user?: User
  }> {
    const { email, password, username } = data
    const user = await this.getUserByUsername(username)
    if (user)
      return { error: `用户名 ${username} 已经存在` }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
      },
    })
    return { user: newUser }
  }
}

export const userService = new UserService()
