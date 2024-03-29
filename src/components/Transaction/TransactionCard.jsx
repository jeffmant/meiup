import ArrowDownLeftIcon from '@heroicons/react/24/solid/ArrowDownLeftIcon'
import ArrowUpRightIcon from '@heroicons/react/24/solid/ArrowUpRightIcon'
import { Card, CardContent, SvgIcon, Typography } from '@mui/material'
import { Stack } from '@mui/system'

export const TransactionCard = ({
  type,
  value,
  partyName,
  dueDate,
  onClick
}) => {
  return (
    <Card
      onClick={onClick}
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
                  type === 'revenue' ? <ArrowUpRightIcon color='green' /> : <ArrowDownLeftIcon color='red' />
                }
            </SvgIcon>
          </Stack>
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
          <Stack>
            {dueDate}
          </Stack>
          <Stack spacing={1}>
            <Typography variant='p'>
              {value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}
