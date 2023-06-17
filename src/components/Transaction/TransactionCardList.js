import { Box } from '@mui/system'
import { TransactionCard } from './TransactionCard'
import { format } from 'date-fns'

export const TransactionCardList = ({ transactions = [] }) => {
  return (
    <Box>
      {
        transactions.map(transaction => (
          <TransactionCard
            key={transaction.id}
            amount={transaction.amount}
            partyName={transaction.party}
            description={transaction.description}
            status={transaction.status}
            createdAt={format(new Date(transaction.createdAt), 'dd/MM/yyyy')}
          />
        ))
      }
    </Box>
  )
}
