import Head from 'next/head'
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Container,
  Divider,
  Unstable_Grid2 as Grid,
  LinearProgress,
  Pagination,
  Tab,
  Tabs,
  Typography,
  useMediaQuery
} from '@mui/material'
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout'
import { TransactionCardList } from 'src/components/Transaction/TransactionCardList'
import { Stack } from '@mui/system'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { TransactionTable } from 'src/components/Transaction/TransactionTable'
import { useEffect, useState } from 'react'
import { getCompanyTransactions } from './api/transaction'

const receivesMonth = 15000
const receivesYear = 63000
const receivesPercentageFromYearLimit = +((receivesYear * 100) / 81000).toFixed(2)

const Page = () => {
  const [transactionType, setTransactionType] = useState('revenue')
  const router = useRouter()
  const isAuthenticated = Cookies.get('authenticated')
  // TODO: Verificar questão do cookie ou inicializar firebase-admin no backend para poder verificar o cookie

  if (!isAuthenticated) {
    router.push('/auth/login')
  }

  const [companyId] = useState('36255676000173')
  const [transactions, setTransactions] = useState([])
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'))

  async function getTransactions () {
    const transactions = await getCompanyTransactions({ companyId, type: transactionType })
    console.log(transactions)
    setTransactions(transactions)
    return transactions
  }

  useEffect(() => {
    getTransactions().then((resp) => console.log(resp)).catch(console.error)
  }, [companyId, transactionType])

  const handleTransactionType = async () => {
    setTransactionType(transactionType === 'revenue' ? 'cost' : 'revenue')
    await getTransactions()
  }

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
          <Card
            sx={{
              display: 'flex',
              direction: 'column',
              justifyContent: 'space-around',
              height: '100%',
              backgroundColor: '#ececec',
              mb: 2,
              p: 2
            }}
          >
            <Stack alignItems='center' direction='row' justifyContent='space-between' spacing={4}>
              <div>
                <Typography color='text.secondary' variant='overline'>
                  Receita no mês
                </Typography>
              </div>
              <div>
                <Typography variant='h4'>
                  {receivesMonth.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
                </Typography>
              </div>
            </Stack>
            <Divider
              orientation='vertical'
              flexItem
              sx={{ borderWidth: '1px', borderColor: '#c6c6c6' }}
            />
            <Stack alignItems='center' direction='row' justifyContent='space-between' spacing={4}>
              <div>
                <Typography color='text.secondary' gutterBottom variant='overline'>
                  Receita Anual
                </Typography>
              </div>
              <div>
                <Typography variant='h4' sx={{ mb: 2 }}>
                  {receivesYear.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
                </Typography>
                <LinearProgress
                  value={receivesPercentageFromYearLimit}
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
                {receivesPercentageFromYearLimit}% do teto (R$81.000,00)
              </div>
            </Stack>
          </Card>
          <Grid
            container
            spacing={3}
          >
            <Grid xs={12}>
              <Card
                sx={{
                  minHeight: '70vh',
                  height: '100%',
                  width: '100%',
                  backgroundColor: '#ececec'
                }}
              >
                <Tabs
                  onChange={handleTransactionType}
                  sx={{ mx: 4 }}
                  value={transactionType}
                  variant='fullWidth'
                >
                  <Tab
                    label='Receitas'
                    value='revenue'
                    disableRipple
                  />
                  <Tab
                    label='Despesas'
                    value='cost'
                    disableRipple
                  />
                </Tabs>

                <CardContent>
                  {
                    lgUp
                      ? <TransactionTable transactions={transactions || []} />
                      : <TransactionCardList transactions={transactions || []} />
                  }
                </CardContent>

                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center'
                    }}
                  >
                    <Pagination
                      count={2}
                      size='small'
                    />
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  )
}

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default Page
