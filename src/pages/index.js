import Head from 'next/head'
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Container,
  FormControl,
  Unstable_Grid2 as Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useMediaQuery
  // Pagination
} from '@mui/material'
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout'
import { TransactionCardList } from 'src/components/Transaction/TransactionCardList'
import { Stack } from '@mui/system'
import { TransactionTable } from 'src/components/Transaction/TransactionTable'
import { useContext, useEffect, useState } from 'react'
import { useAuth } from 'src/hooks/use-auth'
import TransactionsModal from 'src/components/Transaction/TransactionsModal'
import TransactionMonthSelector from 'src/components/Transaction/TransactionMonthSelector'
import TransactionYearSelector from 'src/components/Transaction/TransactionYearSelector'
import {
  getCompanyAnnualRevenuePercentage,
  getCompanyAnnualStats,
  getCompanyMonthlyStats,
  getCompanyTransactions
} from 'src/firebase/helpers/company.helper'
import NotificationContext from 'src/contexts/notification.context'

const currentMonth = new Date().getMonth()
const currentYear = new Date().getFullYear()

const Page = () => {
  const { user } = useAuth()
  const companyId = user?.company?.id
  const [transactionType, setTransactionType] = useState('all')
  const [transactions, setTransactions] = useState([])
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [transactionMonth, setTransactionMonth] = useState(currentMonth)
  const [transactionYear, setTransactionYear] = useState(currentYear)
  const [monthRevenue, setMonthRevenue] = useState(0)
  const [monthCost, setMonthCost] = useState(0)
  const [annualRevenue, setAnnualRevenue] = useState(0)
  const [annualCost, setAnnualCost] = useState(0)
  const [revenuePercentageFromYearLimit, setRevenuePercentageFromYearLimit] = useState(0)
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'))

  const notificationCtx = useContext(NotificationContext)

  console.log('annualRevenue: ', annualRevenue)
  console.log('annualCost: ', annualCost)
  console.log('revenuePercentageFromYearLimit: ', revenuePercentageFromYearLimit)

  const handleTransactionSelect = (transaction) => {
    setSelectedTransaction(transaction)
  }

  const handleRevenueLimit = async () => {
    const limitYearPercentage = getCompanyAnnualRevenuePercentage(annualRevenue)
    setRevenuePercentageFromYearLimit(limitYearPercentage)
  }

  const handleMonthlyStats = async () => {
    const { monthlyRevenue, monthlyCost } = await getCompanyMonthlyStats(companyId, transactionMonth, transactionYear)
    setMonthRevenue(monthlyRevenue)
    setMonthCost(monthlyCost)
  }

  const handleAnnualStats = async () => {
    const { annualRevenue, annualCost } = await getCompanyAnnualStats(companyId, transactionYear)
    setAnnualRevenue(annualRevenue)
    setAnnualCost(annualCost)
    handleRevenueLimit()
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

    fetchTransactions()
  }, [transactionMonth, transactionYear])

  useEffect(() => {
    handleMonthlyStats()
  }, [transactions, transactionMonth])

  useEffect(() => {
    handleAnnualStats()
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

  const handleTransactionType = async (e) => {
    setTransactionType(e.target.value)
  }

  useEffect(() => {
    getTransactions()
  }, [transactionType])

  return (
    <>
      <Head>
        <title>meiup</title>
      </Head>
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          py: 2
        }}
      >
        <Container maxWidth='xl'>
          <Stack
            alignItems='center'
            direction={mdUp ? 'row' : 'column'}
            justifyContent={mdUp ? 'space-between' : 'center'}
            spacing={4}
            sx={{ mb: 2 }}
          >
            <Card
              sx={{
                display: 'flex',
                direction: 'column',
                justifyContent: 'space-around',
                height: '100%',
                width: 512,
                p: 2
              }}
            >
              <Stack
                alignItems='center'
                direction='row'
                justifyContent='space-between'
                spacing={4}
              >
                <div>
                  <Typography
                    color='text.secondary'
                    variant='overline'
                    align='center'
                  >
                    Receitas
                  </Typography>
                </div>
                <div>
                  <Typography variant='h4'>
                    {monthRevenue.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
                  </Typography>
                </div>
              </Stack>
            </Card>
            <Card
              sx={{
                display: 'flex',
                direction: 'column',
                justifyContent: 'space-around',
                height: '100%',
                width: 512,
                p: 2
              }}
            >
              <Stack alignItems='center' direction='row' justifyContent='space-between' spacing={4}>
                <div>
                  <Typography
                    color='text.secondary'
                    gutterBottom
                    variant='overline'
                    align='center'
                  >
                    Despesas
                  </Typography>
                </div>
                <div>
                  <Typography variant='h4'>
                    {monthCost.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
                  </Typography>
                </div>
              </Stack>
            </Card>
          </Stack>
          <Grid
            container
            spacing={3}
          >
            <Grid xs={12}>
              <Card
                sx={{
                  minHeight: '70vh',
                  height: '100%',
                  width: '100%'
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: mdUp ? 'row' : 'column',
                      justifyContent: 'space-between',
                      maxHeight: '65px',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    <Stack>
                      <Stack sx={{ flexDirection: 'row' }}>
                        <Stack sx={{ mr: 2 }}>
                          <TransactionMonthSelector handleTransactionMonth={handleTransactionMonth} />
                        </Stack>
                        <Stack sx={{ mr: 2 }}>
                          <TransactionYearSelector handleTransactionYear={handleTransactionYear} />
                        </Stack>

                        <FormControl fullWidth sx={{ width: '128px' }}>
                          <InputLabel id='select-type-label'>Tipo</InputLabel>
                          <Select
                            labelId='select-type-label'
                            id='select-type'
                            value={transactionType}
                            label='Tipo'
                            onChange={handleTransactionType}
                          >
                            <MenuItem value='all'>Todos</MenuItem>
                            <MenuItem value='revenue'>Receita</MenuItem>
                            <MenuItem value='cost'>Despesa</MenuItem>
                          </Select>
                        </FormControl>
                      </Stack>
                    </Stack>
                    <Stack
                      sx={{
                        flexDirection: 'row'
                      }}
                    >
                      <TransactionsModal
                        sx={{ width: { xs: '100%', sm: '50%' }, height: 'auto' }}
                        handleTransactionSaved={handleTransactionSaved}
                        transaction={selectedTransaction}
                        cancelTransactionSelect={cancelTransactionSelect}
                      />
                    </Stack>

                  </Box>

                  <Typography sx={{ mt: 8 }} variant='h5'>Transações</Typography>

                  {mdUp
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
                      count={transactions.length}
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
