'use client'

import Authenticated from '@/components/auth/Authenticated'
import Chat from '@/components/chat/Chat'
import { Layout, Menu } from 'antd'
import React, { useState } from 'react'

import './style.css'

export default function Bot() {
  const { Content, Header, Sider } = Layout
  const [menuKey, setMenuKey] = useState<string>('')

  function createBotItems() {
    const botList = [
      {
        key: 'gpt-3.5-turbo',
        name: 'ChatGPT-3.5',
      },
      {
        key: 'gpt-4',
        name: 'GPT-4',
      },
      {
        key: 'claude-3-opus-20240229',
        name: 'Claude 3 Opus',
      },
      {
        key: 'claude-3-sonnet-20240229',
        name: 'Claude 3 Sonnet',
      },
      {
        key: 'gemini-pro',
        name: 'Gemini',
      },
      {
        key: 'gemini-pro-vision',
        name: 'Gemini Pro',
      },
      {
        key: 'google-palm',
        name: 'PaLM',
      },
      {
        key: 'ERNIE-Bot-turbo',
        name: '文心一言',
      },
      {
        key: 'glm-3-turbo',
        name: 'GLM 3',
      },
      {
        key: 'chatglm_turbo',
        name: 'ChatGLM',
      },
      {
        key: 'qwen-turbo',
        name: '通义千问',
      },
      {
        key: 'qwen-plus',
        name: '通义千问 Plus',
      },
    ]
    const items = botList.map(
      ({ key, name }) => ({
        key,
        label: name,
      }),
    )
    return items
  }

  return (
    <>
      <Authenticated />
      <Sider
        style={{
          backgroundColor: 'transparent',
        }}
        width="15%"
      >
        <div className="slider-search">机器人列表</div>
        <Menu
          defaultSelectedKeys={['gpt-3.5-turbo']}
          items={createBotItems()}
          mode="inline"
          onClick={({ key }) => {
            setMenuKey(key)
          }}
          style={{
            backgroundColor: '#f5f5f5',
            color: '#848484',
          }}
        />
      </Sider>
      <Layout>
        <Header
          className="header-container"
          style={{
            backgroundColor: '#f5f5f5',
            height: '48px',
            padding: '0 8px',
            textAlign: 'center',
          }}
        >
          <div className="w-full">
            <div className="float-left ml-2">机器人聊天</div>
          </div>
        </Header>
        <Content
          className="content-container"
        >
          <Chat
            chatKey={menuKey}
            type="bot"
          />
          {/* <BotChat chatKey={menuKey} /> */}
        </Content>

      </Layout>
    </>
  )
}
