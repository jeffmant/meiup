import ArrowDownLeftIcon from '@heroicons/react/24/solid/ArrowDownLeftIcon'
import ArrowUpRightIcon from '@heroicons/react/24/solid/ArrowUpRightIcon'
import { SvgIcon, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { format } from 'date-fns'

export const TransactionTable = ({ transactions, handleTransactionSelect }) => {
  const handleTransactionClick = (transaction) => {
    handleTransactionSelect(transaction)
  }

  return (
    <Box sx={{ minWidth: 800, mt: 2 }}>
      {transactions?.length > 0
        ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tipo</TableCell>
                <TableCell>Cliente | Fornecedor</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell sortDirection='desc'>Data</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow
                  hover
                  key={transaction.id}
                  sx={{ '&:hover': { cursor: 'pointer' } }}
                  onClick={() => handleTransactionClick(transaction)}
                >
                  <TableCell>
                    <SvgIcon fontSize='small'>
                      {
                          transaction.type === 'revenue' ? <ArrowUpRightIcon color='green' /> : <ArrowDownLeftIcon color='red' />
                        }
                    </SvgIcon>
                  </TableCell>
                  <TableCell>{transaction.partyName}</TableCell>
                  <TableCell>{transaction.value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
                  <TableCell>{format(new Date(transaction.dueDate), 'dd/MM/yyyy')}
                  </TableCell>
                </TableRow>
              )
              )}
            </TableBody>
          </Table>
          )
        : (
          <Typography
            sx={{ mt: 8 }}
            align='center'
          >Ops! Nenhuma Transação foi encontrada.
          </Typography>
          )}
    </Box>
  )
}
