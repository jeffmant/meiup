import PropTypes from 'prop-types'
import CurrencyDollarIcon from '@heroicons/react/24/solid/CurrencyDollarIcon'
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from '@mui/material'

export const OverviewBudget = (props) => {
  const { sx, value } = props

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack
          alignItems='flex-start'
          direction='row'
          justifyContent='space-between'
          spacing={3}
        >
          <Stack spacing={1}>
            <Typography
              color='text.secondary'
              variant='overline'
            >
              sua receita neste mês
            </Typography>
            <Typography variant='h4'>
              {value}
            </Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: 'error.main',
              height: 56,
              width: 56
            }}
          >
            <SvgIcon>
              <CurrencyDollarIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  )
}

OverviewBudget.prototypes = {
  difference: PropTypes.number,
  positive: PropTypes.bool,
  sx: PropTypes.object,
  value: PropTypes.string.isRequired
}
