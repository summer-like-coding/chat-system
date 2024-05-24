'use client'
import Authenticated from '@/components/auth/Authenticated'
import Chat from '@/components/chat/Chat'
import { emitter } from '@/utils/eventBus'
import { message } from 'antd'
import React, { useEffect } from 'react'

export default function Page({ searchParams }: { parmas: { id: string }, searchParams?: { type?: 'bot' | 'friend' | 'group' } }) {
  useEffect(() => {
    function callback(_e: string) {
      message.success('Socket 服务连接成功！')
    }
    emitter.on('hello', callback)
    return () => {
      emitter.off('hello', callback)
    }
  }, [])
  return (
    <>
      <Authenticated />
      <Chat
        chatKey=""
        type={searchParams?.type || 'friend'}
      />
    </>
  )
}
