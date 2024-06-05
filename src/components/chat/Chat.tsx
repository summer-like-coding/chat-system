'use client'

import type { MessageVo, UserVo } from '@/types/views'

import { useChatStore } from '@/app/store/chat'
import { useUserStore } from '@/app/store/user'
import { decrypt, decryptAES, encrypt, encryptAES, randomAESKey } from '@/app/utils/encry'
import { request, requestEventStream } from '@/app/utils/request'
import { emitter } from '@/utils/eventBus'
import { MessageType } from '@prisma/client'
import { useReactive } from 'ahooks'
import { Affix, Avatar, Button, Input, message } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import Markdown from 'react-markdown'

import './style.css'
import { getFriendInfo, getSymmetricKey, getUserInfo } from './utils'

interface ChatProps {
  avatar: string
  content: string
  id: string
  isMine: boolean
  privateKey?: string
  publicKey: string
}

interface IChat {
  chatKey: string
  type: 'bot' | 'friend' | 'group'
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
  const roomsPublicKey = useReactive({ value: '' })
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
    if (type === 'friend') {
      const decryptChatList = messageList.map((item) => {
        if (item.content) {
          return {
            ...item,
            content: decryptAES(item.content, roomsPublicKey.value) || '解密失败',
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
  function formatMessage(message: ({ user: UserVo } & MessageVo)[]): ChatProps[] {
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
      friend: async () => {
        const localStorageSecret = JSON.parse(localStorage.getItem('roomKeysMap') || '{}')[chatKey]
        if (!localStorageSecret) {
          message.error('房间未设置公钥，无法加密,无法交流！')
          return null
        }
        const encryContent = encryptAES(inputValue, localStorageSecret)
        const res = await request<MessageVo>(`/api/rooms/${chatId}/chat`, {}, {
          data: {
            content: encryContent,
            type: MessageType.TEXT,
          },
          method: 'POST',
        })
        chatList.push({
          avatar: userStore.avatar || '',
          content: inputValue,
          id: res!.id,
          isMine: true,
        } as ChatProps)
        hasLoadedMessage.current.add(res!.id)
      },
      group: async () => {
        const res = await request<MessageVo>(`/api/rooms/${chatId}/chat`, {}, {
          data: {
            content: inputValue,
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
    const secretChangeList = res!.filter(item => item.type === MessageType.SECRETKEY)
    secretChangeList.forEach((item) => {
      hasSecretKeyExchange(item)
    })
    chatList.push(...formatMessage(res!.filter(
      item => !hasLoadedMessage.current.has(item.id) && item.type === MessageType.TEXT,
    )))
    res!.forEach((item) => {
      hasLoadedMessage.current.add(item.id)
    })
  }

  /**
   * 获取对方公钥/获取群组公钥
   */
  async function getReceiverPublicKey() {
    if (type === 'bot') {
      return ''
    }
    if (type === 'friend') {
      const res = await getFriendInfo(chatKey, userStore.id)
      if (res?.publicKey) {
        return res.publicKey
      }
      return ''
    }
    else if (type === 'group') {
      return ''
    }
    else {
      return ''
    }
  }

  /**
   * 初始化设置聊天房间公钥
   */
  async function initRoomPublicKey() {
    let userPublicKey = ''
    if (type === 'bot') {
      return ''
    }
    const roomPublicKey = getSymmetricKey(chatKey) // 获取房间的公钥
    if (roomPublicKey) {
      roomsPublicKey.value = roomPublicKey
    }
    else {
      userPublicKey = await getReceiverPublicKey() // 获取对方的公钥
      if (!userPublicKey && type === 'friend') {
        message.error('对方未设置公钥，无法加密,无法交流！')
        return null
      }
      const tempRoomPublicKey = randomAESKey()
      localStorage.setItem('roomKeysMap', JSON.stringify({ [chatKey]: tempRoomPublicKey }))
      roomsPublicKey.value = tempRoomPublicKey
      const encryContent = encrypt(userPublicKey, tempRoomPublicKey)
      await request<MessageVo>(`/api/rooms/${chatId}/chat`, {}, {
        data: {
          content: JSON.stringify(encryContent),
          type: MessageType.SECRETKEY,
        },
        method: 'POST',
      })
    }
  }

  /**
   * @description 判断当前对话是否为密钥交换
   */
  function hasSecretKeyExchange(data: MessageVo) {
    if (data.userId === userStore?.id) {
      return
    }
    const { content, type } = data
    const keys = JSON.parse(localStorage.getItem('keys') || '{}')
    if (type === MessageType.SECRETKEY) {
      const tempSecret = decrypt(keys.state.privateKey, JSON.parse(content))
      if (!tempSecret) {
        message.error('解密失败')
        return
      }
      const localStorageSecret = JSON.parse(localStorage.getItem('roomKeysMap') || '{}')[chatKey]
      if (!localStorageSecret) {
        localStorage.setItem('roomKeysMap', JSON.stringify({ [chatKey]: tempSecret }))
        roomsPublicKey.value = tempSecret!
        return
      }
      if (tempSecret! < localStorageSecret) {
        localStorage.setItem('roomKeysMap', JSON.stringify({ [chatKey]: tempSecret }))
        roomsPublicKey.value = tempSecret!
      }
      else {
        roomsPublicKey.value = localStorageSecret
      }
    }
  }

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
      initRoomPublicKey().then(async () => {
        await pullMessage(chatKey)
      })
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
      hasSecretKeyExchange(data)
      if (data.roomId === chatKey && data.type === MessageType.TEXT && type === 'friend') {
        const targetUser = await getUserInfo(data.userId)
        if (!hasLoadedMessage.current.has(data.id)) {
          chatList.push({
            avatar: targetUser?.avatar || '',
            content: decryptAES(data.content, roomsPublicKey.value) || '解密失败',
            id: data.id,
            isMine: data.userId === userStore?.id,
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
