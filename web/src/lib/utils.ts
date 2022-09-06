// export const urlFormat = (s: string) => s.replace(/[^A-Za-z0-9_.~]+/g, '-')

import { AtomEffect } from 'recoil'

export const dateFormat = (timestamp: string | number) =>
  new Date(+timestamp).toDateString()

export type LocalStorageEffect = <T>(key: string) => AtomEffect<T>

export const localStorageEffect: LocalStorageEffect =
  key =>
  ({ onSet, setSelf }) => {
    const savedValue = localStorage.getItem(key)
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue))
    }

    onSet((newValue, _, isReset) => {
      isReset
        ? localStorage.removeItem(key)
        : localStorage.setItem(key, JSON.stringify(newValue))
    })
  }
