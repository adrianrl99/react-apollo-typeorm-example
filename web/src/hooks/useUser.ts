import { atom, useRecoilState } from 'recoil'
import { UserInterface } from 'shared'

import { localStorageEffect } from '~/lib/utils'

export const KEY_USER = 'user'

const userState = atom<UserInterface | null>({
  key: 'userState',
  default: null,
  effects: [localStorageEffect(KEY_USER)],
})

export const useUser = () => {
  const [user, setUser] = useRecoilState(userState)

  return {
    user,
    setUser,
  }
}
