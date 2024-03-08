/* eslint-disable tailwindcss/no-custom-classname */
'use client'
import type { User } from '@prisma/client'

import { CommentOutlined, ExclamationCircleOutlined, FileSearchOutlined, LogoutOutlined, MessageOutlined, SettingOutlined, UserSwitchOutlined } from '@ant-design/icons'
import { useToggle } from 'ahooks'
import { Avatar, Badge, List, Popover } from 'antd'
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

  const data = [
    <div className="item-center flex" key="1">
      <ExclamationCircleOutlined size={32} />
      <div>关于钉钉</div>
    </div>,
    // '客服与帮助',
    <div className="item-center flex" key="2">
      <CommentOutlined size={32} />
      <div>客服与帮助</div>
    </div>,
    <div className="item-center flex" key="2">
      <SettingOutlined size={32} />
      <div>设置与隐私</div>
    </div>,
    <div className="item-center flex" key="2">
      <UserSwitchOutlined size={32} />
      <div>切换账号</div>
    </div>,
    <div className="item-center flex" key="2">
      <LogoutOutlined size={32} />
      <div>退出钉钉</div>
    </div>,
  ]

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

  function settingInfo() {
    return (
      <List
        bordered
        dataSource={data}
        footer={<div>Footer</div>}
        header={userInfo()}
        renderItem={item => <List.Item>{item}</List.Item>}
        size="large"
      />
    )
  }

  return (
    <aside className="side-toolbar">
      <div className="tool-content">
        <Popover content={settingInfo} title="用户信息" trigger="click">
          <Avatar size={48} src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
        </Popover>
        <div className="mt-4 flex flex-col items-center">
          <Badge overflowCount={99}>
            <MessageOutlined
              className="tool-icon"
              style={{ color: '#848484', fontSize: 28 }}
            />
          </Badge>
          <FileSearchOutlined
            className="tool-icon"
            style={{ color: '#848484', fontSize: 28, marginTop: 20 }}
          />
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
