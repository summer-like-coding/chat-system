/* eslint-disable tailwindcss/no-custom-classname */
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons'
import { Layout, Menu } from 'antd'
import React, { useState } from 'react'
const { Content, Header, Sider } = Layout

export default function Home() {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <Layout className="layout">
      <Sider collapsed={collapsed} collapsible trigger={null}>
        <div className="logo" />
        <Menu
          defaultSelectedKeys={['1']}
          items={[
            {
              icon: <UserOutlined />,
              key: '1',
              label: 'nav 1',
            },
            {
              icon: <VideoCameraOutlined />,
              key: '2',
              label: 'nav 2',
            },
            {
              icon: <UploadOutlined />,
              key: '3',
              label: 'nav 3',
            },
          ]}
          mode="inline"
          theme="dark"
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
          }}
        >
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => setCollapsed(!collapsed),
          })}
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
          }}
        >
          Content
        </Content>
      </Layout>
    </Layout>
  )
}
