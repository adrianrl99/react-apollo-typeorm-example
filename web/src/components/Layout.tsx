import { Navbar, Spacer, Switch, Text } from '@nextui-org/react'
import { Link, Outlet } from 'react-router-dom'

import { useTheme } from '~/hooks'

import BrandIcon from './icons/BrandIcon'
import MoonIcon from './icons/MoonIcon'
import SunIcon from './icons/SunIcon'
import UserMenu from './UserMenu'

export default function Layout() {
  const { isDark, setTheme } = useTheme()

  return (
    <>
      <Navbar css={{ zIndex: '$5' }} isCompact variant="floating">
        <Link to="/">
          <Navbar.Brand>
            <BrandIcon />
            <Spacer x={0.5} />
            <Text b size="$xl">
              Blog
            </Text>
          </Navbar.Brand>
        </Link>
        <Navbar.Content gap="$8">
          <Switch
            checked={isDark}
            onChange={e => setTheme(e.target.checked ? 'dark' : 'light')}
            iconOn={<MoonIcon />}
            iconOff={<SunIcon />}
          />
          <UserMenu />
        </Navbar.Content>
      </Navbar>
      <Outlet />
    </>
  )
}
