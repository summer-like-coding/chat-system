import type { User } from '@prisma/client'

import { useUserStore } from '@/app/store/user'
import { request } from '@/app/utils/request'
import { EditOutlined } from '@ant-design/icons'
import { useToggle } from 'ahooks'
import { Button, DatePicker, Form, Input, Layout, Select, message } from 'antd'
import dayjs from 'dayjs'
import React from 'react'

import UploadImg from '../uploadImg/UploadImg'

export default function Setting() {
  const [accountFormRef] = Form.useForm()
  const { Content } = Layout
  const setUser = useUserStore(state => state.setUser)
  const userStore = useUserStore(state => state.user)
  const [emailDisabled, { toggle: toggleEmailDisabled }] = useToggle(false)

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
  function accountItem() {
    return (
      <Form
        form={accountFormRef}
        initialValues={{
          ...userStore,
          birthday: userStore?.birthday ? dayjs(userStore.birthday) : undefined,
        }}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item label="头像" name="avatar">
          <UploadImg
            accountFormRef={accountFormRef}
          />
        </Form.Item>
        <Form.Item label="用户名" name="username">
          <Input className="w-full" disabled />
        </Form.Item>
        <Form.Item label="昵称" name="nickname">
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
        <Form.Item label="个性签名" name="description">
          <Input.TextArea className="w-full" />
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
  return (
    <Layout className="h-4/5">
      <Content
        style={{
          backgroundColor: '#fff',
        }}
      >
        {accountItem()}
      </Content>
    </Layout>
  )
}
