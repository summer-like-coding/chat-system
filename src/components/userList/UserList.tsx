import type { User } from '@prisma/client'

import { useChatStore } from '@/app/store/chat'
import { Avatar, Button, List, Popover } from 'antd'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

type IUser = Pick<User, 'avatar' | 'birthday' | 'description' | 'gender' | 'id' | 'username'>

interface IUserListProps {
  type: 'apply' | 'chat' | 'view'
  userList: IUser[]
}

function UserList({ type, userList }: IUserListProps) {
  const [clickUser, setClickUser] = useState<IUser>({} as User)
  const setTargetId = useChatStore(state => state.setTargetId)
  const router = useRouter()
  function handleMenuClick(item: IUser) {
    setClickUser(item)
  }

  function handleChat(item: IUser) {
    setTargetId(item.id)
    router.push(`/chat?userId=${item.id}`)
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
      view: [
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
      ],
    }
    return listActionMap[type]
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
            {clickUser.username}
          </p>
          <p>
            年龄:
            { clickUser.birthday ? clickUser.birthday.getFullYear() : '未知' }
          </p>
          <p>
            性别:
            {clickUser.gender || '未知'}
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
            avatar={<Avatar size={48} src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
            description={item.description}
            title={item.username}
          />
        </List.Item>
      )}
    />
  )
}
export default UserList
