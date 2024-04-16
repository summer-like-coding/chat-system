/* eslint-disable node/prefer-global/process */
'use client'

import type { Message } from '@prisma/client'

import ToolBar from '@/components/toolbar/Toolbar'
import { emitter } from '@/utils/eventBus'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { useInterval } from 'ahooks'
import { Layout } from 'antd'
import { SessionProvider } from 'next-auth/react'
import React, { useEffect } from 'react'
import { io } from 'socket.io-client'

import './globals.css'
import { useUserStore } from './store/user'
import { request } from './utils/request'

function RootLayout({ children }: React.PropsWithChildren) {
  const { Sider } = Layout
  const useStore = useUserStore(state => state.user)!
  function isHidden() {
    return useStore === null || useStore === undefined
  }

  function sendHeartbeat() {
    request('/api/rooms/heartbeat', {})
  }

  useInterval(() => {
    if (useStore) {
      sendHeartbeat()
    }
  }, 10000, {
    immediate: true,
  })

  useEffect(() => {
    async function getToken() {
      const res = await request<{ token: string }>(`/api/users/${useStore?.id}/getToken`)
      // 发送凭证
      const socket = io(process.env.NEXT_PUBLIC_SOCKETIO_SERVER_URL!, {
        auth: {
          token: res?.token,
        },
        path: process.env.NEXT_PUBLIC_SOCKETIO_PATH,
      })
      socket.on('hello', (d: string) => {
        emitter.emit('hello', d)
      })
      socket.on('imMessage', (d: Message) => {
        emitter.emit('imMessage', d)
      })
      socket.on('connect_error', (error: Error) => {
        console.error('connect_error', error)
      })
    }

    if (useStore) {
      getToken()
    }
  }, [useStore])

  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <AntdRegistry>
            <Layout className="layout-container">
              <Sider
                hidden={isHidden()}
                style={{
                  backgroundColor: '#2e2e2e',
                  borderRight: '1px solid #fefefe',
                  color: '#848484',
                  textAlign: 'center',
                }}
                width="4%"
              >
                <ToolBar />
              </Sider>
              {children}
            </Layout>
          </AntdRegistry>
        </SessionProvider>
      </body>
    </html>
  )
}

export default RootLayout
