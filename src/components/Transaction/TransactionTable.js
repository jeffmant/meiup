import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { format } from 'date-fns'
import React, { useState } from 'react'
import TransactionsModal from './TransactionsModal'

export const TransactionTable = ({ transactions }) => {
  const [selectedTransaction, setSelectedTransaction] = useState(null)

  const handleTransactionSelect = (transaction) => {
    setSelectedTransaction(transaction)
  }

  return (
    <Box sx={{ minWidth: 800 }}>
      {
        transactions?.length > 0
          ? (

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
                      onClick={() => handleTransactionSelect(transaction)}
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
            )
          : (
            <Typography>
              Ops! Nenhuma Transação foi Encontrada.
            </Typography>
            )
      }

      {selectedTransaction && (
        <TransactionsModal
          handleTransactionSaved={() => setSelectedTransaction(null)}
          transaction={selectedTransaction}
        />
      )}
    </Box>
  )
}
