import { atom, useRecoilState } from 'recoil'

import { localStorageEffect } from '~/lib/utils'

export const KEY_TOKEN = 'user-token'

const tokenState = atom<string | null>({
  key: 'tokenState',
  default: null,
  effects: [localStorageEffect(KEY_TOKEN)],
})

export const useToken = () => {
  const [token, setToken] = useRecoilState(tokenState)

  return {
    token,
    setToken,
  }
}
