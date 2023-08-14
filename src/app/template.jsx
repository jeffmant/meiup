'use client'
import styled from '@emotion/styled'
import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { SideNav } from 'src/components/Nav/side-nav'
import { TopNav } from 'src/components/Nav/top-nav'
import NotificationBar from 'src/components/Notification/Notification'
import { NotificationProvider } from 'src/contexts/notification.context'
import { createTheme } from 'src/theme'

const SIDE_NAV_WIDTH = 280

const LayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  [theme.breakpoints.up('lg')]: {
    paddingLeft: SIDE_NAV_WIDTH
  }
}))

const LayoutContainer = styled('div')({
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
  width: '100%'
})

export default function Template ({ children }) {
  const theme = createTheme()
  const pathname = usePathname()
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
    [pathname]
  )

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <TopNav onNavOpen={() => setOpenNav(true)} />
        <SideNav
          open={openNav}
          onClose={() => setOpenNav(false)}
        />
        <NotificationProvider>
          <NotificationBar />
          <LayoutRoot>
            <LayoutContainer>
              {children}
            </LayoutContainer>
          </LayoutRoot>
        </NotificationProvider>
      </ThemeProvider>
    </LocalizationProvider>
  )
}
