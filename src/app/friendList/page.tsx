'use client'
import type { Group, User } from '@prisma/client'

import Authenticated from '@/components/auth/Authenticated'
import GroupList from '@/components/groupList/GroupList'
import UserList from '@/components/userList/UserList'
import { Tabs } from 'antd'
import React, { useEffect, useState } from 'react'

import { useUserStore } from '../store/user'
import { request } from '../utils/request'

type IUser = Pick<User, 'avatar' | 'birthday' | 'description' | 'gender' | 'id' | 'username'>

export default function FriendList() {
  const userStore = useUserStore(state => state.user)
  const [userList, setUserList] = useState<IUser[]>([])
  const [groupList, setGroupList] = useState<Group[]>([])

  useEffect(() => {
    if (userStore) {
      request<IUser[]>(`/api/users/${userStore.id}/friends`).then((res) => {
        res && setUserList(res)
      })
    }
  }, [userStore])

  async function handleTabClick(key: string) {
    if (key === 'groupList') {
      const res = await request<Group[]>(`/api/users/${userStore!.id}/groups`)
      res && setGroupList(res)
    }
    else {
      const res = await request<IUser[]>(`/api/users/${userStore!.id}/friends`)
      res && setUserList(res)
    }
  }

  const tabItems = {
    groupList: {
      children: <GroupList
        groupList={groupList}
        type="chat"
                />,
      key: 'groupList',
      label: '群聊列表',
    },
    userList: {
      children: <UserList
        type="chat"
        userList={userList}
                />,
      key: 'userList',
      label: '好友列表',
    },
  }

  return (
    <>
      <Authenticated />
      <Tabs
        defaultActiveKey="userList"
        items={Object.values(tabItems)}
        onChange={handleTabClick}
        style={{
          backgroundColor: 'white',
          paddingLeft: '1%',
          width: '18%',
        }}
      />
    </>
  )
}
