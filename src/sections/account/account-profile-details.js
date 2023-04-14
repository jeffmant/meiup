import { useCallback, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { cnpjMask, maskCPF, maskPhone } from 'src/utils/masks';

export const AccountProfileDetails = () => {
  const { user: loggedUser } = useAuth()
  const [user, setUser] = useState(loggedUser);

  const handleChange = useCallback(
    (event) => {
      setUser((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
    },
    []
  );

  return (
    <form
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit}
    >
      <Card>
        <CardHeader
          subheader="mantenha seu perfil atualizado ;)"
          title="perfil"
        />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid
              container
              spacing={3}
            >
              { /* Company Info */}
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="nome fantasia"
                  name="fantasyName"
                  onChange={handleChange}
                  disabled
                  value={user.company.fantasyName}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="cnpj"
                  name="cnpj"
                  onChange={handleChange}
                  disabled
                  value={cnpjMask(user.company.cnpj)}
                />
              </Grid>

              { /* User Info */}
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="seu nome"
                  name="name"
                  onChange={handleChange}
                  required
                  value={user.name}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="cpf"
                  name="cpf"
                  onChange={handleChange}
                  disabled
                  value={maskCPF(user.cpf)}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  type='email'
                  fullWidth
                  label="email"
                  name="email"
                  onChange={handleChange}
                  required
                  value={user.email}
                />
              </Grid>

              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="celular"
                  name="phone"
                  onChange={handleChange}
                  value={maskPhone(user.phone)}
                />
              </Grid>
            </Grid>

          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained">
            salvar
          </Button>
        </CardActions>
      </Card>
    </form >
  );
};
