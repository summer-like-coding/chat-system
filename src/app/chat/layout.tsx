'use client'
import type { ContactVo, RoomVo } from '@/types/views'

import { getContactRecord, getRoomInfo } from '@/components/chat/utils'
import SearchInput from '@/components/searchInput/SearchInput'
import { Layout, Menu } from 'antd'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { useChatStore } from '../store/chat'
import { useUserStore } from '../store/user'
import { request } from '../utils/request'
import './style.css'

function ChatLayout({ children }: React.PropsWithChildren) {
  const router = useRouter()
  const { Content, Header, Sider } = Layout
  const userStore = useUserStore(state => state.user)
  const setChatId = useChatStore(state => state.setChatId)
  const [contactList, setContactList] = useState<{
    icon: React.ReactNode
    key: string
    label: string
    type: string
  }[]>()

  useEffect(() => {
    userStore && request<({ room: RoomVo } & ContactVo)[]>(`/api/users/${userStore.id}/contacts`).then(async (res) => {
      if (!res)
        return
      const roomInfos: any = await Promise.all(res.map(async item => getRoomInfo(item)))
      const contactLists = await Promise.all(roomInfos.map(async (item: any) => {
        const info = item!.type === 'GROUP' ? await getContactRecord(item!.groupRoom.groupId, 'GROUP') : await getContactRecord(item!.friendRoom.user1Id, 'PEOPLE')
        return {
          icon: React.createElement('img', { alt: info!.name, src: info!.avatar, style: { borderRadius: '50%', height: '32px', width: '32px' } }),
          key: item!.id,
          label: info!.name,
          type: item!.type,
        }
      }))
      setContactList(contactLists)
    })
  }, [userStore])

  function getChatType(key: string) {
    return (contactList?.find(item => item.key === key)?.type)?.toLocaleLowerCase()
  }

  return (
    <>
      <Sider
        style={{
          backgroundColor: 'transparent',
        }}
        width="240px"
      >
        <div className="slider-search">
          <SearchInput
            type="user"
            usedBy="chat"
          />
        </div>
        <Menu
          items={contactList}
          mode="inline"
          onSelect={({ key }) => {
            const type = getChatType(key)
            setChatId(key)
            router.push(`/chat/${key}?type=${type}`)
          }}
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
          <div className="w-full text-lg">聊天室</div>
        </Header>
        <Content
          className="content-container"
        >
          {children}
        </Content>
      </Layout>
    </>
  )
}

export default ChatLayout
