import { Box, IconButton, Stack, SvgIcon, useMediaQuery } from '@mui/material'
import PropTypes from 'prop-types'

import { UserButton } from '@clerk/nextjs'
import Bars3Icon from '@heroicons/react/24/solid/Bars3Icon'

const SIDE_NAV_WIDTH = 280
const TOP_NAV_HEIGHT = 16

export const TopNav = (props) => {
  const { onNavOpen } = props
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'))

  return (
    <>
      <Box
        component='header'
        sx={{
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
            {!lgUp && (
              <IconButton onClick={onNavOpen}>
                <SvgIcon fontSize='small'>
                  <Bars3Icon />
                </SvgIcon>
              </IconButton>
            )}
          </Stack>
        </Stack>
      </Box>
      <UserButton afterSignOutUrl='/' />
    </>
  )
}

TopNav.propTypes = {
  onNavOpen: PropTypes.func
}
