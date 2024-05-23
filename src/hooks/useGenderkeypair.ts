/* eslint-disable no-console */
/**
 * @description 自定义hooks，用于生成密钥对，并更新到数据库
 */

import type { User } from '@prisma/client'

import { useKeysStore } from '@/app/store/keys'
import { useUserStore } from '@/app/store/user'
import { genderKeyPair } from '@/app/utils/encry'
import { request } from '@/app/utils/request'
import { useCallback } from 'react'

export function useGenderKeyPairAndUpdate() {
  const setUser = useUserStore(state => state.setUser)
  const setPrivateKey = useKeysStore(state => state.setPrivateKey)
  const setPublicKey = useKeysStore(state => state.setPublicKey)

  const generateAndSetKeys = useCallback(async (username: string) => {
    const { ownPublicKey, ownSecretKey } = genderKeyPair()
    console.log('用户的', username, '公钥', ownPublicKey, '私钥', ownSecretKey)
    setPrivateKey(ownSecretKey)
    setPublicKey(ownPublicKey)

    const res = await request<User>('/api/users/getByUsername', {}, {
      data: {
        username,
      },
      method: 'POST',
    })

    if (res) {
      await request<User>(`/api/users/${res.id}/update`, {}, {
        data: {
          publicKey: ownPublicKey,
        },
        method: 'POST',
      })

      setUser({
        ...res,
        publicKey: ownPublicKey,
      })
    }
  }, [setUser, setPrivateKey, setPublicKey])

  return generateAndSetKeys
}
