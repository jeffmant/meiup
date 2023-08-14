'use client'
import {
  Box,
  Drawer,
  Stack,
  useMediaQuery
} from '@mui/material'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import PropTypes from 'prop-types'
import { Logo } from 'src/components/logo'
import { Scrollbar } from 'src/components/scrollbar'
import { items } from './config'
import { SideNavItem } from './side-nav-item'

export const SideNav = (props) => {
  const { open, onClose } = props
  const pathname = usePathname()
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'))

  const content = (
    <Scrollbar
      sx={{
        height: '100%',
        '& .simplebar-content': {
          height: '100%'
        },
        '& .simplebar-scrollbar:before': {
          background: 'neutral.400'
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box
            component={NextLink}
            href='/'
            sx={{
              display: 'inline-flex',
              height: 32,
              width: 32
            }}
          >
            <Logo dark />
          </Box>
          {/* <Box
            sx={{
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              borderRadius: 1,
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              mt: 2,
              p: '12px'
            }}
          >
            <div>
              <Typography
                color='inherit'
                variant='subtitle1'
              >
                Company Name
              </Typography>
              <Typography
                color='neutral.400'
                variant='body2'
              >
                00.000.000/0001-00
              </Typography>
            </div>
            <SvgIcon
              fontSize='small'
              sx={{ color: 'neutral.500' }}
            >
              <ChevronUpDownIcon />
            </SvgIcon>
          </Box> */}
        </Box>

        <Box
          component='nav'
          sx={{
            flexGrow: 1,
            px: 2,
            py: 3
          }}
        >
          <Stack
            component='ul'
            spacing={0.5}
            sx={{
              listStyle: 'none',
              p: 0,
              m: 0
            }}
          >
            {items.map((item) => {
              const active = item.path ? (pathname === item.path) : false

              return (
                <SideNavItem
                  active={active}
                  disabled={item.disabled}
                  external={item.external}
                  icon={item.icon}
                  key={item.title}
                  path={item.path}
                  title={item.title}
                />
              )
            })}
          </Stack>
        </Box>
      </Box>
    </Scrollbar>
  )

  if (lgUp) {
    return (
      <Drawer
        anchor='left'
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.700',
            color: 'common.white',
            width: 280
          }
        }}
        variant='permanent'
      >
        {content}
      </Drawer>
    )
  }

  return (
    <Drawer
      anchor='left'
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.700',
          color: 'common.white',
          width: 280
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant='temporary'
    >
      {content}
    </Drawer>
  )
}

SideNav.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
}
