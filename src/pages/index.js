import Head from 'next/head'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Divider,
  Unstable_Grid2 as Grid,
  LinearProgress,
  Pagination,
  Typography,
  useMediaQuery
} from '@mui/material'
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout'
import { InvoiceList } from 'src/components/Invoice/InvoiceList'
import { Stack } from '@mui/system'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { InvoiceTable } from 'src/components/Invoice/invoiceTable'

const now = new Date()
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

const ordersMock = [
  {
    id: 'f69f88012978187a6c12897f',
    ref: 'DEV1049',
    amount: 30.5,
    customer: {
      name: 'Ekaterina Tankova'
    },
    createdAt: 1555016400000,
    status: 'emited'
  },
  {
    id: '9eaa1c7dd4433f413c308ce2',
    ref: 'DEV1048',
    amount: 25.1,
    customer: {
      name: 'Cao Yu'
    },
    createdAt: 1555016400000,
    status: 'emited'
  },
  {
    id: '01a5230c811bd04996ce7c13',
    ref: 'DEV1047',
    amount: 10.99,
    customer: {
      name: 'Alexa Richardson'
    },
    createdAt: 1554930000000,
    status: 'canceled'
  },
  {
    id: '1f4e1bd0a87cea23cdb83d18',
    ref: 'DEV1046',
    amount: 96.43,
    customer: {
      name: 'Anje Keizer'
    },
    createdAt: 1554757200000,
    status: 'emited'
  },
  {
    id: '9f974f239d29ede969367103',
    ref: 'DEV1045',
    amount: 32.54,
    customer: {
      name: 'Clarke Gillebert'
    },
    createdAt: 1554670800000,
    status: 'emited'
  },
  {
    id: 'ffc83c1560ec2f66a1c05596',
    ref: 'DEV1044',
    amount: 16.76,
    customer: {
      name: 'Adam Denisov'
    },
    createdAt: 1554670800000,
    status: 'emited'
  }
]

const receivesMonth = 15000
const receivesYear = 63000
const receivesPercentageFromYearLimit = ((receivesYear * 100) / 81000).toFixed(2)

const Page = () => {
  const router = useRouter()
  const isAuthenticated = Cookies.get('authenticated')
  // TODO: Verificar questão do cookie ou inicializar firebase-admin no backend para poder verificar o cookie

  if (!isAuthenticated) {
    router.push('/auth/login')
  }

  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'))
  return (
    <>
      <Head>
        <title>meumei</title>
      </Head>
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          py: 2
        }}
      >
        <Container maxWidth='xl'>
          {!lgUp && (
            <Card sx={{ height: '100%', backgroundColor: '#ececec', mb: 2 }}>
              <Stack
                alignItems='flex-start'
                direction='row'
                justifyContent='space-between'
                spacing={3}
              >
                <Stack spacing={1} sx={{ p: 2 }}>
                  <Typography color='text.secondary' variant='overline'>
                    Sua Receita neste mês
                  </Typography>
                  <Typography variant='h4'>
                    {receivesMonth.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
                  </Typography>
                </Stack>
              </Stack>
              <Divider />
              <Stack
                alignItems='flex-start'
                direction='row'
                justifyContent='space-between'
                spacing={3}
              >
                <Stack spacing={1} sx={{ p: 2 }}>
                  <Typography color='text.secondary' gutterBottom variant='overline'>
                    Receita Anual
                  </Typography>
                  <Typography variant='h4'>
                    {receivesYear.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
                  </Typography>
                  75% do teto (R$81.000,00)
                </Stack>
              </Stack>
              <LinearProgress
                value={75}
                variant='determinate'
                color={
                  receivesPercentageFromYearLimit <= 35
                    ? 'success'
                    : receivesPercentageFromYearLimit > 35 && receivesPercentageFromYearLimit <= 75
                      ? 'info'
                      : receivesPercentageFromYearLimit > 75 && receivesPercentageFromYearLimit <= 100
                        ? 'error'
                        : ''
                }
              />
            </Card>
          )}
          <Grid container spacing={3}>
            <Grid xs={12} lg={8}>
              <Card sx={{ height: '100%', backgroundColor: '#ececec' }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <Typography variant='h5' sx={{ p: 2, color: 'black' }}>
                      {months[now.getMonth()]} {now.getFullYear()}
                    </Typography>
                  </div>

                  <Button sx={{ m: 2 }}>Gerar Nova NFS-e</Button>
                </div>

                <CardContent>
                  {lgUp
                    ? (
                      <InvoiceTable invoices={ordersMock} />
                      )
                    : (
                      <InvoiceList invoices={ordersMock} />
                      )}
                </CardContent>

                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center'
                    }}
                  >
                    <Pagination count={ordersMock.length / 2} size='small' />
                  </Box>
                </CardActions>
              </Card>
            </Grid>
            {lgUp && (
              <Grid xs={12} sm={12} lg={4}>
                <Card sx={{ backgroundColor: '#ececec', mb: 2 }}>
                  <Stack
                    alignItems='flex-start'
                    direction='row'
                    justifyContent='space-between'
                    spacing={3}
                  >
                    <Stack spacing={1} sx={{ p: 4 }}>
                      <Typography color='text.secondary' variant='overline'>
                        Sua Receita neste mês
                      </Typography>
                      <Typography variant='h4'>
                        {receivesMonth.toLocaleString('pt-br', {
                          style: 'currency',
                          currency: 'BRL'
                        })}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Divider />
                  <Stack
                    alignItems='flex-start'
                    direction='row'
                    justifyContent='space-between'
                    spacing={3}
                  >
                    <Stack spacing={1} sx={{ p: 4 }}>
                      <Typography color='text.secondary' gutterBottom variant='overline'>
                        Receita Anual
                      </Typography>
                      <Typography variant='h4'>
                        {receivesYear.toLocaleString('pt-br', {
                          style: 'currency',
                          currency: 'BRL'
                        })}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-around'
                        }}
                      >
                        <LinearProgress
                          value={75}
                          variant='determinate'
                          color={
                            receivesPercentageFromYearLimit <= 35
                              ? 'success'
                              : receivesPercentageFromYearLimit > 35 &&
                                receivesPercentageFromYearLimit <= 75
                                ? 'info'
                                : receivesPercentageFromYearLimit > 75 &&
                                receivesPercentageFromYearLimit <= 100
                                  ? 'error'
                                  : ''
                          }
                        />
                        <Typography>
                          {' '}
                          {receivesPercentageFromYearLimit}% do teto (R$ 81.000,00){' '}
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </Card>
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>
    </>
  )
}

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default Page
