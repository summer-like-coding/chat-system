'use client'
import Chat from '@/components/chat/Chat'
import { emitter } from '@/utils/eventBus'
import { message } from 'antd'
import React, { useEffect } from 'react'

export default function Page() {
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
    <Chat
      chatKey=""
      type="people"
    />
  )
}
