'use client'
import type { User } from '@prisma/client'

import ToolBar from '@/components/toolbar/Toolbar'
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { Avatar, Button, Input, Layout, List, Menu, Popover } from 'antd'
import React, { useState } from 'react'

import './style.css'

function ChatLayout({ children }: React.PropsWithChildren) {
  const { Search } = Input
  const { Content, Header, Sider } = Layout
  const items = [UserOutlined, VideoCameraOutlined, UploadOutlined, UserOutlined].map(
    (icon, index) => ({
      icon: React.createElement(icon),
      key: String(index + 1),
      label: `nav ${index + 1}`,
    }),
  )
  const [userList, _setUserList] = useState<User[]>([
    { description: 'description1', id: '1', name: 'user1' },
    { description: 'description2', id: '2', name: 'user2' },
  ])
  const [clickUser, setClickUser] = useState<User>({} as User)

  function handleMenuClick(item: User) {
    setClickUser(item)
  }

  function popOverContent() {
    return (
      <div className="flex w-64 flex-row">
        <div className="basis-1/2">
          <Avatar size={64} src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
        </div>
        <div className="basis-1/2">
          <p>
            用户名:
            {clickUser.name}
          </p>
          <p>
            年龄:
            {clickUser.age || '未知'}
          </p>
          <p>
            性别:
            {clickUser.sex || '未知'}
          </p>
        </div>
      </div>
    )
  }
  return (
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
        width="18%"
      >
        <div className="slider-search">
          <Search placeholder="Search" />
        </div>
        <div className="slider-content">
          <List
            dataSource={userList}
            itemLayout="horizontal"
            renderItem={(item, index) => (
              <List.Item
                actions={[
                  <Popover
                    content={popOverContent}
                    key={`popover${index}`}
                    title="用户信息"
                    trigger="click"
                  >
                    <Button
                      key="list-view"
                      onClick={() => {
                        handleMenuClick(item)
                      }}
                      type="link"
                    >
                      查看
                    </Button>
                    ,
                  </Popover>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar size={48} src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                  description={item.description}
                  title={item.name}
                />
              </List.Item>
            )}
          />
        </div>
      </Sider>
    </Layout>
  )
}

export default ChatLayout
