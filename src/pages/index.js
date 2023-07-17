import Head from 'next/head'
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Container,
  Unstable_Grid2 as Grid,
  LinearProgress,
  // Pagination,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  Alert,
  Snackbar,
  Divider
} from '@mui/material'
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout'
import { TransactionCardList } from 'src/components/Transaction/TransactionCardList'
import { Stack } from '@mui/system'
import { TransactionTable } from 'src/components/Transaction/TransactionTable'
import { useEffect, useState } from 'react'
import { getCompanyTransactions } from './api/transaction'
import { useAuth } from 'src/hooks/use-auth'
import TransactionsModal from 'src/components/Transaction/TransactionsModal'
import TransactionMonthSelector from 'src/components/Transaction/TransactionMonthSelector'
import getMonthlyRevenue from 'src/utils/get-monthly-revenue'

const receivesYear = 63000
const receivesPercentageFromYearLimit = +((receivesYear * 100) / 81000).toFixed(2)
const currentMonth = new Date().getMonth()

const Page = () => {
  const { user } = useAuth()
  const [transactionType, setTransactionType] = useState('revenue')
  const [transactions, setTransactions] = useState([])
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [transactionAlert, setTransactionAlert] = useState(null)
  const [transactionMonth, setTransactionMonth] = useState(currentMonth)
  const [monthRevenue, setMonthRevenue] = useState(getMonthlyRevenue({ user }, transactionMonth))
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'))

  console.log(transactions)

  const handleTransactionSelect = (transaction) => {
    setSelectedTransaction(transaction)
  }

  const handleMonthRevenue = async () => {
    await getMonthlyRevenue({ user }, transactionMonth).then((total) => setMonthRevenue(total))
  }

  const handleTransactionMonth = async (month) => {
    setTransactionMonth(month)
  }

  useEffect(() => {
    const fetchTransactions = async () => {
      await getTransactions()
    }

    fetchTransactions()
  }, [transactionMonth])

  useEffect(() => {
    handleMonthRevenue()
  }, [transactions, transactionMonth])

  const cancelTransactionSelect = () => {
    setSelectedTransaction(null)
  }

  async function handleTransactionSaved (status) {
    if (status === 'OK') {
      if (!selectedTransaction) {
        setTransactionAlert({ type: 'success', message: 'Transação criada com sucesso!' })
      } else {
        setTransactionAlert({ type: 'success', message: 'Transação atualizada com sucesso!' })
      }
      await getTransactions()
    } else if (status === 'Fail') {
      if (!selectedTransaction) {
        setTransactionAlert({ type: 'error', message: 'Houve um erro ao criar a transação' })
      } else {
        setTransactionAlert({ type: 'error', message: 'Houve um erro ao atualizar a transação' })
      }
      await getTransactions()
    } else if (status === 'DeleteOK') {
      setTransactionAlert({ type: 'success', message: 'Transação deletada com sucesso!' })
      await getTransactions()
    } else if (status === 'DeleteFail') {
      setTransactionAlert({ type: 'error', message: 'Houve um erro ao deletar a transação' })
      await getTransactions()
    } else {
      await getTransactions()
    }
  }

  async function getTransactions () {
    if (user?.company?.id) {
      const transactions = await getCompanyTransactions({
        companyId: user?.company?.id,
        type: transactionType,
        month: transactionMonth
      })
      setTransactions(transactions)
      return transactions
    }
  }

  const handleTransactionType = async () => {
    const newTransactionType = transactionType === 'cost' ? 'revenue' : 'cost'
    setTransactionType(newTransactionType)
  }

  useEffect(() => {
    getTransactions()
  }, [transactionType])

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
                <Typography color='text.secondary' variant='overline' align='center'>
                  Receita no mês
                </Typography>
              </div>
              <div>
                <Typography variant='h4'>
                  {monthRevenue.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
                </Typography>
              </div>
            </Stack>
            {lgUp && (
              <>
                <Divider
                  orientation='vertical'
                  flexItem
                  sx={{ borderWidth: '1px', borderColor: '#c6c6c6' }}
                />

                <Stack
                  alignItems='center'
                  direction='row'
                  justifyContent='space-between'
                  spacing={4}
                >
                  <div>
                    <Typography
                      color='text.secondary'
                      gutterBottom
                      variant='overline'
                      align='center'
                    >
                      Receita Anual
                    </Typography>
                  </div>
                  <div>
                    <Typography variant='h4' sx={{ mb: 2 }}>
                      {receivesYear.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
                    </Typography>
                    {receivesPercentageFromYearLimit}% do teto
                  </div>
                </Stack>

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
              </>
            )}
          </Card>
          {!lgUp && (
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
                  <Typography color='text.secondary' gutterBottom variant='overline' align='center'>
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
                  {receivesPercentageFromYearLimit}% do teto
                </div>
              </Stack>
            </Card>
          )}
          <Grid container spacing={3}>
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
                  <Tab label='Receitas' value='revenue' disableRipple />
                  <Tab label='Despesas' value='cost' disableRipple />
                </Tabs>

                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      maxHeight: '65px',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    <TransactionMonthSelector handleTransactionMonth={handleTransactionMonth} />
                    <TransactionsModal
                      sx={{ width: { xs: '100%', sm: '50%' }, height: 'auto' }}
                      handleTransactionSaved={handleTransactionSaved}
                      transaction={selectedTransaction}
                      cancelTransactionSelect={cancelTransactionSelect}
                    />
                  </Box>
                  {lgUp
                    ? (
                      <TransactionTable
                        handleTransactionSelect={handleTransactionSelect}
                        transactions={transactions || []}
                      />
                      )
                    : (
                      <TransactionCardList transactions={transactions || []} />
                      )}
                </CardContent>

                <CardActions sx={{ justifyContent: 'center' }}>
                  {/* <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center'
                    }}
                  >
                    <Pagination
                      count={2}
                      size='small'
                    />
                  </Box> */}
                  {transactionAlert && (
                    <Snackbar
                      open={!!transactionAlert}
                      autoHideDuration={3000}
                      onClose={() => setTransactionAlert(null)}
                    >
                      <Alert
                        onClose={() => setTransactionAlert(null)}
                        severity={transactionAlert.type}
                      >
                        {transactionAlert.message}
                      </Alert>
                    </Snackbar>
                  )}
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
