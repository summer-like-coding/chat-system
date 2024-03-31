'use client'

import Chat from '@/components/chat/Chat'
import { TeamOutlined, UserOutlined } from '@ant-design/icons'
import { Input, Layout, Menu } from 'antd'
import React from 'react'

import './style.css'

export default function Bot() {
  const { Search } = Input
  const { Content, Header, Sider } = Layout
  const items = [UserOutlined, TeamOutlined].map(
    (icon, index) => ({
      icon: React.createElement(icon),
      key: String(index + 1),
      label: `nav ${index + 1}`,
    }),
  )
  return (
    <>
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
          <div className="w-full">
            <div className="float-left ml-2">机器人聊天</div>
          </div>
        </Header>
        <Content
          className="content-container"
        >
          <Chat />
        </Content>
      </Layout>
    </>
  )
}
