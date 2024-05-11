/* eslint-disable node/prefer-global/process */
'use client'

import type { Message } from '@prisma/client'

import ToolBar from '@/components/toolbar/Toolbar'
import { emitter } from '@/utils/eventBus'
import { RobotOutlined } from '@ant-design/icons'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { useInterval } from 'ahooks'
import { FloatButton, Layout } from 'antd'
import { useRouter } from 'next/navigation'
import { SessionProvider } from 'next-auth/react'
import React, { useEffect } from 'react'
import { io } from 'socket.io-client'

import './globals.css'
import { useUserStore } from './store/user'
import { request } from './utils/request'

function RootLayout({ children }: React.PropsWithChildren) {
  const router = useRouter()
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
      const socket = io(process.env.NEXT_PUBLIC_SOCKETIO_SERVER_URL!, {
        auth: {
          token: res?.token,
        },
        path: process.env.NEXT_PUBLIC_SOCKETIO_PATH,
      })
      socket.on('hello', (d: string) => {
        emitter.emit('hello', d)
      })
      // 监听消息
      socket.on('imMessage', (d: Message) => {
        emitter.emit('imMessage', d) // 发送消息
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
                  backgroundColor: '#dbe6fb',
                  borderRight: '1px solid #fefefe',
                  color: '#848484',
                  textAlign: 'center',
                }}
                width="60px"
              >
                <ToolBar />
              </Sider>
              <FloatButton
                icon={(
                  <RobotOutlined />
                )}
                onClick={() => {
                  router.push('/bot')
                }}
                type="default"
              />
              {children}
            </Layout>
          </AntdRegistry>
        </SessionProvider>
      </body>
    </html>
  )
}

export default RootLayout
