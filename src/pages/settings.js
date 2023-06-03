import Head from 'next/head';
import { Box, Container, Stack, Tab, Tabs, Typography } from '@mui/material';
import { SettingsNotifications } from 'src/sections/settings/settings-notifications';
import { SettingsPassword } from 'src/sections/settings/settings-password';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useCallback, useState } from 'react';
import AccountPage from './account';

const Page = () => {
  const [method, setMethod] = useState('profile');

  const handleMethodChange = useCallback(
    (event, value) => {
      setMethod(value);
    },
    []
  );

  return (
    <>
      <Head>
        <title>
          configurações | meumei
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <Tabs
              onChange={handleMethodChange}
              sx={{ mx: 4 }}
              value={method}
            >
              <Tab
                label="perfil"
                value="profile"
                disableRipple
              />
              <Tab
                label="mudar senha"
                value="password"
                disableRipple
              />
              <Tab
                label="notificações"
                value="notification"
                disableRipple
              />
            </Tabs>
            {
              method === 'profile' ? (
                <AccountPage />
              ) : method === 'password' ? (
                <SettingsPassword />
              ) : method === 'notification' ? (
                <SettingsNotifications />
              ) : null
            }
          </Stack>
        </Container>
      </Box >
    </>
  )
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
