'use client'
import type { CredentialsType } from '@/lib/auth'

import { useToggle } from 'ahooks'
import { Button, Form, Input } from 'antd'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import React, { useCallback } from 'react'

export default function LoginPassword() {
  const [toggle, setToggle] = useToggle()
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl')
  const [loginFormRef] = Form.useForm()
  const [registerFormRef] = Form.useForm()

  const login = useCallback(async ({ password, username }: CredentialsType) => {
    const res = await signIn('credentials', {
      password,
      username,
    })
    if (res?.ok)
      router.push(callbackUrl || '/')
  }, [callbackUrl, router])

  const register = useCallback(() => {
    fetch('/api/users/register', {
      body: JSON.stringify({
        email: registerFormRef.getFieldValue('registerEmail') || '',
        password: registerFormRef.getFieldValue('registerPassword') || '',
        username: registerFormRef.getFieldValue('registerUserName') || '',
      }),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      mode: 'cors',
    }).then(() => {
      setToggle.setRight()
    }).catch((e) => {
      console.error('Error:', e)
    })
  }, [registerFormRef, setToggle])

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
            <Input placeholder="Password" type="password" />
          </Form.Item>
          <Form.Item
            className="flex w-full justify-center"
          >
            <Button
              onClick={() => login({
                password: loginFormRef.getFieldValue('loginPassword') || '',
                username: loginFormRef.getFieldValue('loginUserName') || '',
              })}
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
          >
            <Input placeholder="User" type="text" />
          </Form.Item>
          <Form.Item
            label="邮箱"
            name="registerEmail"
          >
            <Input placeholder="Email" type="email" />
          </Form.Item>
          <Form.Item
            label="密码"
            name="registerPassword"
          >
            <Input placeholder="Password" type="password" />
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
