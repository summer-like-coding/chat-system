'use client'
import type { User } from '@prisma/client'

import { useUserStore } from '@/app/store/user'
import { CommentOutlined, LogoutOutlined, MessageOutlined, PlusSquareOutlined, RobotOutlined, SettingOutlined, UserAddOutlined } from '@ant-design/icons'
import { useBoolean } from 'ahooks'
import { Avatar, Badge, Button, List, Modal, Popover } from 'antd'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useState } from 'react'

import SearchInput from '../searchInput/SearchInput'
import Setting from '../setting/Setting'
import UserList from '../userList/UserList'

type IUser = Pick<User, 'description' | 'id' | 'nickname'>
import './style.css'

function ToolBar() {
  const router = useRouter()
  const useStore = useUserStore(state => state.user)!
  const removeUserStore = useUserStore(state => state.removeUser)
  const [modalVisible, { setFalse: setModalFalse, setTrue: setModalTrue }] = useBoolean(false)
  const [addModalVisible, { setFalse: setAddModalFalse, setTrue: setAddModalTrue }] = useBoolean(false)
  const [modalType, setModalType] = useState<string>('help')
  const [addModalType, setAddModalType] = useState<string>('addFriend')
  const [applyUserList, _setApplyUserList] = useState<IUser[]>([])

  const hoverItemContent = {
    help: {
      content: <div
        className="flex items-center"
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
        className="flex items-center"
        key="3"
        onClick={() => {
          setModalType('logout')
          signOut({
            callbackUrl: '/login',
          })
            .then(() => {
              removeUserStore()
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
        className="flex items-center"
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

  const addUserModalContent = {
    addFriend: {
      content: <div className="ml-2 flex flex-col flex-nowrap items-center">
        <Button
          icon={<UserAddOutlined />}
          onClick={() => {
            setAddModalType('addFriend')
            setAddModalTrue()
          }}
          size="large"
        />
        添加好友
      </div>,
      modalContent: <div>
        <SearchInput type="user" usedBy="apply" />
        <UserList
          type="apply"
          userList={applyUserList}
        />
      </div>,
      title: '添加好友',
    },
    addGroup: {
      content: <div className="flex flex-col flex-nowrap items-center">
        <Button
          icon={<MessageOutlined />}
          onClick={() => {
            setAddModalType('addGroup')
            setAddModalTrue()
          }}
          size="large"
        />
        发起群聊
      </div>,
      modalContent: <div>
        <SearchInput type="user" usedBy="apply" />
        <UserList
          type="apply"
          userList={applyUserList}
        />
      </div>,
      title: '发起群聊',
    },
  }

  const contentList = [hoverItemContent.help.content, hoverItemContent.setting.content, hoverItemContent.logout.content]

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
            {useStore?.nickname || '未知'}
          </p>
          <p>
            生日:
            {' '}
            {useStore?.birthday ? new Date(useStore.birthday).toLocaleDateString() : '未知'}
          </p>
          <p>
            性别:
            {' '}
            {useStore?.gender || '未知'}
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

  function menuClick(key: string) {
    if (key === 'chat') {
      router.push('/chat')
    }
    else if (key === 'bot') {
      router.push('/bot')
    }
    else {
      router.push('/')
    }
  }

  function beforeOpen() {
    if (!useStore) {
      // setTimeout(() => router.push('/login'))
      return false
    }
    else {
      return modalVisible
    }
  }

  return (
    <aside className="side-toolbar">
      <div>
        <Popover
          content={settingInfo}
          placement="right"
          trigger="click"
        >
          <Avatar size={48} src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
        </Popover>
        <div className="mt-4 flex flex-col items-center">
          <Badge overflowCount={99}>
            <MessageOutlined
              onClick={() => {
                menuClick('chat')
              }}
              style={{ color: '#848484', fontSize: 28 }}
            />
          </Badge>
          <RobotOutlined
            onClick={() => {
              menuClick('bot')
            }}
            style={{ color: '#848484', fontSize: 28, marginTop: 20 }}
          />
          <Popover
            content={(
              <div className="flex flex-row justify-center">
                {addUserModalContent.addGroup.content}
                {addUserModalContent.addFriend.content}
              </div>
            )}
            placement="right"
            trigger="click"
          >
            <PlusSquareOutlined
              style={{ color: '#848484', fontSize: 28, marginTop: 20 }}
            />
          </Popover>

        </div>
      </div>
      {/* 账号相关modal */}
      <Modal
        footer={null}
        onCancel={setModalFalse}
        open={beforeOpen()}
        title={hoverItemContent[modalType as keyof typeof hoverItemContent].title}
      >
        {
          modalType === 'logout' ? <div>正在退出中...</div> : hoverItemContent[modalType as keyof typeof hoverItemContent].modalContent
        }
      </Modal>
      {/* 添加用户相关 */}
      <Modal
        footer={null}
        onCancel={setAddModalFalse}
        open={addModalVisible}
        title={addUserModalContent[addModalType as keyof typeof addUserModalContent].title}
      >
        {addUserModalContent[addModalType as keyof typeof addUserModalContent].modalContent}
      </Modal>
    </aside>
  )
}

export default ToolBar
