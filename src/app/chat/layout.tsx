'use client'
import ToolBar from '@/components/toolbar/Toolbar'
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { Avatar, Input, Layout, List, Menu } from 'antd'
import React from 'react'

import './style.css'

function chatLayout({ children }: React.PropsWithChildren) {
  const { Content, Header, Sider } = Layout
  const { Search } = Input
  const items = [UserOutlined, VideoCameraOutlined, UploadOutlined, UserOutlined].map(
    (icon, index) => ({
      icon: React.createElement(icon),
      key: String(index + 1),
      label: `nav ${index + 1}`,
    }),
  )

  const data = [
    {
      title: 'Ant Design Title 1',
    },
    {
      title: 'Ant Design Title 2',
    },
    {
      title: 'Ant Design Title 3',
    },
    {
      title: 'Ant Design Title 4',
    },
  ]
  return (
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
      <Sider
        style={{
          backgroundColor: 'transparent',
          borderLeft: '1px solid #fefefe',
        }}
        width="15%"
      >
        <div className="slider-search">
          <Search placeholder="Search" />
        </div>
        <div className="slider-content">
          <List
            dataSource={data}
            itemLayout="horizontal"
            renderItem={(item, index) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                  title={item.title}
                />
              </List.Item>
            )}
          />
        </div>
      </Sider>
    </Layout>
  )
}

export default chatLayout
