import { useCallback, useLayoutEffect, useState } from 'react'

export type UseMediaQuery = (query: string) => boolean
export const useMediaQuery: UseMediaQuery = (query: string) => {
  const [match, setMatch] = useState(false)

  const handleMatch = useCallback(
    () => setMatch(window.matchMedia(query).matches),
    [query],
  )

  useLayoutEffect(() => {
    handleMatch()
  }, [handleMatch, query])

  return match
}
