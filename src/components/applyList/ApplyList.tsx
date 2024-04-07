import type { ApplyStatusType } from '@prisma/client'

import { Avatar, Button, List } from 'antd'
import React from 'react'

export interface IApplyList {
  avatar?: string
  status: ApplyStatusType
  targetId: string
}

interface IApplyListProps {
  applyList: IApplyList[]
}

function ApplyList({ applyList }: IApplyListProps) {
  function handleListAction(item: IApplyList) {
    const actionMap = {
      ACCEPTED: [
        <Button
          disabled
          key="accepted"
        >
          已接受
        </Button>,
      ],
      PENDING: [
        <div
          key="pending"
        >
          <Button
            key="accept-apply"
          >
            接受
          </Button>
          <Button
            className="ml-2"
            key="reject-apply"
          >
            拒绝
          </Button>
        </div>,
      ],
      REJECTED: [
        <Button
          disabled
          key="rejected"
        >
          已拒绝
        </Button>,
      ],
    }
    return actionMap[item.status]
  }
  return (
    <List
      dataSource={applyList}
      itemLayout="horizontal"
      renderItem={(item, index) => (
        <List.Item
          actions={handleListAction(item)}
        >
          <List.Item.Meta
            avatar={<Avatar size={48} src={item.avatar || `https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
            title={item.targetId}
          />
        </List.Item>
      )}
    />
  )
}
export default ApplyList
