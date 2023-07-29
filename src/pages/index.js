import Head from 'next/head'
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Container,
  Unstable_Grid2 as Grid,
  // LinearProgress,
  // Pagination,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  Divider
} from '@mui/material'
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout'
import { TransactionCardList } from 'src/components/Transaction/TransactionCardList'
import { Stack } from '@mui/system'
import { TransactionTable } from 'src/components/Transaction/TransactionTable'
import { useContext, useEffect, useState } from 'react'
import { useAuth } from 'src/hooks/use-auth'
import TransactionsModal from 'src/components/Transaction/TransactionsModal'
import TransactionMonthSelector from 'src/components/Transaction/TransactionMonthSelector'
import {
  getCompanyAnnualRevenue,
  getCompanyAnnualRevenuePercentage,
  getCompanyMonthlyRevenue,
  getCompanyTransactions
} from 'src/firebase/helpers/company.helper'
import NotificationContext from 'src/contexts/notification.context'
import TransactionYearSelector from 'src/components/Transaction/TransactionYearSelector'

// const receivesPercentageFromYearLimit = +((receivesYear * 100) / 81000).toFixed(2)
const currentMonth = new Date().getMonth()
const currentYear = new Date().getFullYear()

const Page = () => {
  const { user } = useAuth()
  const companyId = user?.company?.id
  const [transactionType, setTransactionType] = useState('revenue')
  const [transactions, setTransactions] = useState([])
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [transactionMonth, setTransactionMonth] = useState(currentMonth)
  const [transactionYear, setTransactionYear] = useState(currentYear)
  const [monthRevenue, setMonthRevenue] = useState(
    getCompanyMonthlyRevenue(companyId, transactionMonth, currentYear)
  )
  const [annualRevenue, setAnnualRevenue] = useState(
    getCompanyAnnualRevenue(companyId, currentYear)
  )

  const [revenuePercentageFromYearLimit, setRevenuePercentageFromYearLimit] = useState(0)

  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'))

  const notificationCtx = useContext(NotificationContext)

  const handleTransactionSelect = (transaction) => {
    setSelectedTransaction(transaction)
  }

  const handleMonthRevenue = async () => {
    await getCompanyMonthlyRevenue(companyId, transactionMonth, transactionYear).then((total) =>
      setMonthRevenue(total)
    )
  }

  const handleAnnualRevenue = async () => {
    await getCompanyAnnualRevenue(companyId, transactionYear).then((total) => {
      setAnnualRevenue(total)
    })
  }

  const handleRevenueLimit = async () => {
    await getCompanyAnnualRevenuePercentage(annualRevenue).then((revenuePercentage) => {
      setRevenuePercentageFromYearLimit(revenuePercentage)
    })
  }

  const handleTransactionMonth = async (month) => {
    setTransactionMonth(month)
  }

  const handleTransactionYear = async (year) => {
    setTransactionYear(year)
  }

  useEffect(() => {
    const fetchTransactions = async () => {
      await getTransactions()
    }

    handleRevenueLimit()
    fetchTransactions()
  }, [transactionMonth, transactionYear])

  useEffect(() => {
    handleMonthRevenue()
    handleRevenueLimit()
  }, [transactions, transactionMonth])

  useEffect(() => {
    handleAnnualRevenue()
    handleRevenueLimit()
  }, [transactions, transactionYear])

  const cancelTransactionSelect = () => {
    setSelectedTransaction(null)
  }

  async function handleTransactionSaved (status) {
    await getTransactions()

    if (status === 'OK') {
      if (!selectedTransaction) {
        notificationCtx.success('Transação criada com sucesso!')
      } else {
        notificationCtx.success('Transação atualizada com sucesso!')
      }
    } else if (status === 'Fail') {
      if (!selectedTransaction) {
        notificationCtx.error('Houve um erro ao criar a transação')
      } else {
        notificationCtx.error('Houve um erro ao criar a transação')
      }
    } else if (status === 'DeleteOK') {
      notificationCtx.success('Transação deletada com sucesso!')
    } else if (status === 'DeleteFail') {
      notificationCtx.error('Houve um erro ao deletar a transação')
    }
  }

  async function getTransactions () {
    if (user?.company?.id) {
      const transactions = await getCompanyTransactions({
        companyId: user?.company?.id,
        type: transactionType,
        month: transactionMonth,
        year: transactionYear
      })
      setTransactions(transactions)
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
                      {annualRevenue.toLocaleString('pt-br', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </Typography>
                    {revenuePercentageFromYearLimit}% do teto
                  </div>
                </Stack>

                {/* <LinearProgress
                  value={revenuePercentageFromYearLimit}
                  variant="determinate"
                  color={
                    revenuePercentageFromYearLimit <= 35
                      ? "success"
                      : revenuePercentageFromYearLimit > 35 && revenuePercentageFromYearLimit <= 75
                      ? "info"
                      : revenuePercentageFromYearLimit > 75 && revenuePercentageFromYearLimit <= 100
                      ? "error"
                      : ""
                  }
                /> */}
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
                    {annualRevenue.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
                  </Typography>
                  {/* <LinearProgress
                    value={revenuePercentageFromYearLimit}
                    variant="determinate"
                    color={
                      revenuePercentageFromYearLimit <= 35
                        ? "success"
                        : revenuePercentageFromYearLimit > 35 &&
                          revenuePercentageFromYearLimit <= 75
                        ? "info"
                        : revenuePercentageFromYearLimit > 75 &&
                          revenuePercentageFromYearLimit <= 100
                        ? "error"
                        : ""
                    }
                  /> */}
                  {revenuePercentageFromYearLimit}% do teto
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
                      justifyContent: 'space-between',
                      maxHeight: '65px',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        gap: '10px'
                      }}
                    >
                      <TransactionMonthSelector handleTransactionMonth={handleTransactionMonth} />
                      <TransactionYearSelector handleTransactionYear={handleTransactionYear} />
                    </Box>
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
                      <TransactionCardList
                        transactions={transactions || []}
                        handleTransactionSelect={handleTransactionSelect}
                      />
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
