'use client'
import type { User } from '@prisma/client'

type IUser = Pick<User, 'description' | 'id' | 'nickname'>

import SearchInput from '@/components/searchInput/SearchInput'
import { DashOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons'
import { useToggle } from 'ahooks'
import { Avatar, Button, Layout, List, Menu, Popover } from 'antd'
import React, { useEffect, useState } from 'react'

import { useUserStore } from '../store/user'
import { request } from '../utils/request'
import './style.css'

function ChatLayout({ children }: React.PropsWithChildren) {
  const { Content, Header, Sider } = Layout
  const userStore = useUserStore(state => state.user)
  const items = [UserOutlined, TeamOutlined].map(
    (icon, index) => ({
      icon: React.createElement(icon),
      key: String(index + 1),
      label: `nav ${index + 1}`,
    }),
  )
  const [userList, setUserList] = useState<IUser[]>([
    { description: 'description1', id: '1', nickname: 'user1' },
    { description: 'description2', id: '2', nickname: 'user2' },
  ])
  const [clickUser, setClickUser] = useState<IUser>({} as User)
  const [userToggle, { toggle }] = useToggle(false)

  function handleMenuClick(item: IUser) {
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
            {clickUser.nickname}
          </p>
          <p>
            年龄:
            {clickUser.nickname || '未知'}
          </p>
          <p>
            性别:
            {clickUser.nickname || '未知'}
          </p>
        </div>
      </div>
    )
  }

  useEffect(() => {
    if (userStore) {
      request<IUser[]>(`/api/users/${userStore.id}/friends`).then((res) => {
        setUserList(res)
      })
    }
  }, [userStore])

  return (
    <>
      <Sider
        style={{
          backgroundColor: 'transparent',
        }}
        width="15%"
      >
        <div className="slider-search">
          {/* <Search placeholder="Search" /> */}
          <SearchInput type="user" />
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
            <div className="float-left ml-2">聊天室</div>
            <div className="float-right mr-2">
              <DashOutlined
                onClick={toggle}
                size={32}
              />
            </div>
          </div>
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
          display: userToggle ? 'block' : 'none',
        }}
        width="18%"
      >
        <div className="slider-search">
          {/* <Search placeholder="Search" /> */}
          <SearchInput type="group" />
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
                  </Popover>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar size={48} src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                  description={item.description}
                  title={item.nickname}
                />
              </List.Item>
            )}
          />
        </div>
      </Sider>
    </>
  )
}

export default ChatLayout
