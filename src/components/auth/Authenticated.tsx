'use client'

import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function Authenticated() {
  const router = useRouter()
  useSession({
    onUnauthenticated() {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`)
    },
    required: true,
  })
  return null
}
