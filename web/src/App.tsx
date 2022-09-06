import { NextUIProvider } from '@nextui-org/react'
import { Route, Routes } from 'react-router-dom'

import Layout from './components/Layout'
import { darkTheme, lightTheme, useTheme } from './hooks'
import { HomePage, PostPage } from './pages'

export default function App() {
  const { isDark } = useTheme()

  return (
    <NextUIProvider theme={isDark ? darkTheme : lightTheme}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path=":id" element={<PostPage />} />
        </Route>
      </Routes>
    </NextUIProvider>
  )
}
