/**
 * 好友搜索框/群搜索框
 */

import type { FriendApply, Group, User } from '@prisma/client'

import { useUserStore } from '@/app/store/user'
import { request } from '@/app/utils/request'
import { SearchOutlined } from '@ant-design/icons'
import { Button, Select, message } from 'antd'
import React, { useState } from 'react'

import type { IApplyList } from '../applyList/ApplyList'

interface SearchInputProps {
  id?: string
  setList?: React.Dispatch<React.SetStateAction<IApplyList[]>>
  type: 'group' | 'user'
  usedBy: 'apply' | 'chat'
}

function SearchInput({ setList, type, usedBy }: SearchInputProps) {
  const userStore = useUserStore(state => state.user)
  const [options, setOptions] = useState<{
    label: string
    value: string
  }[]>([] as any)

  async function handleRequest(value: string) {
    const requestMap = {
      group: async () => {
        const res = await request<Group[]>('/api/groups/search', {
          page: '1',
          size: '10',
        })
        setOptions(res!.map(item => ({
          label: item.name,
          value: item.id,
        })))
        return res
      },
      user: async () => {
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
    }
    requestMap[type]()
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
        const res = await request<FriendApply[]>(`/api/users/${userStore!.id}/applies`, {})
        const lists: IApplyList[] = res?.map((item) => {
          return {
            status: item.status,
            targetId: item.id,
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
        const res = await request('/api/applies/friends', {}, {
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
      'chat-group': () => {}, // 聊天
      'chat-user': () => {}, // 聊天
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
