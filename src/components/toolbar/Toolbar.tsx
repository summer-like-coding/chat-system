/* eslint-disable tailwindcss/no-custom-classname */
'use client'

import { useUserStore } from '@/app/store/user'
import { CommentOutlined, ExclamationCircleOutlined, FileSearchOutlined, LogoutOutlined, MessageOutlined, SettingOutlined } from '@ant-design/icons'
import { useBoolean } from 'ahooks'
import { Avatar, Badge, List, Modal, Popover } from 'antd'
import { signOut } from 'next-auth/react'
import { useState } from 'react'

import Icon from '../icon/Icon'
import Setting from '../setting/Setting'
import './style.css'

function ToolBar() {
  const useStore = useUserStore(state => state.user)!
  const [modalVisible, { setFalse: setModalFalse, setTrue: setModalTrue }] = useBoolean(false)
  const [modalType, setModalType] = useState<string>('about')

  const poverItemContent = {
    about: {
      content: <div
        className="item-center flex"
        key="1"
        onClick={() => {
          setModalType('about')
          setModalTrue()
        }}
               >
        <ExclamationCircleOutlined className="mr-2" size={32} />
        <div className="w-full">
          <div>关于</div>
        </div>
      </div>,
      modalContent: <div className="flex w-full flex-row items-center justify-around">
        <Icon />
        <div>
          <h1 className="mb-2 text-4xl">欢乐聊天时</h1>
          <p className="mb-2 text-base">
            当前版本号：1.0.0 Native
          </p>
        </div>
      </div>,
      title: '关于',
    },
    help: {
      content: <div
        className="item-center flex"
        key="2"
        onClick={() => {
          setModalType('help')
          setModalTrue()
        }}
               >
        <CommentOutlined className="mr-2" size={32} />
        <div>客服与帮助</div>
      </div>,
      modalContent: <div className="flex w-full">
        <div> 请向3244742300@qq.com发送你的疑问 </div>
      </div>,
      title: '客服与帮助',
    },
    logout: {
      content: <div
        className="item-center flex"
        key="3"
        onClick={() => {
          setModalType('logout')
          // setModalTrue()
          signOut({
            callbackUrl: '/login',
          })
        }}
               >
        <LogoutOutlined className="mr-2" size={32} />
        <div>退出账号</div>
      </div>,
      modalContent: <></>,
      title: '退出账号',
    },
    setting: {
      content: <div
        className="item-center flex"
        key="4"
        onClick={() => {
          setModalType('setting')
          setModalTrue()
        }}
               >
        <SettingOutlined className="mr-2" size={32} />
        <div>设置与隐私</div>
      </div>,
      modalContent: <div className="w-full">
        <Setting />
      </div>,
      title: '设置与隐私',
    },
  }

  const contentList = [poverItemContent.about.content, poverItemContent.help.content, poverItemContent.setting.content, poverItemContent.logout.content]

  function userInfo() {
    return (
      <div className="flex w-64 flex-row">
        <div className="basis-1/2">
          <Avatar size={64} src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
        </div>
        <div className="basis-1/2">
          <p>
            用户名:
            {' '}
            {useStore.nickname || '未知'}
          </p>
          <p>
            生日:
            {' '}
            {useStore.birthday ? new Date(useStore.birthday).toLocaleDateString() : '未知'}
          </p>
          <p>
            性别:
            {' '}
            {useStore.gender || '未知'}
          </p>
        </div>
      </div>
    )
  }

  function settingInfo() {
    return (
      <List
        bordered
        dataSource={contentList}
        footer={null}
        header={userInfo()}
        renderItem={item => <List.Item>{item}</List.Item>}
        size="large"
      />
    )
  }

  return (
    <aside className="side-toolbar">
      <div className="tool-content">
        <Popover
          content={settingInfo}
          trigger="click"
        >
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
      <Modal
        footer={null}
        // forceRender
        onCancel={setModalFalse}
        open={modalVisible}
        title={poverItemContent[modalType as keyof typeof poverItemContent].title}
      >
        {poverItemContent[modalType as keyof typeof poverItemContent].modalContent}
      </Modal>
    </aside>
  )
}

export default ToolBar
