import CheckIcon from '@heroicons/react/24/solid/CheckIcon'
import XMarkIcon from '@heroicons/react/24/solid/XMarkIcon'
import { Avatar, Card, CardContent, SvgIcon, Tooltip, Typography, useMediaQuery } from '@mui/material'
import { Stack } from '@mui/system'

export const Invoice = ({
  number,
  amount,
  customer: { name: customerName },
  status,
  createdAt
}) => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'))
  return (
    <Card sx={{
      width: '100%',
      backgroundColor:
      '#fefefe',
      mb: 2,
      '&:hover': {
        backgroundColor: '#ececec',
        cursor: 'pointer'
      }
    }}
    >
      <CardContent>
        <Stack
          alignItems='flex-start'
          direction='row'
          justifyContent='space-between'
          spacing={3}
        >
          <Stack spacing={1}>
            <Typography color='text.secondary'>
              # {number}
            </Typography>
            <Typography variant={lgUp ? 'h5' : 'h6'}>
              {customerName}
            </Typography>
            <Typography variant={lgUp ? 'h6' : 'p'}>
              R$ {amount}
            </Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: status === 'emited' ? 'success.main' : 'error.main',
              height: 56,
              width: 56
            }}
          >
            <SvgIcon>
              {
                status === 'emited'
                  ? (
                    <Tooltip title='Emitida'>
                      <CheckIcon />
                    </Tooltip>
                    )
                  : status === 'canceled'
                    ? (
                      <Tooltip title='Cancelada'>
                        <XMarkIcon />
                      </Tooltip>
                      )
                    : null
              }
            </SvgIcon>
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  )
}
