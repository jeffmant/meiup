'use client'
import styled from '@emotion/styled'
import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { SideNav } from 'src/layouts/dashboard/side-nav'
import { TopNav } from 'src/layouts/dashboard/top-nav'
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

export default function Home () {
  const pathname = usePathname()
  const [openNav, setOpenNav] = useState(false)
  const theme = createTheme()

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TopNav onNavOpen={() => setOpenNav(true)} />
      <SideNav
        onClose={() => setOpenNav(false)}
        open={openNav}
      />
      <LayoutRoot>
        <LayoutContainer>
          <h1>Hello World</h1>
        </LayoutContainer>
      </LayoutRoot>
    </ThemeProvider>
  )
}
