'use client'
import { Affix, Avatar, Button, Input } from 'antd'
import React, { useEffect, useState } from 'react'

import './style.css'

interface ChatProps {
  avatar: string
  content: string
  id: string
  isMine: boolean
}

export default function Chat() {
  const [chatList, setChatList] = useState<ChatProps[]>([])

  function getChatList() {
    return chatList.map((item, index) => {
      return (
        <div
          className={item.isMine ? 'chatRow chatMine' : 'chatRow'}
          key={index}
        >
          {
            item.isMine
              ? (
                <>
                  <div className="chatContent">{item.content}</div>
                  <div className="chatAvatar">
                    <Avatar size={32} src={item.avatar} />
                  </div>
                </>
                )
              : (
                <>
                  <div className="chatAvatar">
                    <Avatar size={32} src={item.avatar} />
                  </div>
                  <div className="chatContent">{item.content}</div>
                </>
                )
          }
        </div>
      )
    })
  }

  useEffect(() => {
    setChatList([{
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=1',
      content: '我是知识库机器人，一个专门响应人类指令的大模型',
      id: '1',
      isMine: false,
    }, {
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=2',
      content: '我服务于人类，致力于让生活更美好',
      id: '2',
      isMine: false,
    }, {
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=3',
      content: '我是知识库机器人，一个专门响应人类指令的大模型',
      id: '3',
      isMine: false,
    }, {
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=4',
      content: '自建私有数据知识库 · 与知识库AI聊天',
      id: '4',
      isMine: true,
    }])
  }, [])

  return (
    <div className="chatContainer">
      <div className="chatBody">
        {getChatList()}
      </div>
      <Affix offsetBottom={0}>
        <div className="chatInput">
          <Input
            className="chatInputBox"
            placeholder="请输入内容"
          />
          <Button
            className="chatInputButton"
          >
            提交
          </Button>
        </div>
      </Affix>
    </div>
  )
}
