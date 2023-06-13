import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { Box } from '@mui/system'
import { format } from 'date-fns'
import { SeverityPill } from '../severity-pill'

const statusMap = {
  emited: {
    color: 'success',
    displayName: 'Emitida'
  },
  canceled: {
    color: 'error',
    displayName: 'Cancelada'
  }
}

export const InvoiceTable = ({ invoices }) => {
  return (
    <Box sx={{ minWidth: 800 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              NFS-e
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
            <TableCell>
              Status da NFS
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoices.map((invoice) => {
            const createdAt = format(invoice.createdAt, 'dd/MM/yyyy')

            return (
              <TableRow
                hover
                key={invoice.id}
                sx={{ '&:hover': { cursor: 'pointer' } }}
              >
                <TableCell>
                  {invoice.ref}
                </TableCell>
                <TableCell>
                  {invoice.customer.name}
                </TableCell>
                <TableCell>
                  {`R$${invoice.amount}`}
                </TableCell>
                <TableCell>
                  {createdAt}
                </TableCell>
                <TableCell>
                  <SeverityPill color={statusMap[invoice.status].color}>
                    {statusMap[invoice.status].displayName}
                  </SeverityPill>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Box>
  )
}
