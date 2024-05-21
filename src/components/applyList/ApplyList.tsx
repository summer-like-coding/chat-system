import type { ApplyStatusType, FriendApply, User } from '@prisma/client'

import { useUserStore } from '@/app/store/user'
import { request } from '@/app/utils/request'
import { Avatar, Button, List, message } from 'antd'
import React from 'react'

export interface IApplyList {
  avatar?: string
  launchAvatar?: string
  launchId?: string // 发起用户id
  launchName?: string // 发起用户名称
  status: ApplyStatusType
  targetAvatar?: string
  targetId: string // 目标用户id
  targetName: string
}

interface IApplyListProps {
  applyList: IApplyList[]
  setApplyList: React.Dispatch<React.SetStateAction<IApplyList[]>>
  type: 'launch' | 'target'
}

function ApplyList({ applyList, setApplyList, type }: IApplyListProps) {
  const userStore = useUserStore(state => state.user)
  async function handleAudit(type: 'accept' | 'reject', targetId: string) {
    await request(`/api/applies/friends/${targetId}/audit`, {}, {
      data: {
        opinion: type,
      },
      method: 'POST',
    })
    message.success('操作成功')
    const res = await request<({ target: User, user: User } & FriendApply)[]>(`/api/users/${userStore!.id}/applies`, {
      type: 'target',
    })
    const lists: IApplyList[] = res?.map((item) => {
      return {
        launchAvatar: item.user.avatar!,
        launchId: item.user.id,
        launchName: item.user.nickname || item.user.username,
        status: item.status,
        targetAvatar: item.target.avatar!,
        targetId: item.id,
        targetName: item.target.nickname || item.target.username,
      }
    }) || []
    setApplyList && setApplyList(lists)
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
            onClick={() => handleAudit('reject', item.targetId)}
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
            title={type === 'launch' ? item.launchName : item.targetName}
          />
        </List.Item>
      )}
    />
  )
}
export default ApplyList
