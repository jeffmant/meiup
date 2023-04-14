import Head from 'next/head';
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { AccountProfile } from 'src/sections/account/account-profile';
import { AccountProfileDetails } from 'src/sections/account/account-profile-details';

const AccountPage = () => (
  <Grid
    container
    spacing={3}
  >
    <Grid
      xs={12}
      md={6}
      lg={4}
    >
      <AccountProfile />
    </Grid>
    <Grid
      xs={12}
      md={6}
      lg={8}
    >
      <AccountProfileDetails />
    </Grid>
  </Grid>
);

AccountPage.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default AccountPage;
