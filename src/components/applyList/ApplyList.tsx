import type { ApplyStatusType } from '@prisma/client'

import { request } from '@/app/utils/request'
import { Avatar, Button, List, message } from 'antd'
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
  async function handleAudit(type: 'accept' | 'reject', targetId: string) {
    // console.log(type)
    const res = await request(`/api/applies/friends/${targetId}/audit`, {}, {
      data: {
        opinion: type,
      },
      method: 'POST',
    })
    // eslint-disable-next-line no-console
    console.log('res', res)
    message.success('操作成功')
  }

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
      IGNORED: [
        <Button
          disabled
          key="ignored"
        >
          已忽略
        </Button>,
      ],
      PENDING: [
        <div
          key="pending"
        >
          <Button
            key="accept-apply"
            onClick={() => handleAudit('accept', item.targetId)}
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
