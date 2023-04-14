import Head from 'next/head';
import { Box, Card, CardActions, Container, Divider, Unstable_Grid2 as Grid, Pagination, Tab, Tabs, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { OverviewBudget } from 'src/sections/overview/overview-budget';
import { OverviewLatestOrders } from 'src/sections/overview/overview-latest-orders';
import { OverviewProgress } from 'src/sections/overview/overview-progress';
import { OverviewTotalProfit } from 'src/sections/overview/overview-total-profit';
import { useCallback, useState } from 'react';

const now = new Date();
const months = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro'
]

const Page = () => {
  const [method, setMethod] = useState('sale');

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
          mei
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 2
        }}
      >
        <Container maxWidth="xl">
          <Typography
            variant='h5'
            sx={{ p: 2 }}>
            {months[now.getMonth()]} {now.getFullYear()}
          </Typography>
          <Grid
            container
            spacing={3}
          >

            <Grid
              xs={12}
              lg={8}
            >
              <Card sx={{ height: '100%' }}>
                <Tabs
                  onChange={handleMethodChange}
                  sx={{ mx: 4 }}
                  value={method}
                  variant="fullWidth"
                >
                  <Tab
                    label="Receitas"
                    value="sale"
                    disableRipple
                  />
                  <Tab
                    label="Despesas"
                    value="cost"
                    disableRipple
                  />
                </Tabs>
                <Divider />
                {
                  method === 'sale' ? (
                    <OverviewLatestOrders
                      orders={[
                        {
                          id: 'f69f88012978187a6c12897f',
                          ref: 'DEV1049',
                          amount: 30.5,
                          customer: {
                            name: 'Ekaterina Tankova'
                          },
                          createdAt: 1555016400000,
                          status: 'pending'
                        },
                        {
                          id: '9eaa1c7dd4433f413c308ce2',
                          ref: 'DEV1048',
                          amount: 25.1,
                          customer: {
                            name: 'Cao Yu'
                          },
                          createdAt: 1555016400000,
                          status: 'delivered'
                        },
                        {
                          id: '01a5230c811bd04996ce7c13',
                          ref: 'DEV1047',
                          amount: 10.99,
                          customer: {
                            name: 'Alexa Richardson'
                          },
                          createdAt: 1554930000000,
                          status: 'refunded'
                        },
                        {
                          id: '1f4e1bd0a87cea23cdb83d18',
                          ref: 'DEV1046',
                          amount: 96.43,
                          customer: {
                            name: 'Anje Keizer'
                          },
                          createdAt: 1554757200000,
                          status: 'pending'
                        },
                        {
                          id: '9f974f239d29ede969367103',
                          ref: 'DEV1045',
                          amount: 32.54,
                          customer: {
                            name: 'Clarke Gillebert'
                          },
                          createdAt: 1554670800000,
                          status: 'delivered'
                        },
                        {
                          id: 'ffc83c1560ec2f66a1c05596',
                          ref: 'DEV1044',
                          amount: 16.76,
                          customer: {
                            name: 'Adam Denisov'
                          },
                          createdAt: 1554670800000,
                          status: 'delivered'
                        }
                      ]}
                      sx={{ height: '100%' }}
                    />
                  ) : method === 'cost' ? (
                    <OverviewLatestOrders
                      orders={[
                        {
                          id: 'f69f88012978187a6c12897f',
                          ref: 'DEV1049',
                          amount: 30.5,
                          customer: {
                            name: 'Ekaterina Tankova'
                          },
                          createdAt: 1555016400000,
                          status: 'pending'
                        },
                        {
                          id: '9eaa1c7dd4433f413c308ce2',
                          ref: 'DEV1048',
                          amount: 25.1,
                          customer: {
                            name: 'Cao Yu'
                          },
                          createdAt: 1555016400000,
                          status: 'delivered'
                        },
                        {
                          id: '01a5230c811bd04996ce7c13',
                          ref: 'DEV1047',
                          amount: 10.99,
                          customer: {
                            name: 'Alexa Richardson'
                          },
                          createdAt: 1554930000000,
                          status: 'refunded'
                        },
                        {
                          id: '1f4e1bd0a87cea23cdb83d18',
                          ref: 'DEV1046',
                          amount: 96.43,
                          customer: {
                            name: 'Anje Keizer'
                          },
                          createdAt: 1554757200000,
                          status: 'pending'
                        },
                        {
                          id: '9f974f239d29ede969367103',
                          ref: 'DEV1045',
                          amount: 32.54,
                          customer: {
                            name: 'Clarke Gillebert'
                          },
                          createdAt: 1554670800000,
                          status: 'delivered'
                        },
                        {
                          id: 'ffc83c1560ec2f66a1c05596',
                          ref: 'DEV1044',
                          amount: 16.76,
                          customer: {
                            name: 'Adam Denisov'
                          },
                          createdAt: 1554670800000,
                          status: 'delivered'
                        }
                      ]}
                      sx={{ height: '100%' }}
                    />
                  ) : null
                }
                <Divider />
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center'
                    }}
                  >
                    <Pagination
                      count={3}
                      size="small"
                    />
                  </Box>
                </CardActions>
              </Card>
            </Grid>
            <Grid
              xs={12}
              sm={6}
              lg={4}
            >
              <OverviewProgress
                value={75}
                sx={{ width: '100%' }}
              />
              <OverviewBudget
                difference={12}
                positive
                sx={{ mt: 4, width: '100%' }}
                value="R$5.000,00"
              />
              <OverviewTotalProfit
                value="R$1.5000,00"
                sx={{ mt: 4, width: '100%', }}
              />


            </Grid>

          </Grid>
        </Container>
      </Box>
    </>
  )
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
