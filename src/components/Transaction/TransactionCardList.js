import { Box } from '@mui/system'
import { TransactionCard } from './TransactionCard'
import { format } from 'date-fns'
import { Typography } from '@mui/material'

export const TransactionCardList = ({ transactions = [], handleTransactionSelect }) => {
  console.log(transactions)
  return (
    <Box>
      {transactions?.length
        ? (
            transactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                amount={transaction.amount}
                partyName={transaction.party}
                type={transaction.type}
                createdAt={format(new Date(transaction.createdAt.seconds * 1000), 'dd/MM/yyyy')}
                onClick={() => handleTransactionSelect(transaction)}
              />
            ))
          )
        : (
          <Typography sx={{ mt: 16 }} align='center'>Ops! Nenhuma Transação foi encontrada.</Typography>
          )}
    </Box>
  )
}
