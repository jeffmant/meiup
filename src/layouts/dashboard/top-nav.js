import PropTypes from 'prop-types'
import {
  Avatar,
  Box,
  Stack,
  Typography,
  useMediaQuery
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { usePopover } from 'src/hooks/use-popover'
import { AccountPopover } from './account-popover'
import { useAuth } from 'src/hooks/use-auth'
import { Logo } from 'src/components/logo'
import NextLink from 'next/link'

const SIDE_NAV_WIDTH = 280
const TOP_NAV_HEIGHT = 64

export const TopNav = (props) => {
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'))
  const accountPopover = usePopover()
  const { user } = useAuth()

  return (
    <>
      <Box
        component='header'
        sx={{
          backdropFilter: 'blur(6px)',
          backgroundColor: (theme) => alpha(theme.palette.background.default, 0.8),
          boxShadow: '0px 4px 27px rgba(43,77,150,0.08)',
          position: 'sticky',
          left: {
            lg: `${SIDE_NAV_WIDTH}px`
          },
          top: 0,
          zIndex: (theme) => theme.zIndex.appBar
        }}
      >
        <Stack
          alignItems='center'
          direction='row'
          justifyContent='space-between'
          spacing={2}
          sx={{
            minHeight: TOP_NAV_HEIGHT,
            px: 2
          }}
        >
          <Stack
            alignItems='center'
            direction='row'
            spacing={2}
          >
            <Box
              component={NextLink}
              href='/'
              sx={{
                display: 'inline-flex',
                height: 32,
                width: 32,
                marginTop: 2,
                marginBottom: 4
              }}
            >
              <Logo />
            </Box>
          </Stack>
          <Stack
            alignItems='center'
            direction='row'
            spacing={2}
          >
            <Typography>{mdUp && user?.name}</Typography>
            <Avatar
              onClick={accountPopover.handleOpen}
              ref={accountPopover.anchorRef}
              sx={{
                cursor: 'pointer',
                height: 40,
                width: 40
              }}
              src={user?.avatar}
            />
          </Stack>
        </Stack>
      </Box>
      <AccountPopover
        anchorEl={accountPopover.anchorRef.current}
        open={accountPopover.open}
        onClose={accountPopover.handleClose}
      />
    </>
  )
}

TopNav.propTypes = {
  onNavOpen: PropTypes.func
}
