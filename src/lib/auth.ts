import type { NextAuthOptions } from 'next-auth'

import { userService } from '@/services/user'
import CredentialsProvider from 'next-auth/providers/credentials'
import process from 'node:process'

export const authOptions: NextAuthOptions = {
  pages: {
    error: '/error', // Error code passed in query string as ?error=
    newUser: '/login', // New users will be directed here on first sign in (leave the property out if not of interest)
    signIn: '/login',
    signOut: '/signout',
    verifyRequest: '/auth/verify-request', // (used for check email message)
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials, _) {
        try {
          return await userService.login(credentials)
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
