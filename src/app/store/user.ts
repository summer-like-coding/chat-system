import type { User } from '@prisma/client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface UserStore {
  removeUser: () => void
  setUser: (user: User) => void
  user: User | undefined
}

const storageOptions = {
  name: 'user',
  storage: createJSONStorage<UserStore>(() => localStorage),
}

export const useUserStore = create(
  persist<UserStore>(
    set => ({
      removeUser: () => set({ user: undefined }),
      setUser: (user: User) => set({ user }),
      user: undefined,
    }),
    storageOptions,
  ),
)
