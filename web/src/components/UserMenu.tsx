import { useMutation } from '@apollo/client'
import { Avatar, Button, Dropdown, Navbar, Text } from '@nextui-org/react'
import { Key, useCallback, useMemo, useState } from 'react'
import { DataInterface, SignUserInterface } from 'shared'

import { useToken, useUser } from '~/hooks'
import { LOG_OUT } from '~/queries/user'

import PersonIcon from './icons/PersonIcon'
import SignInModal from './SignInModal'
import SignUpModal from './SignUpModal'

export default function UserMenu() {
  const [signIn, setSignIn] = useState(false)
  const [signUp, setSignUp] = useState(false)

  const { setToken } = useToken()
  const { setUser, user } = useUser()

  const [logout] = useMutation<DataInterface>(LOG_OUT)

  const handleSign = useCallback(
    (data?: SignUserInterface | null) => {
      setSignIn(false)
      setSignUp(false)
      if (data) {
        setToken(data.token)
        setUser(data.user)
      }
    },
    [setToken, setUser],
  )

  const handleLogout = useCallback(async () => {
    const { data } = await logout()

    if (data?.logout) {
      setToken(null)
      setUser(null)
    }
  }, [logout, setToken, setUser])

  const handleMenu = useCallback(
    (key: Key) => {
      if (key === 'logout') handleLogout()
    },
    [handleLogout],
  )

  const renderSignButtons = useMemo(
    () => (
      <>
        <Navbar.Item>
          <Button auto light onClick={() => setSignIn(true)}>
            Sign In
          </Button>
        </Navbar.Item>
        <Navbar.Item>
          <Button auto onClick={() => setSignUp(true)}>
            Sign Up
          </Button>
        </Navbar.Item>
      </>
    ),
    [],
  )

  const renderUserMenu = useMemo(
    () => (
      <Dropdown>
        <Dropdown.Trigger>
          <Avatar
            as="button"
            icon={
              <Text span size="$xl">
                <PersonIcon />
              </Text>
            }
          />
        </Dropdown.Trigger>
        <Dropdown.Menu onAction={handleMenu}>
          <Dropdown.Item key="profile" css={{ height: '$18' }}>
            <Text b color="inherit" css={{ d: 'flex' }}>
              Signed in as
            </Text>
            <Text b color="inherit" css={{ d: 'flex' }}>
              {user?.email}
            </Text>
          </Dropdown.Item>
          <Dropdown.Item withDivider key="logout" color="error">
            Log Out
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    ),
    [handleMenu, user?.email],
  )

  const renderSignButtonsOrUserMenu = useMemo(
    () => (user ? renderUserMenu : renderSignButtons),
    [renderSignButtons, renderUserMenu, user],
  )

  return (
    <>
      {renderSignButtonsOrUserMenu}
      <SignInModal
        open={signIn}
        onData={handleSign}
        onClose={() => setSignIn(false)}
      />
      <SignUpModal
        open={signUp}
        onData={handleSign}
        onClose={() => setSignUp(false)}
      />
    </>
  )
}
