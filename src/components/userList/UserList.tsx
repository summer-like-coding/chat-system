import type { User } from '@prisma/client'
import type { PopconfirmProps } from 'antd'

import { useChatStore } from '@/app/store/chat'
import { request } from '@/app/utils/request'
import { Avatar, Button, List, Popconfirm, Popover, message } from 'antd'
import React, { useState } from 'react'

type IUser = Pick<User, 'avatar' | 'birthday' | 'description' | 'gender' | 'id' | 'username'>

interface IUserListProps {
  setUserInfo?: React.Dispatch<React.SetStateAction<IUser | undefined>>
  type: 'apply' | 'chat' | 'chatAndDelete' | 'view' | 'viewAndDelete'
  userList: IUser[]
}

function UserList({ setUserInfo, type, userList }: IUserListProps) {
  const [clickUser, setClickUser] = useState<IUser>({} as User)
  const setTargetId = useChatStore(state => state.setTargetId)
  function handleMenuClick(item: IUser) {
    setClickUser(item)
  }

  async function handleChat(item: IUser) {
    setTargetId(item.id)
    const res = await request<User>(`/api/users/${item.id}`, {})
    res && setUserInfo && setUserInfo(res)
  }

  const friendConfirm: PopconfirmProps['onConfirm'] = () => {
    message.success('Click on Yes')
  }

  const groupUserConfirm: PopconfirmProps['onConfirm'] = () => {
    message.success('Click on Yes')
  }

  function handleListAction(item: IUser, index: number) {
    const listActionMap = {
      apply: [
        <Button
          key="list-apply"
          onClick={() => handleMenuClick(item)}
          type="link"
        >
          申请
        </Button>,
      ],
      chat: [
        <Button
          key="list-chat"
          onClick={() => handleChat(item)}
          type="link"
        >
          聊天
        </Button>,
      ],
      chatAndDelete: [
        <Button
          key="list-chat"
          onClick={() => handleChat(item)}
          type="link"
        >
          聊天
        </Button>,
        <Popconfirm
          cancelText="否"
          key="list-delete"
          okText="是"
          onConfirm={friendConfirm}
          title="确定删除这个好友嘛？"
        >
          <Button danger type="link">删除</Button>
        </Popconfirm>,
      ],
      view: [
        <Popover
          content={() => popOverContent(index)}
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
      ],
      viewAndDelete: [
        <Popover
          content={() => popOverContent(index)}
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
        <Popconfirm
          cancelText="否"
          key="list-delete"
          okText="是"
          onConfirm={groupUserConfirm}
          title="确定删除这个群成员嘛？"
        >
          <Button danger type="link">删除</Button>
        </Popconfirm>,
      ],
    }
    return listActionMap[type]
  }

  function popOverContent(index: number) {
    return (
      <div className="flex w-64 flex-row">
        <div className="basis-1/3">
          <Avatar size={64} src={clickUser.avatar || `https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />
        </div>
        <div>
          <p>
            用户名:
            {clickUser.username}
          </p>
          <p>
            生日:
            {clickUser.birthday ? new Date(clickUser.birthday).toLocaleDateString() : '未知'}
          </p>
          <p>
            性别:
            {clickUser.gender || '未知'}
          </p>
          <p>
            个人描述:
            {clickUser.description || '未知'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <List
      dataSource={userList}
      itemLayout="horizontal"
      renderItem={(item, index) => (
        <List.Item
          actions={handleListAction(item, index)}
        >
          <List.Item.Meta
            avatar={<Avatar size={48} src={item.avatar || `https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
            description={item.username}
            title="用户"
          />
        </List.Item>
      )}
    />
  )
}
export default UserList
