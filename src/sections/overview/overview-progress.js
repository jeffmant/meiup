import PropTypes from 'prop-types'
import RocketLaunchIcon from '@heroicons/react/24/solid/RocketLaunchIcon'
import {
  Avatar,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  SvgIcon,
  Typography
} from '@mui/material'

export const OverviewProgress = (props) => {
  const { value, sx } = props

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
              gutterBottom
              variant='overline'
            >
              Receita Anual
            </Typography>
            <Typography variant='h4'>
              R$63.000,00
            </Typography>
            {value}%
            do teto (R$81.000,00)
          </Stack>
          <Avatar
            sx={{
              backgroundColor: 'warning.main',
              height: 56,
              width: 56
            }}
          >
            <SvgIcon>
              <RocketLaunchIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
        <Box sx={{ mt: 3 }}>
          <LinearProgress
            value={value}
            variant='determinate'
          />
        </Box>
      </CardContent>
    </Card>
  )
}

OverviewProgress.propTypes = {
  value: PropTypes.number.isRequired,
  sx: PropTypes.object
}
