import { registerUser } from '@/services/user'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const res = await registerUser(data)
    if (res.error)
      return NextResponse.error()
    return NextResponse.json(res.user)
  }
  catch (e) {
    console.error('Error:', e)
    return NextResponse.error()
  }
}
