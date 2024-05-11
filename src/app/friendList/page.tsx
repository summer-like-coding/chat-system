'use client'
import type { UserVo } from '@/types/views'
import type { ProCoreActionType, ProDescriptionsItemProps } from '@ant-design/pro-components'
import type { Group, GroupRoleType, User, UserGroup } from '@prisma/client'

import Authenticated from '@/components/auth/Authenticated'
import { getRoomId } from '@/components/chat/utils'
import GroupList from '@/components/groupList/GroupList'
import UploadImg from '@/components/uploadImg/UploadImg'
import UserList from '@/components/userList/UserList'
import { ProDescriptions } from '@ant-design/pro-components'
import { Button, Form, Tabs } from 'antd'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

import { useChatStore } from '../store/chat'
import { useUserStore } from '../store/user'
import { request } from '../utils/request'
import './styles.css'

type IUser = {
  owner?: GroupRoleType
} & Pick<User, 'avatar' | 'birthday' | 'description' | 'gender' | 'id' | 'username'>

type chooseItem = Group | IUser

export default function FriendList() {
  const setChatId = useChatStore(state => state.setChatId)
  // const setChatType = useChatStore(state => state.setChatType)
  const userStore = useUserStore(state => state.user)
  const [userList, setUserList] = useState<IUser[]>([])
  const [groupList, setGroupList] = useState<Group[]>([])
  const [groupUserList, setGroupUserList] = useState<IUser[]>([])
  const [chosedItemInfo, setChosedItemInfo] = useState<chooseItem>()
  const [tabKey, setTabKey] = useState('userList')
  const [formRef] = Form.useForm()
  const actionRef = useRef<ProCoreActionType>()
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
        type="chatAndDelete"
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
        <Button
          key="chat"
          onClick={async () => {
            if (chosedItemInfo) {
              const { roomId } = await getRoomId(chosedItemInfo.id, 'group')
              setChatId(roomId)
              // setChatType(roomType)
              router.push(`/chat?roomId=${roomId}`)
            }
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
      dataIndex: 'gender',
      label: '性别',
      valueType: 'text',
    },
    {
      dataIndex: 'birthday',
      label: '生日',
      valueType: 'date',
    },
    {
      dataIndex: 'description',
      label: '个人描述',
      span: 2,
      valueType: 'text',
    },
    {
      render: () => [
        <Button
          key="chat"
          onClick={async () => {
            if (chosedItemInfo) {
              const { roomId } = await getRoomId(chosedItemInfo.id, 'people')
              setChatId(roomId)
              router.push(`/chat?roomId=${roomId}`)
            }
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
      if (tabKey === 'groupList') {
        request<({ user: UserVo } & UserGroup)[]>(`/api/groups/${chosedItemInfo.id}/members`).then((res) => {
          res && setGroupUserList(res.map((item) => {
            return {
              ...item.user,
              owner: item.groupRole,
            }
          }))
        })
      }
      actionRef.current?.reload()
    }
  }, [chosedItemInfo, tabKey])

  return (
    <div
      className="friendList-wrapper"
      style={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <Authenticated />
      <div
        style={{
          width: '320px',
        }}
      >
        <Tabs
          defaultActiveKey="userList"
          items={Object.values(tabItems)}
          onChange={handleTabClick}
          type="card"
        />
      </div>
      <div
        className="friendList-content"
        style={{
          padding: 20,
        }}
      >
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
                      const res = await request<Group[]>(`/api/users/${userStore!.id}/groups`)
                      res && setGroupList(res)
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
              type="viewAndDelete"
              userList={groupUserList}
            />
          )
        }
      </div>
    </div>
  )
}
