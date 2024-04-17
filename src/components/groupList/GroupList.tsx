import type { Group } from '@prisma/client'

import { request } from '@/app/utils/request'
import { Avatar, Button, List } from 'antd'
import React from 'react'

interface IGroupListProps {
  groupList: Group[]
  setGroupInfo?: React.Dispatch<React.SetStateAction<Group | undefined>>
  type: 'apply' | 'chat'
}

function GroupList({ groupList, setGroupInfo, type }: IGroupListProps) {
  async function handleMenuClick(item: Group) {
    const res = await request<Group>(`/api/groups/${item.id}`, {})
    setGroupInfo && setGroupInfo(res!)
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
            description={item.name}
            title="群聊"
          />
        </List.Item>
      )}
    />
  )
}
export default GroupList
