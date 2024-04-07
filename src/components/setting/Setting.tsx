import type { User } from '@prisma/client'

import { useGlobalStore } from '@/app/store/global'
import { useUserStore } from '@/app/store/user'
import { request } from '@/app/utils/request'
import { EditOutlined, LoadingOutlined, PlusOutlined, SkinOutlined, UserOutlined } from '@ant-design/icons'
import { useBoolean, useToggle } from 'ahooks'
import { Button, ColorPicker, DatePicker, Form, Image, Input, Layout, Menu, Select, Switch, Upload, message } from 'antd'
import React, { useState } from 'react'

export default function Setting() {
  const [accountFormRef] = Form.useForm()
  const [appearanceFormRef] = Form.useForm()
  const { Content, Sider } = Layout
  const [selectedKey, setSelectedKey] = useState<string>('account')
  const setUser = useUserStore(state => state.setUser)
  const userStore = useUserStore(state => state.user)
  const setChatBg = useGlobalStore(state => state.setChatBg)
  const toggleTheme = useGlobalStore(state => state.toggleTheme)
  const appearanceConfig = useGlobalStore(state => state.appearanceConfig)
  const [loading, { setFalse: setLoadingFalse, setTrue: setLoadingTrue }] = useBoolean(false)
  const [emailDisabled, { toggle: toggleEmailDisabled }] = useToggle(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewOpen, setPreviewOpen] = useState(false)

  async function saveUserInfo() {
    const res = await request<User>(`/api/users/${userStore?.id}/update`, {}, {
      data: accountFormRef.getFieldsValue(),
      method: 'POST',
    })
    if (res) {
      message.success('更新成功')
      setUser(res)
    }
  }

  function saveAppearanceInfo() {
    setChatBg(appearanceFormRef.getFieldValue('chatbg'))
    toggleTheme(appearanceFormRef.getFieldValue('theme'))
    message.success('更新成功')
  }

  const uploadButton = (
    <button style={{ background: 'none', border: 0 }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  )

  function beforeUpload(file: File) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!')
      return false
    }
    return isJpgOrPng
  }

  function handleChange(info: any) {
    if (info.file.status === 'uploading') {
      setLoadingTrue()
      return
    }
    if (info.file.status === 'done') {
      setLoadingFalse()
    }
  }

  function appearanceItem() {
    return (
      <Form
        form={appearanceFormRef}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item
          label="主题设置"
          name="theme"
        >
          <Switch
            checkedChildren="light"
            defaultChecked={appearanceConfig.theme === 'light'}
            onChange={checked => appearanceFormRef.setFieldValue('theme', checked ? 'light' : 'dark')}
            unCheckedChildren="dark"
          />
        </Form.Item>
        <Form.Item
          label="聊天背景色"
          name="chatbg"
        >
          <ColorPicker
            defaultValue={appearanceConfig.chatbg}
            onChange={color => appearanceFormRef.setFieldValue('chatbg', color.toHexString())}
          />
        </Form.Item>
        <Form.Item wrapperCol={{
          offset: 8,
          span: 16,
        }}
        >
          <Button htmlType="submit" onClick={saveAppearanceInfo}>
            保存配置
          </Button>
        </Form.Item>
      </Form>
    )
  }

  function accountItem() {
    return (
      <Form
        form={accountFormRef}
        initialValues={{
          ...userStore,
          birthday: undefined,
        }}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item label="头像" name="avatar">
          <Upload
            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
            beforeUpload={beforeUpload}
            listType="picture-card"
            maxCount={1}
            name="avatar"
            onChange={handleChange}
            showUploadList={false}
          >
            {userStore?.avatar
              ? (
                <Image
                  alt="avatar"
                  preview={{
                    afterOpenChange: visible => !visible && setPreviewImage(''),
                    onVisibleChange: visible => setPreviewOpen(visible),
                    visible: previewOpen,
                  }}
                  src={previewImage}
                  wrapperStyle={{ display: 'none' }}
                />
                )
              : uploadButton}
          </Upload>
        </Form.Item>
        <Form.Item label="用户名" name="nickname">
          <Input className="w-full" />
        </Form.Item>
        <Form.Item
          label="更改邮箱"
          name="email"
        >
          <Input
            className="w-full"
            disabled={!emailDisabled}
            suffix={(
              <EditOutlined
                onClick={toggleEmailDisabled}
              />
            )}
            type="email"
          />
        </Form.Item>
        <Form.Item label="出生日期" name="birthday">
          <DatePicker className="w-full" />
        </Form.Item>
        <Form.Item label="性别" name="gender">
          <Select
            className="w-full"
            options={[{
              label: '男',
              value: '男',
            }, {
              label: '女',
              value: '女',
            }]}
          />
        </Form.Item>
        <Form.Item wrapperCol={{
          offset: 8,
          span: 16,
        }}
        >
          <Button htmlType="submit" onClick={saveUserInfo}>
            保存配置
          </Button>
        </Form.Item>
      </Form>
    )
  }

  const menuItemList = {
    account: {
      content: accountItem(),
      icon: UserOutlined,
      key: 'account',
      title: '账号',
    },
    appearance: {
      content: appearanceItem(),
      icon: SkinOutlined,
      key: 'appearance',
      title: '外观',
    },
  }

  const menuItem = Object.values(menuItemList).map(
    ({ icon, key, title }) => ({
      icon: React.createElement(icon),
      key,
      label: title,
    }),
  )
  return (
    <Layout className="h-auto w-full">
      <Sider className="bg-slate-200 text-center text-white" width="25%">
        <Menu
          defaultOpenKeys={['account']}
          items={menuItem}
          onSelect={({ key }) => {
            setSelectedKey(key)
          }}
          style={{
            height: '100%',
          }}
          theme="light"
        />
      </Sider>
      <Layout>
        <Content
          style={{
            backgroundColor: '#fff',
          }}
        >
          {menuItemList[selectedKey as keyof typeof menuItemList].content}
        </Content>
      </Layout>
    </Layout>
  )
}
