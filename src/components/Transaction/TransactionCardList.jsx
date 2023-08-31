import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { format } from 'date-fns'
import { TransactionCard } from './TransactionCard'

export const TransactionCardList = ({ transactions = [], handleTransactionSelect }) => {
  return (
    <Box>
      {transactions?.length
        ? (
            transactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                value={transaction.value}
                partyName={transaction.partyName}
                type={transaction.type}
                dueDate={format(new Date(transaction.dueDate), 'dd/MM/yyyy')}
                onClick={() => handleTransactionSelect(transaction)}
              />
            ))
          )
        : (
          <Typography
            sx={{ mt: 16 }}
            align='center'
          >Ops! Nenhuma Transação foi encontrada.
          </Typography>
          )}
    </Box>
  )
}
