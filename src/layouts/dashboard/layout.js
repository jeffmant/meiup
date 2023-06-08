import { useCallback, useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import { withAuthGuard } from 'src/hocs/with-auth-guard'
import { TopNav } from './top-nav'

const LayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%'
}))

const LayoutContainer = styled('div')({
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
  width: '100%'
})

export const Layout = withAuthGuard((props) => {
  const { children } = props
  const [openNav, setOpenNav] = useState(false)

  const handlePathnameChange = useCallback(
    () => {
      if (openNav) {
        setOpenNav(false)
      }
    },
    [openNav]
  )

  useEffect(
    () => {
      handlePathnameChange()
    },
    [handlePathnameChange]
  )

  return (
    <>
      <TopNav onNavOpen={() => setOpenNav(true)} />
      <LayoutRoot>
        <LayoutContainer>
          {children}
        </LayoutContainer>
      </LayoutRoot>
    </>
  )
})
