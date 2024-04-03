/**
 * 好友搜索框/群搜索框
 */

import type { User } from '@prisma/client'

import { useUserStore } from '@/app/store/user'
import { request } from '@/app/utils/request'
import { SearchOutlined } from '@ant-design/icons'
import { Select } from 'antd'
import React from 'react'

interface SearchInputProps {
  id?: string
  type: 'group' | 'user'
}

function SearchInput({ type }: SearchInputProps) {
  const userStore = useUserStore(state => state.user)

  function handleRequest(value: string) {
    const requestMap = {
      group: () => {
        request(`/api/groups/${userStore?.id}/friends`).then((res) => {
          // eslint-disable-next-line no-console
          console.log('群组列表', res)
        })
      },
      user: async () => {
        const res = await request<User>('/api/users/getByUsername', {}, {
          data: {
            username: value,
          },
          method: 'POST',
        })
        return res
      },
    }
    requestMap[type]()
  }

  return (
    <Select
      fieldNames={{
        label: 'username',
        value: 'id',
      }}
      notFoundContent={null}
      onSearch={handleRequest}
      placeholder="Search"
      showSearch
      style={{
        width: '100%',
      }}
      suffixIcon={<SearchOutlined />}
    />
  )
}

export default SearchInput
