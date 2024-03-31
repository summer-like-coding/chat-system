'use client'
import ToolBar from '@/components/toolbar/Toolbar'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { Layout } from 'antd'
import { SessionProvider } from 'next-auth/react'
import React from 'react'

import './globals.css'

function RootLayout({ children }: React.PropsWithChildren) {
  const { Sider } = Layout

  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <AntdRegistry>
            <Layout className="layout-container">
              <Sider
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
