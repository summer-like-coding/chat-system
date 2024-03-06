import bcrypt from 'bcryptjs'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

import { prisma } from './db'

export interface CredentialsType {
  password: string
  username: string
}

async function login(data: CredentialsType) {
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

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth({
  callbacks: {
    // async signIn({ user, account, profile}) {
    async signIn() {
      return true
    },
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials, _) {
        try {
          return await login(credentials as CredentialsType)
        }
        catch (error) {
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
})
