import type { User } from '@prisma/client'

import { useUserStore } from '@/app/store/user'
import { request } from '@/app/utils/request'
import { EditOutlined } from '@ant-design/icons'
import { ProCard } from '@ant-design/pro-components'
import { useToggle } from 'ahooks'
import { Button, DatePicker, Form, Input, Select, message } from 'antd'
import dayjs from 'dayjs'
import React, { useState } from 'react'

import UploadImg from '../uploadImg/UploadImg'

export default function Setting() {
  const [tab, setTab] = useState('updateInfo')
  const [accountFormRef] = Form.useForm()
  const [pwdFormRef] = Form.useForm()
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

  function handleUpdatepwd() {
    pwdFormRef.validateFields().then(async (values) => {
      const res = await request<User>(`/api/users/${userStore?.id}/resetPassword`, {}, {
        data: values,
        method: 'POST',
      })
      if (res) {
        message.success('更新成功')
        setUser(res)
      }
    })
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
          rules={[
            {
              message: '请输入正确的邮箱格式',
              type: 'email',
            },
          ]}
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

  // 修改密码
  function updatePwd() {
    return (
      <Form
        form={pwdFormRef}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item
          label="旧密码"
          name="oldPassword"
          required
          rules={[
            {
              message: '请输入旧密码',
              required: true,
            },
          ]}
        >
          <Input className="w-full" />
        </Form.Item>
        <Form.Item
          label="新密码"
          name="newPassword"
          required
          rules={[
            {
              message: '请输入新密码',
              required: true,
            },
          ]}
        >
          <Input className="w-full" />
        </Form.Item>
        <Form.Item
          label="确认密码"
          name="newPassword1"
          required
          // 密码需要和newPassword一致
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('两次密码不一致'))
              },
            }),
          ]}
        >
          <Input className="w-full" />
        </Form.Item>
        <Form.Item wrapperCol={{
          offset: 8,
          span: 16,
        }}
        >
          <Button htmlType="submit" onClick={handleUpdatepwd}>
            保存配置
          </Button>
        </Form.Item>
      </Form>
    )
  }
  return (
    <ProCard
      tabs={{
        activeKey: tab,
        items: [
          {
            children: accountItem(),
            key: 'updateInfo',
            label: '修改用户信息',
          },
          {
            children: updatePwd(),
            key: 'updatePwd',
            label: '更新密码',
          },
        ],
        onChange: (key) => {
          setTab(key)
        },
        tabPosition: 'left',
      }}
    />
  )
}
