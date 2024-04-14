'use client'

import Authenticated from '@/components/auth/Authenticated'

export default function Page() {
  return (
    <>
      <Authenticated />
      <div className="flex size-full">
        <h1>Hello, Next.js!</h1>
      </div>
    </>
  )
}
