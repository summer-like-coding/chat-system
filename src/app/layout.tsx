'use client'
import ToolBar from '@/components/toolbar/Toolbar'
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { Input, Layout, Menu } from 'antd'
import React from 'react'

import './globals.css'

function RootLayout({ children }: React.PropsWithChildren) {
  const { Content, Header, Sider } = Layout
  const { Search } = Input
  const items = [UserOutlined, VideoCameraOutlined, UploadOutlined, UserOutlined].map(
    (icon, index) => ({
      icon: React.createElement(icon),
      key: String(index + 1),
      label: `nav ${index + 1}`,
    }),
  )
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <Layout className="layut-container">
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
            <Sider
              style={{
                backgroundColor: 'transparent',
              }}
              width="15%"
            >
              <div className="slider-search">
                <Search placeholder="Search" />
              </div>
              <Menu
                items={items}
                mode="inline"
                style={{
                  backgroundColor: '#f5f5f5',
                  color: '#848484',
                }}
              />
            </Sider>
            <Layout>
              <Header
                className="header-container"
                style={{
                  backgroundColor: '#f5f5f5',
                  height: '48px',
                  padding: '0 8px',
                  textAlign: 'center',
                }}
              >
                Header
              </Header>
              <Content
                className="content-container"
              >
                {children}
              </Content>
            </Layout>
          </Layout>
        </AntdRegistry>
      </body>
    </html>
  )
}

export default RootLayout
