import type { NextAuthOptions } from 'next-auth'

import bcrypt from 'bcryptjs'
import CredentialsProvider from 'next-auth/providers/credentials'
import process from 'node:process'

import { prisma } from './db'

export interface CredentialsType {
  password: string
  username: string
}

/**
 * 登录
 * @param data 登录凭证
 * @returns 登录用户信息
 */
async function login(data?: CredentialsType) {
  if (!data)
    throw new Error('No data')
  const { password, username } = data
  const user = await prisma.user.findFirst({
    where: {
      username,
    },
  })
  if (!user)
    throw new Error('User not found')
  const isPasswordCorrect = await bcrypt.compare(password, user.password)
  if (!isPasswordCorrect)
    throw new Error('Password is incorrect')
  return user
}

export const authOptions: NextAuthOptions = {
  pages: {
    error: '/error', // Error code passed in query string as ?error=
    newUser: '/auth/new-user', // New users will be directed here on first sign in (leave the property out if not of interest)
    signIn: '/login',
    signOut: '/signout',
    verifyRequest: '/auth/verify-request', // (used for check email message)
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials, _) {
        try {
          return await login(credentials)
        }
        catch (error) {
          console.error(error)
          return null
        }
      },
      credentials: {
        password: { label: 'Password', type: 'password' },
        username: { label: 'Username', type: 'text' },
      },
      name: 'Credentials',
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
}
