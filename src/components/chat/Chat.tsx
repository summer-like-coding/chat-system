'use client'

import type { MessageVo, UserVo } from '@/types/views'

import { useChatStore } from '@/app/store/chat'
import { useKeysStore } from '@/app/store/keys'
import { useUserStore } from '@/app/store/user'
import { decrypt, encrypt } from '@/app/utils/encry'
import { request, requestEventStream } from '@/app/utils/request'
import { emitter } from '@/utils/eventBus'
import { MessageType } from '@prisma/client'
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
  publicKey: string
}

interface IChat {
  chatKey: string
  type: 'bot' | 'normal'
}

export default function Chat({ chatKey, type }: IChat) {
  const chatId = useChatStore(state => state.chatId) // 当前聊天的房间id
  const userStore = useUserStore(state => state.user)!
  const chatList = useReactive<ChatProps[]>([])
  const [inputValue, setInputValue] = useState('')
  const replay = useReactive({ value: '' })
  const hasLoadedMessage = useRef<Set<string>>(new Set())
  const { TextArea } = Input
  const chatBodyRef = useRef<HTMLDivElement>(null)
  const privateKey = useKeysStore(state => state.privateKey)
  const [receiverPublicKey, setReceiverPublicKey] = useState('')

  function scrollToBottom() {
    setTimeout(() => {
      chatBodyRef.current?.scrollTo(0, chatBodyRef.current.scrollHeight)
    }, 200)
  }

  /**
   * 解密消息
   * @description 解密消息：用私钥解密消息
   */
  function decryptMessage(messageList: ChatProps[]) {
    if (type === 'normal') {
      const decryptChatList = messageList.map((item) => {
        if (item.content.indexOf('{') === 0 && item.content.indexOf('}') === item.content.length - 1) {
          return {
            ...item,
            content: JSON.stringify(decrypt(privateKey, JSON.parse(item.content))),
          }
        }
        else {
          return item
        }
      })
      return decryptChatList
    }
    return messageList
  }

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

  /**
   * @description 格式化消息
   * @param message
   * @returns {ChatProps[]}
   */
  function formatMessage(message: ({ user: UserVo } & MessageVo)[]) {
    if (!userStore) {
      return []
    }
    const formatMessageList = message.map((item) => {
      return {
        avatar: item.user.avatar || '',
        content: item.content,
        id: item.id,
        isMine: item.userId === userStore.id,
        publicKey: item.user.publicKey || '',
      }
    })
    return decryptMessage(formatMessageList)
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
          avatar: userStore.avatar || 'https://api.dicebear.com/7.x/miniavs/svg?seed=4',
          content: inputValue,
          id: `${chatList.length + 1}`,
          isMine: true,
          publicKey: '',
        }, {
          avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=2',
          content: replay.value,
          id: `${chatList.length + 2}`,
          isMine: false,
          publicKey: '',
        })
        hasLoadedMessage.current.add(chatList[chatList.length - 1].id)
        hasLoadedMessage.current.add(chatList[chatList.length - 2].id)
        requestEventStream('/api/robot/chat', {
          model: chatKey,
          prompt: inputValue,
        }, onMessage, onEnd)
      },
      normal: async () => {
        // TODOS: 加密
        // 公钥是接收者的公钥
        const encryContent = JSON.stringify(encrypt(receiverPublicKey, inputValue))
        console.log('encryContent', encryContent)

        const res = await request<MessageVo>(`/api/rooms/${chatId}/chat`, {}, {
          data: {
            // content: inputValue,
            content: encryContent,
            type: MessageType.TEXT,
          },
          method: 'POST',
        })
        chatList.push({
          avatar: userStore.avatar || '',
          content: res!.content,
          id: res!.id,
          isMine: true,
        } as ChatProps)
        hasLoadedMessage.current.add(res!.id)
      },
    }
    type && clickMap[type]()
    setInputValue('')
    scrollToBottom()
  }

  /**
   * 拉取聊天记录
   * @description 只有在初始化的时候和上划的时候才会拉取聊天记录
   * @param roomId
   */
  async function pullMessage(roomId?: string) {
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
  }

  /**
   * 查询用户信息
   */
  async function queryUserInfo(id: string) {
    const res = await request<UserVo>(`/api/users/${id}`)
    if (res?.publicKey) {
      setReceiverPublicKey(res.publicKey)
    }
    return res
  }

  /**
   * 初始化设置聊天用户的公钥
   */
  function initReceiverPublicKey() {}

  useEffect(() => {
    chatList.length = 0
    replay.value = ''
    setInputValue('')
    if (!chatKey) {
      return
    }
    if (type === 'bot')
      return
    if (!userStore)
      return
    if (chatKey) {
      pullMessage(chatKey)
    }
    return () => {
      chatList.length = 0
      replay.value = ''
      setInputValue('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatKey, userStore])

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
            publicKey: targetUser?.publicKey || '',
          })
          hasLoadedMessage.current.add(data.id)
          scrollToBottom()
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
      <div className="chatBody" ref={chatBodyRef}>
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
