import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { Box } from '@mui/system'
import { format } from 'date-fns'

export const TransactionTable = ({ transactions }) => {
  return (
    <Box sx={{ minWidth: 800 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              Descrição
            </TableCell>
            <TableCell>
              Cliente
            </TableCell>
            <TableCell>
              Valor
            </TableCell>
            <TableCell sortDirection='desc'>
              Data
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction) => {
            const createdAt = format(new Date(transaction.createdAt), 'dd/MM/yyyy')

            return (
              <TableRow
                hover
                key={transaction.id}
                sx={{ '&:hover': { cursor: 'pointer' } }}
              >
                <TableCell>
                  {transaction.description}
                </TableCell>
                <TableCell>
                  {transaction.party}
                </TableCell>
                <TableCell>
                  {`R$${transaction.amount}`}
                </TableCell>
                <TableCell>
                  {createdAt}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Box>
  )
}
