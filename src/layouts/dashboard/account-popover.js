import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import PropTypes from 'prop-types'
import { Box, Divider, MenuItem, MenuList, Popover, Typography } from '@mui/material'
import { useAuth } from 'src/hooks/use-auth'
import { cnpjMask } from 'src/utils/masks'

export const AccountPopover = (props) => {
  const { anchorEl, onClose, open } = props
  const router = useRouter()
  const auth = useAuth()
  const { user } = auth

  const handleSignOut = useCallback(
    () => {
      onClose?.()
      auth.signOut()
      router.push('/auth/login')
    },
    [onClose, auth, router]
  )

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'left',
        vertical: 'bottom'
      }}
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { width: 200 } }}
    >
      <Box
        sx={{
          py: 1.5,
          px: 2
        }}
      >
        <Typography variant='overline'>
          {user?.company?.fantasyName}
        </Typography>
        <Typography
          color='text.secondary'
          variant='body2'
        >
          {cnpjMask(user?.company?.cnpj || '')}
        </Typography>
      </Box>
      <Divider />
      <MenuList
        disablePadding
        dense
        sx={{
          p: '8px',
          '& > *': {
            borderRadius: 1
          }
        }}
      >
        <MenuItem onClick={() => router.push('/settings')}>
          Configurações
        </MenuItem>
        <MenuItem onClick={handleSignOut}>
          Sair
        </MenuItem>
      </MenuList>
    </Popover>
  )
}

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired
}
