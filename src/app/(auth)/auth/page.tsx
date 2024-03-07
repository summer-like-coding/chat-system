'use server'
import { SignIn } from '@/components/auth/AuthButtom'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { getProviders } from 'next-auth/react'

export default async function Page() {
  const session = await getServerSession()
  const providers = await getProviders()

  if (session)
    redirect('/')

  if (!providers)
    return <div>Sign in is not available</div>

  return <SignIn providers={providers} />
}
