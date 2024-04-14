'use client'
import type { User } from '@prisma/client'

import { useUserStore } from '@/app/store/user'
import { request } from '@/app/utils/request'
import { useToggle } from 'ahooks'
import { Button, Form, Input, message } from 'antd'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import React from 'react'

export default function LoginPassword() {
  const [toggle, setToggle] = useToggle()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl')
  const [loginFormRef] = Form.useForm()
  const [registerFormRef] = Form.useForm()
  const router = useRouter()
  const setUser = useUserStore(state => state.setUser)

  async function login() {
    await loginFormRef.validateFields()
    const password = loginFormRef.getFieldValue('loginPassword') || ''
    const username = loginFormRef.getFieldValue('loginUserName') || ''
    const loginResult = await signIn('credentials', {
      password,
      redirect: false,
      username,
    })
    if (loginResult?.ok === false) {
      message.error('登录失败！用户名或密码错误')
      return
    }
    router.push(callbackUrl || '/')
    message.success('登录成功')
    const res = await request<User>('/api/users/getByUsername', {}, {
      data: {
        username,
      },
      method: 'POST',
    })
    if (res)
      setUser(res)
  }

  async function register() {
    await registerFormRef.validateFields()
    const res = await request<User>('/api/users/register', {}, {
      data: {
        email: registerFormRef.getFieldValue('registerEmail') || '',
        password: registerFormRef.getFieldValue('registerPassword') || '',
        username: registerFormRef.getFieldValue('registerUserName') || '',
      },
      method: 'POST',
    })
    if (res) {
      loginFormRef.setFieldsValue({
        loginUserName: res.username,
      })
      message.success('注册成功')
      setToggle.setRight()
    }
    else {
      message.error('注册失败！请重试')
    }
  }

  return (
    <div
      className="grid min-h-[300px]
         w-full
         max-w-[800px]
         grid-cols-1 gap-4
         rounded-lg  bg-sky-100
         shadow-xl
         md:grid-cols-2
         "
    >
      <div
        className="flex w-full items-center justify-center p-4"
      >
        <Form
          form={loginFormRef}
          style={{
            display: toggle ? 'block' : 'none',
          }}
          title="登录"
        >
          <Form.Item
            label="用户"
            name="loginUserName"
            required
            rules={[{
              message: 'Please input your username!',
              required: true,
            }]}
          >
            <Input placeholder="用户名" />
          </Form.Item>
          <Form.Item
            label="密码"
            name="loginPassword"
            required
            rules={[{
              message: 'Please input your password!',
              required: true,
            }]}
          >
            <Input
              onPressEnter={login}
              placeholder="Password"
              type="password"
            />
          </Form.Item>
          <Form.Item
            className="flex w-full justify-center"
          >
            <Button
              onClick={login}
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
          form={registerFormRef}
          style={{
            display: toggle ? 'none' : 'block',
          }}
          title="注册"
        >
          <Form.Item
            label="用户"
            name="registerUserName"
            required
            rules={[{
              message: 'Please input your username!',
              required: true,
            }]}
          >
            <Input placeholder="User" type="text" />
          </Form.Item>
          <Form.Item
            label="邮箱"
            name="registerEmail"
            required
            rules={[{
              message: 'Please input your email!',
              required: true,
            }, {
              message: 'The input is not valid E-mail!',
              type: 'email',
              validator(rule, value, callback) {
                if (!value || value.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/)) {
                  callback()
                }
                else {
                  callback('The input is not valid E-mail!')
                }
              },
            }]}
          >
            <Input placeholder="Email" type="email" />
          </Form.Item>
          <Form.Item
            label="密码"
            name="registerPassword"
            required
            rules={[{
              message: 'Please input your password!',
              required: true,
            }]}
          >
            <Input
              onPressEnter={register}
              placeholder="Password"
              type="password"
            />
          </Form.Item>
          <Form.Item
            className="flex w-full justify-center"
          >
            <Button
              onClick={register}
              type="primary"
            >
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
