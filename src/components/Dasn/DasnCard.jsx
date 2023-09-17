'use client'

import CheckBadgeIcon from '@heroicons/react/24/solid/CheckBadgeIcon'
import XCircleIcon from '@heroicons/react/24/solid/XCircleIcon'
import { Card, CardContent, SvgIcon, Typography } from '@mui/material'
import { Stack } from '@mui/system'

export const DasnCard = ({ document }) => {
  return (
    <Card
      sx={{
        width: '100%',
        mt: 2,
        mb: 2,
        '&:hover': {
          cursor: 'pointer'
        }
      }}
    >
      <CardContent>
        <Stack
          alignItems='flex-start'
          direction='row'
          justifyContent='space-between'
          spacing={1}
        >
          <Stack>
            <SvgIcon fontSize='small'>
              {
                  document.status ? <CheckBadgeIcon color='green' /> : <XCircleIcon color='red' />
                }
            </SvgIcon>
          </Stack>
          <Stack
            spacing={1}
            sx={{ maxWidth: 50 }}
          >
            <Stack spacing={1}>
              <Typography variant='h6'>
                {document.status ? 'Realizado' : 'Não Realizado'}
              </Typography>
            </Stack>
          </Stack>
          <Stack>
            {document.year}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}
