import PropTypes from 'prop-types';
import NextLink from 'next/link';
import { Box, Typography, Unstable_Grid2 as Grid, useMediaQuery } from '@mui/material';
import { Logo } from 'src/components/logo';
import { Stack } from '@mui/system';

export const Layout = (props) => {
  const { children } = props;
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));

  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        flex: '1 1 auto',
      }}
    >
      <Grid
        container
        sx={{ flex: '1 1 auto' }}
      >
        <Grid
          xs={12}
          lg={6}
          sx={{
            backgroundColor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}
        >
          <Box
            component="header"
            sx={{
              left: 0,
              p: 3,
              position: 'fixed',
              top: 0,
              width: '100%'
            }}
          >
            <Box
              component={NextLink}
              href="/"
              sx={{
                display: 'inline-flex',
                height: 32,
                width: 32
              }}
            >
              <Logo />
            </Box>
          </Box>
          {children}
        </Grid>
        {
          lgUp && (
            <Grid
              xs={12}
              lg={6}
              sx={{
                alignItems: 'center',
                color: 'black',
                display: 'flex',
                justifyContent: 'center',
                '& img': {
                  maxWidth: '75%',

                }
              }}
            >
              <img
                alt=""
                src="/assets/mei-auth.svg"
              />
            </Grid>
          )
        }
      </Grid>
    </Box >
  );
};

Layout.prototypes = {
  children: PropTypes.node
};