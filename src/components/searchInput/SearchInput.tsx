/**
 * 好友搜索框/群搜索框
 */

import type { Group, User } from '@prisma/client'

import { useUserStore } from '@/app/store/user'
import { request } from '@/app/utils/request'
import { SearchOutlined } from '@ant-design/icons'
import { Button, Select } from 'antd'
import React, { useState } from 'react'

interface SearchInputProps {
  id?: string
  type: 'group' | 'user'
  usedBy: 'apply' | 'chat'
}

function SearchInput({ type, usedBy }: SearchInputProps) {
  const userStore = useUserStore(state => state.user)
  const [options, setOptions] = useState<{
    label: string
    value: string
  }[]>([] as any)

  async function handleRequest(value: string) {
    const requestMap = {
      group: async () => {
        const res = await request<Group[]>(`/api/groups/${userStore?.id}/friends`)
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

  return (
    <Select
      allowClear
      filterOption={false}
      onFocus={() => {
        handleRequest('')
      }}
      onSearch={handleRequest}
      optionRender={({ label }) => (
        <div className="flex flex-row items-center justify-between">
          <div style={{ marginLeft: 8 }}>{label}</div>
          <Button type="link">
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
