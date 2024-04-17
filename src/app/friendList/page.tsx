'use client'
import type { ProDescriptionsItemProps } from '@ant-design/pro-components'
import type { Group, User } from '@prisma/client'

import Authenticated from '@/components/auth/Authenticated'
import GroupList from '@/components/groupList/GroupList'
import UploadImg from '@/components/uploadImg/UploadImg'
import UserList from '@/components/userList/UserList'
import { ProDescriptions } from '@ant-design/pro-components'
import { Button, Form, Tabs } from 'antd'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

import { useUserStore } from '../store/user'
import { request } from '../utils/request'

type IUser = Pick<User, 'avatar' | 'birthday' | 'description' | 'gender' | 'id' | 'username'>

type chooseItem = Group | IUser

export default function FriendList() {
  const userStore = useUserStore(state => state.user)
  const [userList, setUserList] = useState<IUser[]>([])
  const [groupList, setGroupList] = useState<Group[]>([])
  const [groupUserList, setGroupUserList] = useState<IUser[]>([])
  const [chosedItemInfo, setChosedItemInfo] = useState<chooseItem>()
  const [tabKey, setTabKey] = useState('userList')
  const [formRef] = Form.useForm()
  const actionRef = useRef()
  const router = useRouter()
  useEffect(() => {
    if (userStore) {
      request<IUser[]>(`/api/users/${userStore.id}/friends`).then((res) => {
        res && setUserList(res)
      })
    }
  }, [userStore])

  async function handleTabClick(key: string) {
    setTabKey(key)
    setChosedItemInfo(undefined)
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
        setGroupInfo={setChosedItemInfo as React.Dispatch<React.SetStateAction<Group | undefined>>}
        type="chat"
                />,
      key: 'groupList',
      label: '群聊列表',
    },
    userList: {
      children: <UserList
        setUserInfo={setChosedItemInfo as React.Dispatch<React.SetStateAction<IUser | undefined>>}
        type="chat"
        userList={userList}
                />,
      key: 'userList',
      label: '好友列表',
    },
  }

  const groupItems: ProDescriptionsItemProps[] = [
    {
      dataIndex: 'name',
      label: '群名称',
      valueType: 'text',
    },
    {
      dataIndex: 'avatar',
      label: '头像',
      renderFormItem: () => {
        return (
          <UploadImg
            accountFormRef={formRef}
          />
        )
      },
      valueType: 'image',
    },
    {
      dataIndex: 'description',
      label: '群描述',
      span: 2,
      valueType: 'text',
    },
    {
      dataIndex: 'createdAt',
      editable: false,
      label: '创建时间',
      valueType: 'dateTime',
    },
    {
      dataIndex: 'updatedAt',
      editable: false,
      label: '更新时间',
      valueType: 'dateTime',
    },
    {
      render: () => [
        <Button key="chat" type="primary">
          去聊天
        </Button>,
      ],
      title: '操作',
      valueType: 'option',
    },
  ]

  const userItems: ProDescriptionsItemProps[] = [
    {
      dataIndex: 'avatar',
      label: '头像',
      valueType: 'image',
    },
    {
      dataIndex: 'username',
      label: '用户名',
      valueType: 'text',
    },
    {
      dataIndex: 'description',
      label: '个人描述',
      span: 2,
      valueType: 'text',
    },
    {
      dataIndex: 'birthday',
      label: '生日',
      valueType: 'date',
    },
    {
      render: () => [
        <Button
          key="chat"
          onClick={() => {
            chosedItemInfo && router.push(`/chat?userId=${chosedItemInfo.id}`)
          }}
          type="primary"
        >
          去聊天
        </Button>,
      ],
      title: '操作',
      valueType: 'option',
    },
  ]

  useEffect(() => {
    if (chosedItemInfo) {
      // 如果是群聊，那么获取群聊成员
      if (tabKey === 'groupList') {
        // eslint-disable-next-line no-console
        console.log('群聊')

        request<IUser[]>(`/api/groups/${chosedItemInfo.id}/members/search`, {}, {
          data: {
            keyword: '',
          },
          method: 'POST',
        }).then((res) => {
          res && setGroupUserList(res)
        })
      }
      actionRef.current?.reload()
    }
  }, [chosedItemInfo, tabKey])

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
          width: '25%',
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: '20px', width: '70%' }}>
        {
          chosedItemInfo && (
            <ProDescriptions
              actionRef={actionRef}
              bordered
              column={2}
              columns={tabKey === 'userList' ? userItems : groupItems}
              editable={tabKey === 'userList'
                ? undefined
                : {
                    onSave: async (key, record) => {
                      await request<Group>(`/api/groups/${(record as Group).id}/update`, {}, {
                        data: record,
                        method: 'POST',
                      })
                    },
              }}
              formProps={{ form: formRef }}
              request={async () => {
                return {
                  data: chosedItemInfo,
                }
              }}
              title={tabKey === 'userList' ? '用户信息' : '群聊信息'}
            />
          )
        }
        {
          chosedItemInfo && tabKey === 'groupList' && (
            <UserList
              type="view"
              userList={groupUserList}
            />
          )
        }
      </div>
    </>
  )
}
