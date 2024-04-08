'use client'
import { requestEventStream } from '@/app/utils/request'
import { useReactive } from 'ahooks'
import { Affix, Avatar, Button, Input } from 'antd'
import React, { useEffect, useState } from 'react'
import Markdown from 'react-markdown'

import './style.css'

interface ChatProps {
  avatar: string
  content: string
  id: string
  isMine: boolean
}

interface IChat {
  chatKey: string
  type: 'bot' | 'people'
}

export default function Chat({ chatKey, type }: IChat) {
  const chatList = useReactive<ChatProps[]>([])
  const [inputValue, setInputValue] = useState('')
  const replay = useReactive({ value: '' })

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
                  <div className="chatContent"><Markdown>{item.content}</Markdown></div>
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
                  <div className="chatContent"><Markdown>{item.content}</Markdown></div>
                </>
                )
          }
        </div>
      )
    })
  }

  function onMessage(data: string) {
    replay.value = replay.value + data
    chatList[chatList.length - 1].content = replay.value
  }

  function onEnd() {
    setTimeout(() => {
      replay.value = ''
    }, 5000)
  }

  function handleClick() {
    const clickMap = {
      bot: () => {
        chatList.push({
          avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=4',
          content: inputValue,
          id: `${chatList.length + 1}`,
          isMine: true,
        }, {
          avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=2',
          content: replay.value,
          id: `${chatList.length + 2}`,
          isMine: false,
        })
        requestEventStream('/api/robot/chat', {
          model: chatKey,
          prompt: inputValue,
        }, onMessage, onEnd)
      },
      people: () => {
      },
    }
    clickMap[type]()
    setInputValue('')
  }

  useEffect(() => {
    chatList.length = 0
    replay.value = ''
    setInputValue('')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatKey])

  useEffect(() => {
    // 获取url参数
    const url = new URL(window.location.href)
    const userId = url.searchParams.get('userId')
    if (userId) {
      // eslint-disable-next-line no-console
      console.log('userId', userId)
    }
  }, [])

  return (
    <div className="chatContainer">
      <div className="chatBody">
        {getChatList()}
      </div>
      <Affix offsetBottom={0}>
        <div className="chatInput">
          <Button
            className="chatInputButton"
            onClick={() => {
              chatList.length = 0
              replay.value = ''
              setInputValue('')
            }}
          >
            清除
          </Button>
          <Input
            allowClear
            className="chatInputBox"
            onChange={e => setInputValue(e.target.value)}
            onPressEnter={handleClick}
            placeholder="请输入内容"
            value={inputValue}
          />
          <Button
            className="chatInputButton"
            onClick={handleClick}
          >
            提交
          </Button>
        </div>
      </Affix>
    </div>
  )
}
