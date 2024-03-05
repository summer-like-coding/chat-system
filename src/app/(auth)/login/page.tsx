'use client'
import { useToggle } from 'ahooks'
import { Button, Form, Input } from 'antd'
import React from 'react'

export default function LoginPassword() {
  const [toggle, setToggle] = useToggle()
  return (

    <div
      className="grid min-h-[300px]
         w-full
         max-w-[800px]
         grid-cols-1 gap-4
         rounded-lg bg-white shadow-xl
         md:grid-cols-2
         "
    >
      <div
        className="flex w-full items-center justify-center p-4"
      >
        <Form
          style={{
            display: toggle ? 'block' : 'none',
          }}
          title="登录"
        >
          <Form.Item
            label="邮箱"
          >
            <Input placeholder="Email" type="email" />
          </Form.Item>
          <Form.Item
            label="密码"
          >
            <Input placeholder="Password" type="password" />
          </Form.Item>
          <Form.Item
            className="flex w-full justify-center"
          >
            <Button
              type="primary"
            >
              登录
            </Button>
          </Form.Item>
        </Form>
        <div
          style={{
            display: toggle ? 'none' : 'block',
          }}
        >
          <Button
            onClick={setToggle.toggle}
            type="primary"
          >
            登录
          </Button>
        </div>
      </div>
      <div
        className="flex w-full items-center justify-center p-4"
      >
        <Form
          className="transition-all duration-300 ease-in-out"
          style={{
            display: toggle ? 'none' : 'block',
          }}
          title="注册"
        >
          <Form.Item
            label="用户名"
          >
            <Input placeholder="User" type="text" />
          </Form.Item>
          <Form.Item
            label="邮箱"
          >
            <Input placeholder="Email" type="email" />
          </Form.Item>
          <Form.Item
            label="密码"
          >
            <Input placeholder="Password" type="password" />
          </Form.Item>
          <Form.Item
            className="flex w-full justify-center"
          >
            <Button type="primary">
              注册
            </Button>
          </Form.Item>
        </Form>
        <div
          className="text-center"
          style={{
            display: toggle ? 'block' : 'none',
          }}
        >
          <Button
            onClick={setToggle.toggle}
            type="primary"
          >
            注册
          </Button>
        </div>
      </div>
    </div>

  )
}
