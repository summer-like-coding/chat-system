'use client'
import { ProChat } from '@ant-design/pro-chat'
import { useTheme } from 'antd-style'
import { useEffect, useState } from 'react'

export default function BotChat({ chatKey }: { chatKey: string }) {
  const theme = useTheme()
  const [showComponent, setShowComponent] = useState(false)

  useEffect(() => setShowComponent(true), [])

  return (
    <div
      style={{
        backgroundColor: theme.colorBgLayout,
      }}
    >
      {showComponent && (
        <ProChat
          request={async (msg) => {
            const res = await fetch('/api/robot/chat', {
              body: JSON.stringify({
                model: chatKey,
                prompt: msg,
              }),
              method: 'POST',
            })
            // console.log('res', res)
            return res
          }}
        />
      )}
    </div>
  )
}
