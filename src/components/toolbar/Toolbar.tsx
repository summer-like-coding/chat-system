/* eslint-disable tailwindcss/no-custom-classname */
'use client'
import type { User } from '@prisma/client'

import { MessageOutlined, SettingOutlined } from '@ant-design/icons'
import { useToggle } from 'ahooks'
import { Avatar, Badge, Popover } from 'antd'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import './style.css'

type IUser = Pick<User, 'birthday' | 'description' | 'id' | 'nickname'>

function ToolBar() {
  const [isLogin, { setLeft, setRight }] = useToggle(false)
  const [loginUser, _setLoginUser] = useState<IUser>({} as IUser)
  const router = useRouter()
  function checkLogin() {
    if (sessionStorage.getItem('user'))
      setLeft()
    else
      setRight()

    if (!isLogin)
      router.push('/login')
  }

  function userInfo() {
    return (
      <div className="flex w-64 flex-row">
        <div className="basis-1/2">
          <Avatar size={64} src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
        </div>
        <div className="basis-1/2">
          <p>
            用户名:
            {loginUser.nickname}
          </p>
          <p>
            年龄:
            {loginUser.birthday ? new Date().getFullYear() - (new Date(loginUser.birthday)).getFullYear() : '未知'}
          </p>
          <p>
            性别:
            {loginUser.nickname || '未知'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <aside className="side-toolbar">
      <div className="tool-content">
        {
          isLogin
            ? (
              <Popover content={userInfo} title="用户信息">
                <Avatar size={48} src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
              </Popover>
              )
            : (
              <Avatar onClick={checkLogin} size={48} src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
              )
        }
        <div className="mt-4">
          <Badge overflowCount={99}>
            <MessageOutlined
              className="tool-icon"
              style={{ color: '#848484', fontSize: 28 }}
            />
          </Badge>
        </div>
      </div>
      <div className="tool-footer">
        <Badge overflowCount={99}>
          <SettingOutlined
            className="tool-icon"
            style={{ color: '#848484', fontSize: 28 }}

          />
        </Badge>
      </div>
    </aside>
  )
}

export default ToolBar
