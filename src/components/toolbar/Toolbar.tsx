'use client'

import type { FriendApply, User } from '@prisma/client'

import { useUserStore } from '@/app/store/user'
import { request } from '@/app/utils/request'
import { applyStatusMapping } from '@/types/mapping'
import { CommentOutlined, LogoutOutlined, MessageOutlined, PlusSquareOutlined, RobotOutlined, SettingOutlined, UnorderedListOutlined, UserAddOutlined } from '@ant-design/icons'
import { useBoolean } from 'ahooks'
import { Avatar, Badge, Button, List, Modal, Popover, Tabs } from 'antd'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'

import type { IApplyList } from '../applyList/ApplyList'

import ApplyList from '../applyList/ApplyList'
import SearchInput from '../searchInput/SearchInput'
import Setting from '../setting/Setting'
import './style.css'

function ToolBar() {
  const router = useRouter()
  const useStore = useUserStore(state => state.user)!
  const removeUserStore = useUserStore(state => state.removeUser)
  const [modalVisible, { setFalse: setModalFalse, setTrue: setModalTrue }] = useBoolean(false)
  const [addModalVisible, { setFalse: setAddModalFalse, setTrue: setAddModalTrue }] = useBoolean(false)
  const [modalType, setModalType] = useState<string>('help')
  const [addModalType, setAddModalType] = useState<string>('addFriend')
  const [applyList, setApplyList] = useState<IApplyList[]>([])

  async function handleTabClick(key: string) {
    const res = await request<(FriendApply & { target: User, user: User })[]>(`/api/users/${useStore!.id}/applies`, {
      type: key === 'applyUser' ? 'self' : 'target',
    })
    const lists: IApplyList[] = res?.map((item) => {
      return {
        status: item.status,
        targetId: item.id,
        targetName: item.user.nickname || item.user.username,
      }
    }) || []
    setApplyList(lists)
  }

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
      modalContent: <Tabs
        defaultActiveKey="applyUser"
        items={[{
          children: <div>
            <SearchInput
              setList={setApplyList}
              type="user"
              usedBy="apply"
            />
            <List
              dataSource={applyList}
              itemLayout="horizontal"
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar size={48} src={item.avatar || `https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                    description={applyStatusMapping[item.status]}
                    title={item.targetId}
                  />
                </List.Item>
              )}
            />
          </div>,
          key: 'applyUser',
          label: '申请好友',
        }, {
          children: <div>
            <ApplyList
              applyList={applyList}
            />
          </div>,
          key: 'appliedUser',
          label: '新朋友',
        }]}
        onTabClick={key => handleTabClick(key)}
                    />,
      title: '好友',
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
      modalContent: <Tabs
        defaultActiveKey="applyGroup"
        items={[{
          children: <div>
            <SearchInput
              setList={setApplyList}
              type="group"
              usedBy="apply"
            />
            <ApplyList
              applyList={applyList}
            />
          </div>,
          key: 'applyGroup',
          label: '发起群聊',
        }]}
                    />,
      title: '群聊',
    },
  }

  const contentList = [hoverItemContent.help.content, hoverItemContent.setting.content, hoverItemContent.logout.content]

  function userInfo() {
    return (
      <div className="flex w-64 flex-row">
        <div className="basis-1/2">
          <Avatar size={64} src={useStore?.avatar || 'https://api.dicebear.com/7.x/miniavs/svg?seed=2'} />
        </div>
        <div className="basis-1/2">
          <p>
            昵称:
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
    else if (key === 'friendList') {
      router.push('/friendList')
    }
    else {
      router.push('/')
    }
  }

  function beforeOpen() {
    if (!useStore) {
      return false
    }
    else {
      return modalVisible
    }
  }

  useEffect(() => {
    return () => {
      setApplyList([])
    }
  }, [])

  return (
    <aside className="side-toolbar">
      <div>
        <Popover
          content={settingInfo}
          placement="right"
          trigger="click"
        >
          <Avatar size={36} src={useStore?.avatar || 'https://api.dicebear.com/7.x/miniavs/svg?seed=2'} />
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
          <UnorderedListOutlined
            onClick={() => {
              menuClick('friendList')
            }}
            style={{ color: '#848484', fontSize: 28, marginTop: 20 }}
          />
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
