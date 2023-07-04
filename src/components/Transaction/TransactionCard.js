import { Card, CardContent, Typography } from '@mui/material'
import { Stack } from '@mui/system'

export const TransactionCard = ({
  amount,
  partyName
}) => {
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
          spacing={1}
        >
          <Stack
            spacing={1}
            sx={{ maxWidth: 50 }}
          >
            <Stack spacing={1}>
              <Typography variant='h6'>
                {partyName}
              </Typography>
            </Stack>
          </Stack>
          <Stack spacing={1}>
            <Typography variant='p'>
              R$ {amount}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}
