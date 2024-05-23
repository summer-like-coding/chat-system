import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface KeysStore {
  privateKey: string
  publicKey: string
  setPrivateKey: (privateKey: string) => void
  setPublicKey: (publicKey: string) => void
}

export const useKeysStore = create(
  persist<KeysStore>(
    set => ({
      privateKey: '',
      publicKey: '',
      setPrivateKey: (privateKey: string) => set({ privateKey }),
      setPublicKey: (publicKey: string) => set({ publicKey }),
    }),
    {
      name: 'keys',
      storage: createJSONStorage<KeysStore>(() => localStorage),
    },
  ),
)
