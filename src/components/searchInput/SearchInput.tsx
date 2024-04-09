/**
 * 好友搜索框/群搜索框
 */

import type { FriendApply, Group, User } from '@prisma/client'

import { useChatStore } from '@/app/store/chat'
import { useUserStore } from '@/app/store/user'
import { request } from '@/app/utils/request'
import { SearchOutlined } from '@ant-design/icons'
import { Button, Select, message } from 'antd'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

import type { IApplyList } from '../applyList/ApplyList'

interface SearchInputProps {
  id?: string
  setList?: React.Dispatch<React.SetStateAction<IApplyList[]>>
  type: 'group' | 'user'
  usedBy: 'apply' | 'chat' | 'search'
}

function SearchInput({ setList, type, usedBy }: SearchInputProps) {
  const router = useRouter()
  const userStore = useUserStore(state => state.user)
  const setTargetId = useChatStore(state => state.setTargetId)
  const [options, setOptions] = useState<{
    label: string
    value: string
  }[]>([] as any)

  async function handleRequest(value: string) {
    const requestMap = {
      'apply-group': async () => {
        // 查询所有群组
        const res = await request<Group[]>('/api/groups/search', {}, {
          data: {
            keyword: value,
          },
          method: 'POST',
        })
        setOptions(res!.map(item => ({
          label: item.name,
          value: item.id,
        })))
        return res
      },
      'apply-user': async () => {
        const res = await request<User[]>('/api/users/search', {}, {
          data: {
            keyword: value,
          },
          method: 'POST',
        })
        setOptions(res!.map(item => ({
          label: item.username,
          value: item.id,
        })))
        return res
      },
      'chat-group': async () => {
        // eslint-disable-next-line unused-imports/no-unused-vars
        const res = await request(`/api/groups/${userStore!.id}/members/search`, {}, {
          data: {
            keyword: value,
          },
          method: 'POST',
        })
      }, // 聊天中好友列表
      'chat-user': async () => {
        const res = await request<User[]>(`/api/users/${userStore!.id}/friends/search`, {}, {
          data: {
            keyword: value,
          },
          method: 'POST',
        })
        setOptions(res!.map(item => ({
          label: item.username,
          value: item.id,
        })))
        return res
      }, // 聊天
      'search-group': () => {}, // 查看群组信息
      'search-user': async () => {
        const res = await request<User[]>(`/api/users/${userStore!.id}/friends/search`, {}, {
          data: {
            keyword: value,
          },
          method: 'POST',
        })
        setOptions(res!.map(item => ({
          label: item.username,
          value: item.id,
        })))
        return res
      }, // 查看好友信息
    }
    requestMap[`${usedBy}-${type}`]()
  }

  function queryApplies() {
    const queryAppliesMap = {
      group: async () => {
        const res = await request('/api/applies/groups', {}, {
          data: {
            userId: userStore!.id,
          },
        })
        return res
      },
      user: async () => {
        const res = await request<(FriendApply & { target: User, user: User })[]>(`/api/users/${userStore!.id}/applies`, {})
        const lists: IApplyList[] = res?.map((item) => {
          return {
            status: item.status,
            targetId: item.id,
            targetName: item.user.nickname || item.user.username,
          }
        }) || []
        setList && setList(lists)
        return res
      },
    }
    queryAppliesMap[type]()
  }

  function handleClick(value: string) {
    const handleClickMap = {
      'apply-group': () => {}, // 申请加入群组
      'apply-user': async () => {
        const res = await request('/api/applies/friends/apply', {}, {
          data: {
            targetId: value,
            userId: userStore!.id,
          },
          method: 'POST',
        })
        message.success('申请成功')
        queryApplies()
        return res
      }, // 申请加好友
      'chat-group': () => {
        setTargetId(value)
        router.push(`/chat?userId=${value}`)
      }, // 聊天
      'chat-user': () => {
        setTargetId(value)
        router.push(`/chat?userId=${value}`)
      }, // 聊天
      'search-group': () => {}, // 查看群组信息
      'search-user': () => {}, // 查看好友信息
    }
    handleClickMap[`${usedBy}-${type}`]()
  }

  return (
    <Select
      allowClear
      filterOption={false}
      onFocus={() => {
        handleRequest('')
      }}
      onSearch={handleRequest}
      optionRender={({ label, value }) => (
        <div className="flex flex-row items-center justify-between">
          <div style={{ marginLeft: 8 }}>{label}</div>
          <Button onClick={() => handleClick(value as any)} type="link">
            {usedBy === 'apply' ? '申请' : '聊天'}
          </Button>
        </div>
      )}
      options={options}
      placeholder={`搜索${type === 'group' ? '群组' : '好友'}`}
      showSearch
      style={{ width: '100%' }}
      suffixIcon={<SearchOutlined />}
    />
  )
}

export default SearchInput
