import type { Group } from '@prisma/client'

import { Avatar, Button, List } from 'antd'
import React from 'react'

interface IGroupListProps {
  groupList: Group[]
  type: 'apply' | 'chat'
}

function GroupList({ groupList, type }: IGroupListProps) {
  function handleMenuClick(item: Group) {
    // eslint-disable-next-line no-console
    console.log('item', item)
  }

  function handleListAction(item: Group) {
    const listActionMap = {
      apply: [<Button
        key="list-apply"
        onClick={() => handleMenuClick(item)}
        type="link"
              >
        申请
      </Button>],
      chat: [<Button
        key="list-chat"
        onClick={() => {
          handleMenuClick(item)
        }}
        type="link"
             >
        聊天
      </Button>],
    }
    return listActionMap[type]
  }

  return (
    <List
      dataSource={groupList}
      itemLayout="horizontal"
      renderItem={(item, index) => (
        <List.Item
          actions={handleListAction(item)}
        >
          <List.Item.Meta
            avatar={<Avatar size={48} src={item.avatar || `https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
            description={item.description}
            title={item.name}
          />
        </List.Item>
      )}
    />
  )
}
export default GroupList
