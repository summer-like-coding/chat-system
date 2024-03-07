'use client'

import type {
  ClientSafeProvider,
  LiteralUnion,
} from 'next-auth/react'

import {
  signIn,
  signOut,
} from 'next-auth/react'

interface IProps {
  providers: Record<LiteralUnion<string, string>, ClientSafeProvider>
}

const buttonStyles
  = 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'

export function SignIn({ providers }: IProps) {
  return Object.values(providers).map(provider => (
    <div key={provider.name}>
      <button
        className={buttonStyles}
        onClick={() => signIn(provider.id)}
        type="button"
      >
        Sign in with
        {' '}
        {provider.name}
      </button>
    </div>
  ))
}

export function SignOut() {
  return (
    <button className={buttonStyles} onClick={() => signOut()} type="button">
      Sign Out
    </button>
  )
}
