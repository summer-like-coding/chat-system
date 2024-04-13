'use client'
import Chat from '@/components/chat/Chat'
import { emitter } from '@/utils/eventBus'
import React, { useEffect } from 'react'

export default function Page() {
  useEffect(() => {
    function callback(e: string) {
      console.warn(e)
    }
    emitter.on('simpleEmit', callback)
    return () => {
      emitter.off('simpleEmit', callback)
    }
  }, [])
  return (
    <Chat
      chatKey=""
      type="people"
    />
  )
}
