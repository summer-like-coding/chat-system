'use client'

import type { MessageVo, UserVo } from '@/types/views'

import { useChatStore } from '@/app/store/chat'
import { useUserStore } from '@/app/store/user'
import { request, requestEventStream } from '@/app/utils/request'
import { emitter } from '@/utils/eventBus'
import { MessageType, type Room, type UserContact, type UserFriend } from '@prisma/client'
import { useReactive } from 'ahooks'
import { Affix, Avatar, Button, Input } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
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
  const chatId = useChatStore(state => state.chatId) // 当前聊天的房间id
  const setChatId = useChatStore(state => state.setChatId)
  const setChatType = useChatStore(state => state.setChatType)
  const targetId = useChatStore(state => state.targetId) // 当前聊天对象的id
  const userStore = useUserStore(state => state.user)!
  const chatList = useReactive<ChatProps[]>([])
  const [inputValue, setInputValue] = useState('')
  const replay = useReactive({ value: '' })
  const hasLoadedMessage = useRef<Set<string>>(new Set())
  const { TextArea } = Input
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

  function formatMessage(message: ({ user: UserVo } & MessageVo)[]) {
    return message.map((item) => {
      return {
        avatar: item.user.avatar || '',
        content: item.content,
        id: item.id,
        isMine: item.userId === userStore.id,
      }
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
        hasLoadedMessage.current.add(chatList[chatList.length - 1].id)
        hasLoadedMessage.current.add(chatList[chatList.length - 2].id)
        requestEventStream('/api/robot/chat', {
          model: chatKey,
          prompt: inputValue,
        }, onMessage, onEnd)
      },
      people: async () => {
        const res = await request<MessageVo>(`/api/rooms/${chatId}/chat`, {}, {
          data: {
            content: inputValue,
            type: MessageType.TEXT,
          },
          method: 'POST',
        })
        // pullMessage()
        chatList.push({
          avatar: userStore.avatar || '',
          content: res!.content,
          id: res!.id,
          isMine: true,
        } as ChatProps)
        hasLoadedMessage.current.add(res!.id)
      },
    }
    clickMap[type]()
    setInputValue('')
  }
  /**
   * 拉取聊天记录
   * @description 只有在初始化的时候和上划的时候才会拉取聊天记录
   * @param roomId
   */
  async function pullMessage(roomId?: string) {
    // 拉取聊天记录
    const res = await request<({ user: UserVo } & MessageVo)[]>(`/api/rooms/${roomId || chatId}/pull`, {}, {
      data: {
        time: new Date().getTime(),
        type: 'previous',
      },
      method: 'POST',
    })
    chatList.push(...formatMessage(res!.filter(
      item => !hasLoadedMessage.current.has(item.id),
    )))
    res!.forEach((item) => {
      hasLoadedMessage.current.add(item.id)
    })
    // console.log('chat', chat)
  }

  /**
   * 查询用户信息
   */
  async function queryUserInfo(id: string) {
    const res = await request<UserVo>(`/api/users/${id}`)
    return res
  }

  useEffect(() => {
    chatList.length = 0
    replay.value = ''
    setInputValue('')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatKey])

  useEffect(() => {
    async function getChat() {
      if (targetId) {
        // 准备聊天
        const res = await request<{
          contact: UserContact
          friend: UserFriend
          room: Room
        }>('/api/contacts/friends/prepare', {}, {
          data: {
            userId: targetId,
          },
          method: 'POST',
        })
        setChatId(res!.room.id)
        setChatType(res!.room.type)
        pullMessage(res!.room.id)
      }
    }
    getChat()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetId])

  useEffect(() => {
    async function callback(data: MessageVo) {
      if (data.roomId === chatId) {
        const targetUser = await queryUserInfo(data.userId)
        if (!hasLoadedMessage.current.has(data.id)) {
          chatList.push({
            avatar: targetUser?.avatar || '',
            content: data.content,
            id: data.id,
            isMine: data.userId === userStore.id,
          })
          hasLoadedMessage.current.add(data.id)
        }
      }
    }

    emitter.on('imMessage', callback)
    return () => {
      emitter.off('imMessage', callback)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <TextArea
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
