'use client'
import type { User } from '@prisma/client'

type IUser = Pick<User, 'avatar' | 'birthday' | 'description' | 'gender' | 'id' | 'username'>

import SearchInput from '@/components/searchInput/SearchInput'
import UserList from '@/components/userList/UserList'
import { DashOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons'
import { useToggle } from 'ahooks'
import { Layout, Menu } from 'antd'
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
  const [userList, setUserList] = useState<IUser[]>()
  const [userToggle, { toggle }] = useToggle(false)

  useEffect(() => {
    if (userStore) {
      request<IUser[]>(`/api/users/${userStore.id}/friends`).then((res) => {
        res && setUserList(res)
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
          <SearchInput
            type="user"
            usedBy="chat"
          />
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
          <SearchInput
            type="group"
            usedBy="chat"
          />
        </div>
        <div className="slider-content">
          <UserList
            type="view"
            userList={userList!}
          />
        </div>
      </Sider>
    </>
  )
}

export default ChatLayout
