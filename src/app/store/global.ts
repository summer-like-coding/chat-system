import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type Theme = 'dark' | 'light'

interface GlobalStore {
  apperanceConfig: {
    chatbg: string
    theme: Theme
  }
  setChatBg: (chatbg: string) => void
  toggleTheme: (theme: Theme) => void
}

export const useGlobalStore = create(persist<GlobalStore>(set => ({
  apperanceConfig: {
    chatbg: '#f0f0f0',
    theme: 'light',
  },
  setChatBg: chatbg => set(state => ({
    apperanceConfig: {
      ...state.apperanceConfig,
      chatbg,
    },
  })),
  toggleTheme: theme => set(state => ({
    apperanceConfig: {
      ...state.apperanceConfig,
      theme,
    },
  })),
}), {
  // merge: (initial, persisted) => deepMerge(initial, persisted),
  name: 'global',
  storage: createJSONStorage(() => localStorage),
}))
