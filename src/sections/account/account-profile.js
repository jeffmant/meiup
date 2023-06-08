import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography
} from '@mui/material'
import { useAuth } from 'src/hooks/use-auth'

export const AccountProfile = () => {
  const { user } = useAuth()

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Avatar
            src={user?.avatar}
            sx={{
              height: 80,
              mb: 2,
              width: 80
            }}
          />
          <Typography
            gutterBottom
            variant='h5'
          >
            {user?.name}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Button
          fullWidth
          variant='text'
        >
          Atualizar Foto
        </Button>
      </CardActions>
    </Card>
  )
}
