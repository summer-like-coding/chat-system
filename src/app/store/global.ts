import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type Theme = 'dark' | 'light'

interface GlobalStore {
  appearanceConfig: {
    chatbg: string
    theme: Theme
  }
  setChatBg: (chatbg: string) => void
  toggleTheme: (theme: Theme) => void
}

export const useGlobalStore = create(persist<GlobalStore>(set => ({
  appearanceConfig: {
    chatbg: '#f0f0f0',
    theme: 'light',
  },
  setChatBg: chatbg => set(state => ({
    appearanceConfig: {
      ...state.appearanceConfig,
      chatbg,
    },
  })),
  toggleTheme: theme => set(state => ({
    appearanceConfig: {
      ...state.appearanceConfig,
      theme,
    },
  })),
}), {
  name: 'global',
  storage: createJSONStorage(() => localStorage),
}))
