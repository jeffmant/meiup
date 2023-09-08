'use client'
import { useAuth } from '@clerk/nextjs'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Unstable_Grid2 as Grid,
  Pagination,
  Typography,
  useMediaQuery
} from '@mui/material'
import { Stack } from '@mui/system'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { TransactionCardList } from 'src/components/Transaction/TransactionCardList'
import TransactionMonthSelector from 'src/components/Transaction/TransactionMonthSelector'
import { TransactionTable } from 'src/components/Transaction/TransactionTable'
import TransactionTypeSelector from 'src/components/Transaction/TransactionTypeSelector'
import TransactionYearSelector from 'src/components/Transaction/TransactionYearSelector'
import TransactionsModal from 'src/components/Transaction/TransactionsModal'
import { getAllTransactions } from 'src/utils/transactions-utils'

const currentMonth = new Date().getMonth()
const currentYear = new Date().getFullYear()

const Dashboard = () => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'))
  const [openTransactionModal, setOpenTransactionModal] = useState(false)
  const [transactionType, setTransactionType] = useState('all')
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [transactionMonth, setTransactionMonth] = useState(currentMonth)
  const [transactionYear, setTransactionYear] = useState(currentYear)
  const [transactions, setTransactions] = useState([])
  const [monthlyRevenue, setMonthlyRevenue] = useState(0)
  const [monthlyCost, setMonthlyCost] = useState(0)
  const [totalPages, setTotalPages] = useState([])
  const [page, setPage] = useState(1)
  const limit = 10

  const { getToken } = useAuth()

  const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'))

  const refreshTransactions = async () => {
    const accessToken = await getToken()
    const { totalPages, transactions: fetchedTransactions, totalRevenues, totalCosts } =
      await getAllTransactions(accessToken, transactionType, transactionMonth, transactionYear, page, limit)
    setTransactions(fetchedTransactions)
    setTotalPages(totalPages)
    setMonthlyRevenue(totalRevenues)
    setMonthlyCost(totalCosts)
  }

  const handleTransactionSelect = (transaction) => {
    setSelectedTransaction(transaction)
    setOpenTransactionModal(true)
  }

  const handleTransactionMonth = async (month) => {
    setTransactionMonth(month)
  }

  const handleTransactionYear = async (year) => {
    setTransactionYear(year)
  }

  const handleTransactionType = async (type) => {
    setTransactionType(type)
  }

  useEffect(() => {
    refreshTransactions()
  }, [transactionYear, transactionMonth, transactionType, page])

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
                    {monthlyRevenue.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
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
                    Despesas
                  </Typography>
                </div>
                <div>
                  <Typography variant='h4'>
                    {monthlyCost.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
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
                          <TransactionMonthSelector
                            handleTransactionMonth={handleTransactionMonth}
                          />
                        </Stack>

                        <Stack sx={{ mr: 2 }}>
                          <TransactionYearSelector handleTransactionYear={handleTransactionYear} />
                        </Stack>

                        <Stack sx={{ mr: 2 }}>
                          <TransactionTypeSelector handleTransactionType={handleTransactionType} />
                        </Stack>

                      </Stack>
                    </Stack>
                    <Stack
                      sx={{
                        flexDirection: 'row'
                      }}
                    >
                      <div
                        style={{ display: 'flex', justifyContent: lgUp ? 'flex-end' : 'center' }}
                      >
                        {!selectedTransaction && (
                          <Button
                            variant='contained'
                            onClick={() => setOpenTransactionModal(true)}
                            sx={{ mb: 2 }}
                          >
                            Nova Transação
                          </Button>
                        )}
                      </div>
                    </Stack>
                  </Box>

                  <Typography
                    sx={{ mt: 8 }}
                    variant='h5'
                  >
                    Transações
                  </Typography>

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
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center'
                    }}
                  >
                    {totalPages > 1 && (
                      <Pagination
                        onChange={(_e, value) => {
                          setPage(value)
                        }}
                        count={totalPages}
                        size='small'
                      />
                    )}
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <TransactionsModal
        sx={{ width: { xs: '100%', sm: '50%' }, height: 'auto' }}
        openModal={openTransactionModal}
        transaction={selectedTransaction}
        refreshTransactions={refreshTransactions}
        handleCloseModal={() => {
          setOpenTransactionModal(false)
          setSelectedTransaction(null)
        }}
      />
    </>
  )
}

export default Dashboard
