import type { User } from '@prisma/client'

import { Avatar, Button, List, Popover } from 'antd'
import React, { useState } from 'react'

type IUser = Pick<User, 'description' | 'id' | 'nickname'>

interface IUserListProps {
  type: 'apply' | 'view'
  userList: IUser[]
}

function UserList({ type, userList }: IUserListProps) {
  const [clickUser, setClickUser] = useState<IUser>({} as User)

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

  return (
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
              {
                type === 'apply'
                  ? (
                    <Button
                      key="list-apply"
                      onClick={() => handleMenuClick(item)}
                      type="link"
                    >
                      添加好友
                    </Button>
                    )
                  : (
                    <Button
                      key="list-view"
                      onClick={() => {
                        handleMenuClick(item)
                      }}
                      type="link"
                    >
                      查看
                    </Button>
                    )
              }
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
  )
}
export default UserList
