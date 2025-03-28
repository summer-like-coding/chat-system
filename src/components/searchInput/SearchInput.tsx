/**
 * 好友搜索框/群搜索框
 */

import type { UserVo } from '@/types/views'
import type { FriendApply, Group, GroupRoleType, User, UserGroup } from '@prisma/client'

import { useChatStore } from '@/app/store/chat'
import { useUserStore } from '@/app/store/user'
import { request } from '@/app/utils/request'
import { SearchOutlined } from '@ant-design/icons'
import { Button, Select, message } from 'antd'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

import type { IApplyList } from '../applyList/ApplyList'

import { getRoomId } from '../chat/utils'

type IUser = {
  owner?: GroupRoleType
} & Pick<User, 'avatar' | 'birthday' | 'description' | 'gender' | 'id' | 'username'>

interface SearchInputProps {
  id?: string
  setGroupUserList?: React.Dispatch<React.SetStateAction<IUser[]>>
  setList?: React.Dispatch<React.SetStateAction<IApplyList[]>>
  targetId?: string
  type: 'group' | 'user'
  usedBy: 'add' | 'apply' | 'chat' | 'search'
}

function SearchInput({ setGroupUserList, setList, targetId, type, usedBy }: SearchInputProps) {
  const router = useRouter()
  const userStore = useUserStore(state => state.user)
  const setChatId = useChatStore(state => state.setChatId)
  const [options, setOptions] = useState<{
    label: string
    value: string
  }[]>([] as any)

  async function handleRequest(value: string) {
    const requestMap = {
      'add-group': () => { },
      'add-user': async () => {
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
      'apply-group': async () => {
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
      'search-group': () => { }, // 查看群组信息
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
        const res = await request<({ target: User, user: User } & FriendApply)[]>(`/api/users/${userStore!.id}/applies`, {
          type: 'self',
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
        setList && setList(lists)
      },
    }
    queryAppliesMap[type]()
  }
  function handleClick(value: string) {
    const handleClickMap = {
      'add-group': () => { }, // 添加群组
      'add-user': async () => {
        if (!targetId)
          return message.error('请先选择群组')
        await request<User[]>(`/api/groups/${targetId}/members/add`, {}, {
          data: {
            userIdList: [value],
          },
          method: 'POST',
        })
        message.success('添加成功')
        request<({ user: UserVo } & UserGroup)[]>(`/api/groups/${targetId}/members`).then((res) => {
          res && setGroupUserList && setGroupUserList(res.map((item) => {
            return {
              ...item.user,
              owner: item.groupRole,
            }
          }))
        })
      }, // 添加好友进入群组
      'apply-group': () => { }, // 申请加入群组
      'apply-user': async () => {
        await request('/api/applies/friends/apply', {}, {
          data: {
            targetId: value,
            userId: userStore!.id,
          },
          method: 'POST',
        })
        message.success('申请成功')
        queryApplies()
      }, // 申请加好友
      'chat-group': async () => {
        const { roomId } = await getRoomId(value, 'group')
        setChatId(roomId)
        router.push(`/chat/${roomId}?type=group`)
      }, // 聊天
      'chat-user': async () => {
        const { roomId } = await getRoomId(value, 'people')
        setChatId(roomId)
        router.push(`/chat/${roomId}?type=friend`)
      }, // 聊天
      'search-group': () => { }, // 查看群组信息
      'search-user': () => { }, // 查看好友信息
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
            {usedBy === 'apply' ? '申请' : (usedBy === 'add' ? '添加' : '聊天')}
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
