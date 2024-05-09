import type { PageParamsType } from '@/types/global'
import type { User } from '@prisma/client'

import { prisma, transaction } from '@/lib/db'
import { sha256 } from '@/utils/hash'
import bcrypt from 'bcryptjs'
import process from 'node:process'

import { AbstractService } from './_base'
import { userVo } from './_mapper'

/**
 * 注册用户表单数据
 */
export interface RegisterUserType {
  email?: string
  password: string
  username: string
}

export interface LoginCredentialsType {
  password: string
  username: string
}

/**
 * 用户服务
 */
export class UserService extends AbstractService<User> {
  delegate = prisma.user

  asVo(user?: User | null) {
    return userVo(user)
  }

  /**
   * 生成 Token
   * @param userId 用户 ID
   * @returns Token
   */
  async genToken(userId: string): Promise<string> {
    const t = Date.now()
    const AUTH_SECRET = process.env.NEXTAUTH_SECRET!
    const sha = await sha256(`${userId}#${AUTH_SECRET}#${t}`)
    const hash = await bcrypt.hash(`${userId}#${sha}`, 10)
    const token = `${userId}#${t}#${hash}`
    return token
  }

  /**
   * 通过用户名查询用户
   * @param username 用户名
   * @returns 用户信息
   */
  async getUserByUsername(username: string): Promise<User | null> {
    return await prisma.user.findFirst({
      where: {
        isDeleted: false,
        username,
      },
    })
  }

  /**
   * 登录
   */
  async login(data?: LoginCredentialsType): Promise<User> {
    if (!data)
      throw new Error('没有数据')
    const { password, username } = data
    const user = await prisma.user.findFirst({
      where: {
        isDeleted: false,
        username,
      },
    })
    if (!user)
      throw new Error(`用户 ${username} 未找到`)
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect)
      throw new Error('Password is incorrect')
    return user
  }

  /**
   * 注册用户
   * @param data 表单数据
   * @returns 注册信息
   */
  async registerUser(data: RegisterUserType): Promise<User> {
    const { email, password, username } = data
    const user = await transaction(async (ctx) => {
      const user = await ctx.user.findFirst({
        where: {
          username,
        },
      })
      if (user) {
        throw new Error(`用户名 ${username} 已经存在`)
      }
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)
      const newUser = await ctx.user.create({
        data: {
          email,
          password: hashedPassword,
          username,
        },
      })
      return newUser
    })
    return user
  }

  /**
   * 重置密码
   */
  async resetPassword(id: string, oldPassword: string, newPassword: string): Promise<User> {
    const user = await this.getById(id, { isDeleted: false })
    if (!user) {
      throw new Error('用户未找到')
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password)
    if (!isMatch) {
      throw new Error('密码不正确')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)
    const updatedUser = await prisma.user.update({
      data: {
        password: hashedPassword,
      },
      where: {
        id,
        isDeleted: false,
      },
    })
    return updatedUser
  }

  /**
   * 搜索用户
   * @param keyword 关键词
   * @param page 分页参数
   * @returns 用户列表
   */
  async searchUsers(keyword: string, page: PageParamsType) {
    return this.delegate.findMany({
      skip: (page.page - 1) * page.size,
      take: page.size,
      where: {
        isDeleted: false,
        username: {
          contains: keyword,
        },
      },
    })
  }
}

export const userService = new UserService()
