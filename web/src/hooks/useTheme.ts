import { changeTheme, createTheme, ThemeType } from '@nextui-org/react'
import { useCallback } from 'react'
import { atom, useRecoilState } from 'recoil'

import { localStorageEffect } from '~/lib/utils'

export const KEY_THEME = 'dark-theme'

const themeState = atom<ThemeType | string>({
  key: 'themeState',
  default: 'light',
  effects: [localStorageEffect(KEY_THEME)],
})

export const lightTheme = createTheme({
  type: 'light',
  theme: {
    colors: {},
  },
})

export const darkTheme = createTheme({
  type: 'dark',
  theme: {
    colors: {},
  },
})

export const useTheme = () => {
  const [theme, setTheme] = useRecoilState(themeState)

  const handleTheme = useCallback(
    (newTheme: ThemeType | string) => {
      changeTheme(newTheme)
      setTheme(newTheme)
    },
    [setTheme],
  )

  return {
    setTheme: handleTheme,
    theme,
    isDark: theme === 'dark',
  }
}
