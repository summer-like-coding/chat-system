/* eslint-disable no-console */
'use client'

import type { FriendApply, User } from '@prisma/client'
import type { TransferProps } from 'antd'
import type { Key } from 'react'

import { useUserStore } from '@/app/store/user'
import { request } from '@/app/utils/request'
import { applyStatusMapping } from '@/constants/mapping'
import { CommentOutlined, LogoutOutlined, MessageOutlined, PlusSquareOutlined, SettingOutlined, UnorderedListOutlined, UserAddOutlined } from '@ant-design/icons'
import { useBoolean } from 'ahooks'
import { Avatar, Badge, Button, Form, Input, List, Modal, Popover, Tabs, Transfer, message } from 'antd'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'

import type { IApplyList } from '../applyList/ApplyList'

import ApplyList from '../applyList/ApplyList'
import SearchInput from '../searchInput/SearchInput'
import Setting from '../setting/Setting'
import './style.css'

interface TransferType {
  key: string
  title: string
}

function ToolBar() {
  const router = useRouter()
  const useStore = useUserStore(state => state.user)!
  const removeUserStore = useUserStore(state => state.removeUser)
  const [modalVisible, { setFalse: setModalFalse, setTrue: setModalTrue }] = useBoolean(false)
  const [addModalVisible, { setFalse: setAddModalFalse, setTrue: setAddModalTrue }] = useBoolean(false)
  const [modalType, setModalType] = useState<string>('setting')
  const [addModalType, setAddModalType] = useState<string>('addFriend')
  const [applyList, setApplyList] = useState<IApplyList[]>([])
  const [transferData, setTransferData] = useState<TransferType[]>([])
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([])
  const [targetKeys, setTargetKeys] = useState<Key[]>([])
  const [addFriendKey, setAddFriendKey] = useState<Key>('applyUser')

  async function handleTabClick(key: string) {
    if (key === 'applyUser' || key === 'appliedUser') {
      const res = await request<({ target: User, user: User } & FriendApply)[]>(`/api/users/${useStore!.id}/applies`, {
        type: key === 'applyUser' ? 'self' : 'target',
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
      setApplyList(lists)
    }
    else if (key === 'launchGroup') {
      const res = await request<User[]>('/api/users/search', {}, {
        data: {
          keyword: '',
        },
        method: 'POST',
      })
      setTransferData(res!.map(item => ({
        key: item.id,
        title: item.nickname || item.username,
      })))
    }
  }

  const hoverItemContent = {
    logout: {
      content: (
        <div
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
        </div>
      ),
      modalContent: <></>,
      title: '退出账号',
    },
    setting: {
      content: (
        <div
          className="flex items-center"
          key="4"
          onClick={() => {
            setModalType('setting')
            setModalTrue()
          }}
        >
          <SettingOutlined className="mr-2" size={32} />
          <div>账号设置</div>
        </div>
      ),
      modalContent: <Setting />,
      title: '账号设置',
    },
  }

  const onTransferChange: TransferProps['onChange'] = (nextTargetKeys) => {
    setTargetKeys(nextTargetKeys)
  }

  const onTransferSelectChange: TransferProps['onSelectChange'] = (
    sourceSelectedKeys,
    targetSelectedKeys,
  ) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys])
  }

  async function handleLaunchGroup(values: { groupName: string }) {
    console.log('targetKeys:', targetKeys, 'values:', values)
    await request('/api/groups/create', {}, {
      data: {
        name: values.groupName,
        userIdList: targetKeys,
      },
      method: 'POST',
    })
    message.success('创建成功')
  }

  const addUserModalContent = {
    addFriend: {
      content: (
        <div className="ml-2 flex flex-col flex-nowrap items-center">
          <Button
            icon={<UserAddOutlined />}
            onClick={() => {
              setAddModalType('addFriend')
              setAddModalTrue()
            }}
            size="large"
          />
          添加好友
        </div>
      ),
      modalContent: (
        <Tabs
          defaultActiveKey="applyUser"
          items={[
            {
              children: (
                <div>
                  <SearchInput
                    setList={setApplyList}
                    type="user"
                    usedBy="apply"
                  />
                  <List
                    dataSource={applyList}
                    itemLayout="horizontal"
                    renderItem={(item) => {
                      const content = addFriendKey === 'applyUser'
                        ? (
                            <List.Item>
                              <List.Item.Meta
                                avatar={<Avatar size={48} src={item.targetAvatar} />}
                                description={applyStatusMapping[item.status]}
                                title={item.targetName}
                              />
                            </List.Item>
                          )
                        : (
                            <List.Item>
                              <List.Item.Meta
                                avatar={<Avatar size={48} src={item.launchAvatar} />}
                                description={applyStatusMapping[item.status]}
                                title={item.launchName}
                              />
                            </List.Item>
                          )
                      return content
                    }}
                  />
                </div>
              ),
              key: 'applyUser',
              label: '申请好友',
            },
            {
              children: (
                <div>
                  <ApplyList
                    applyList={applyList}
                    setApplyList={setApplyList}
                    type="launch"
                  />
                </div>
              ),
              key: 'appliedUser',
              label: '新朋友',
            },
          ]}
          onTabClick={(key) => {
            handleTabClick(key)
            setAddFriendKey(key)
          }}
        />
      ),
      title: '好友',
    },
    addGroup: {
      content: (
        <div className="flex flex-col flex-nowrap items-center">
          <Button
            icon={<MessageOutlined />}
            onClick={() => {
              setAddModalType('addGroup')
              setAddModalTrue()
            }}
            size="large"
          />
          发起群聊
        </div>
      ),
      modalContent: (
        <Tabs
          defaultActiveKey="launchGroup"
          items={[
            {
              children: <>
                <Transfer
                  dataSource={transferData}
                  footer={(_, direction) => {
                    if (direction?.direction === 'right') {
                      return (
                        <Form
                          layout="inline"
                          onFinish={handleLaunchGroup}
                        >
                          <Form.Item
                            label="群聊名称"
                            name="groupName"
                          >
                            <Input />
                          </Form.Item>
                          <Form.Item>
                            <Button htmlType="submit" type="link">
                              创建
                            </Button>
                          </Form.Item>
                        </Form>
                      )
                    }
                    return null
                  }}
                  listStyle={{
                    height: 300,
                    width: 250,
                  }}
                  onChange={onTransferChange}
                  onSelectChange={onTransferSelectChange}
                  oneWay
                  render={item => item.title}
                  selectedKeys={selectedKeys} // 选中的数据
                  showSearch
                  targetKeys={targetKeys}
                />
              </>,
              key: 'launchGroup',
              label: '发起群聊',
            },
            {
              children: (
                <div>
                  <SearchInput
                    setList={setApplyList}
                    type="group"
                    usedBy="apply"
                  />
                </div>
              ),
              key: 'applyGroup',
              label: '加入群聊',
            },
          ]}
          onChange={key => handleTabClick(key)}
        />
      ),
      title: '群聊',
    },
  }

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
        dataSource={[hoverItemContent.logout.content]}
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
    else if (key === 'setting') {
      setModalType('setting')
      setModalTrue()
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
    if (addModalVisible) {
      if (addModalType === 'addFriend') {
        handleTabClick('applyUser')
      }
      else if (addModalType === 'addGroup') {
        handleTabClick('launchGroup')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addModalVisible])

  useEffect(() => {
    return () => {
      setApplyList([])
    }
  }, [])

  return (
    <aside className="side-toolbar">
      <div className="flex h-full flex-col">
        <Popover
          content={settingInfo}
          placement="right"
          trigger="click"
        >
          <Avatar size={42} src={useStore?.avatar || 'https://api.dicebear.com/7.x/miniavs/svg?seed=2'} />
        </Popover>
        <div className="mt-4 flex h-4/5 flex-col items-center">
          <Badge overflowCount={99}>
            <CommentOutlined
              onClick={() => {
                menuClick('chat')
              }}
              style={{ color: '#848484', fontSize: 28 }}
            />
          </Badge>
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
        <div className="order-1">
          <SettingOutlined
            onClick={() => {
              menuClick('setting')
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
        style={{
          top: 20,
        }}
        title={hoverItemContent[modalType as keyof typeof hoverItemContent].title}
        width={600}
      >
        {
          modalType === 'logout' ? <div>正在退出中...</div> : hoverItemContent[modalType as keyof typeof hoverItemContent].modalContent
        }
      </Modal>
      <Modal
        className="userModal-content"
        footer={null}
        onCancel={setAddModalFalse}
        open={addModalVisible}
        title={addUserModalContent[addModalType as keyof typeof addUserModalContent].title}
        width={600}
      >
        {addUserModalContent[addModalType as keyof typeof addUserModalContent].modalContent}
      </Modal>
    </aside>
  )
}

export default ToolBar
