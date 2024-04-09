import type { RoomType } from '@prisma/client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface ChatStore {
  chatId: string // roomId,表示当前聊天的房间id
  chatType: RoomType
  setChatId: (chatId: string) => void
  setChatType: (chatType: RoomType) => void
  setTargetId: (targetId: string) => void
  targetId: string // 聊天对象的id
}

const storageOptions = {
  name: 'chat',
  storage: createJSONStorage<ChatStore>(() => localStorage),
}

export const useChatStore = create(
  persist<ChatStore>(
    set => ({
      chatId: '',
      chatType: 'FRIEND',
      setChatId: (chatId: string) => set({ chatId }),
      setChatType: (chatType: RoomType) => set({ chatType }),
      setTargetId: (targetId: string) => set({ targetId }),
      targetId: '',
    }),
    storageOptions,
  ),
)
