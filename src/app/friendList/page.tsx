'use client'
import type { Group, User } from '@prisma/client'

import UserList from '@/components/userList/UserList'
import { Tabs } from 'antd'
import React, { useEffect, useState } from 'react'

import { useUserStore } from '../store/user'
import { request } from '../utils/request'

type IUser = Pick<User, 'description' | 'id' | 'nickname'>
export default function FriendList() {
  const userStore = useUserStore(state => state.user)
  const [userList, setUserList] = useState<IUser[]>([])
  const [_groupList, setGroupList] = useState<Group[]>([])

  useEffect(() => {
    if (userStore) {
      request<IUser[]>(`/api/users/${userStore.id}/friends`).then((res) => {
        res && setUserList(res)
      })
    }
  }, [userStore])

  async function handleTabClick(key: string) {
    if (key === 'groupList') {
      const res = await request<IUser[]>(`/api/users/${userStore!.id}/groups`)
      res && setUserList(res)
    }
    else {
      const res = await request<Group[]>(`/api/users/${userStore!.id}/friends`)
      res && setGroupList(res)
    }
  }

  const tabItems = {
    groupList: {
      children: <UserList
        type="view"
        userList={userList}
                />,
      key: 'groupList',
      label: '群聊列表',
    },
    userList: {
      children: <UserList
        type="view"
        userList={userList}
                />,
      key: 'userList',
      label: '好友列表',
    },
  }
  return (
    <Tabs
      defaultActiveKey="userList"
      items={Object.values(tabItems)}
      onChange={handleTabClick}
      size="large"
    />
  )
}
