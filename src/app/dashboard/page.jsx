'use client'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  FormControl,
  Unstable_Grid2 as Grid,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Typography,
  useMediaQuery
} from '@mui/material'
import { Stack } from '@mui/system'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { TransactionCardList } from 'src/components/Transaction/TransactionCardList'
import TransactionMonthSelector from 'src/components/Transaction/TransactionMonthSelector'
import { TransactionTable } from 'src/components/Transaction/TransactionTable'
import TransactionYearSelector from 'src/components/Transaction/TransactionYearSelector'
import TransactionsModal from 'src/components/Transaction/TransactionsModal'
import { getAllTransactions } from 'src/utils/transactions-utils'

const currentMonth = new Date().getMonth()
const currentYear = new Date().getFullYear()

const Dashboard = async () => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'))
  const [openTransactionModal, setOpenTransactionModal] = useState(false)
  const [transactionType, setTransactionType] = useState('all')
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [transactionMonth, setTransactionMonth] = useState(currentMonth)
  const [transactionYear, setTransactionYear] = useState(currentYear)
  const [transactions, setTransactions] = useState([])

  const monthlyRevenue = 0
  const monthlyCost = 0

  const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'))

  useEffect(() => {
    refreshTransactions()
  }, [])

  const refreshTransactions = async () => {
    const fetchedTransactions = await getAllTransactions()
    setTransactions(fetchedTransactions)
  }

  const handleTransactionSelect = (transaction) => {
    setSelectedTransaction(transaction)
  }

  const handleTransactionMonth = async (month) => {
    setTransactionMonth(month)
    console.log('selected month -> ', transactionMonth)
  }

  const handleTransactionYear = async (year) => {
    setTransactionYear(year)
    console.log('selected year -> ', transactionYear)
  }

  const handleTransactionType = async (e) => {
    e.stopPropagation()
    setTransactionType(e.target.value)
  }

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
                          <TransactionMonthSelector handleTransactionMonth={handleTransactionMonth} />
                        </Stack>
                        <Stack sx={{ mr: 2 }}>
                          <TransactionYearSelector handleTransactionYear={handleTransactionYear} />
                        </Stack>

                        <FormControl
                          fullWidth
                          sx={{ width: '128px' }}
                        >
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
                      <div style={{ display: 'flex', justifyContent: lgUp ? 'flex-end' : 'center' }}>
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
                  >Transações
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
                    {
                      transactions.length > 0 && (
                        <Pagination
                          count={transactions.length}
                          size='small'
                        />
                      )
                    }
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
        handleCloseModal={() =>
          setOpenTransactionModal(false)}
      />
    </>
  )
}

export default Dashboard
