import type { GroupRoleType, User } from '@prisma/client'

import { request } from '@/app/utils/request'
import { Avatar, Button, List, Popconfirm, Popover, message } from 'antd'
import React, { useState } from 'react'

type IUser = {
  owner?: GroupRoleType
} & Pick<User, 'avatar' | 'birthday' | 'description' | 'gender' | 'id' | 'username'>

interface IUserListProps {
  setUserInfo?: React.Dispatch<React.SetStateAction<IUser | undefined>>
  targetId?: string // 如果为群聊，传入群聊id
  type: 'apply' | 'chat' | 'chatAndDelete' | 'view' | 'viewAndDelete'
  userList: IUser[]
}

const GroupRoleTypeMap = {
  ADMIN: '管理员',
  MEMBER: '成员',
  OWNER: '群主',
}

function UserList({ setUserInfo, targetId, type, userList }: IUserListProps) {
  const [clickUser, setClickUser] = useState<IUser>({} as User)
  function handleMenuClick(item: IUser) {
    setClickUser(item)
  }

  async function handleChat(item: IUser) {
    const res = await request<User>(`/api/users/${item.id}`, {})
    res && setUserInfo && setUserInfo(res)
  }

  async function groupUserConfirm(item: IUser) {
    await request(`/api/groups/${targetId}/members/remove`, {}, {
      data: {
        userIdList: [item.id],
      },
      method: 'POST',
    })
    message.success('删除群成员成功')
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
          详情
        </Button>,
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
          onConfirm={() => groupUserConfirm(item)}
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
            title={item.owner ? GroupRoleTypeMap[item.owner] : '好友'}
          />
        </List.Item>
      )}
    />
  )
}
export default UserList
