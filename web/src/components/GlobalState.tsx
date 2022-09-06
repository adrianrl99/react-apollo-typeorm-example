import { useLazyQuery } from '@apollo/client'
import { ReactNode, useLayoutEffect } from 'react'
import { useMount } from 'react-use'
import { DataInterface } from 'shared'

import {
  KEY_THEME,
  KEY_TOKEN,
  useMediaQuery,
  useTheme,
  useToken,
  useUser,
} from '~/hooks'
import { GET_SELF } from '~/queries/user'

export interface GlobalStateProps {
  children: ReactNode
}

export const GlobalState = ({ children }: GlobalStateProps) => {
  const { setTheme } = useTheme()
  const match = useMediaQuery('(prefers-color-scheme: dark)')

  useLayoutEffect(() => {
    const stored = localStorage.getItem(KEY_THEME)
    if (stored) setTheme(JSON.parse(stored))
    else setTheme(match ? 'dark' : 'light')
  }, [match, setTheme])

  const { setToken, token } = useToken()
  const { setUser } = useUser()
  const [signIn] = useLazyQuery<DataInterface>(GET_SELF)

  useLayoutEffect(() => {
    const stored = localStorage.getItem(KEY_TOKEN)
    if (stored) setToken(JSON.parse(stored))
  }, [setToken])

  useMount(async () => {
    if (token) {
      const { data, error } = await signIn()
      if (data?.getSelf) setUser(data.getSelf)
      else if (error) {
        setToken(null)
        setUser(null)
      }
    }
  })

  return <>{children}</>
}
