import { format } from 'date-fns'
import PropTypes from 'prop-types'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material'
import { SeverityPill } from 'src/components/severity-pill'

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

export const OverviewLatestOrders = (props) => {
  const { orders = [] } = props

  return (

    <Box sx={{ minWidth: 800 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              NFS
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
          {orders.map((order) => {
            const createdAt = format(order.createdAt, 'dd/MM/yyyy')

            return (
              <TableRow
                hover
                key={order.id}
                sx={{ '& hover': { cursor: 'pointer' } }}
              >
                <TableCell>
                  {order.ref}
                </TableCell>
                <TableCell>
                  {order.customer.name}
                </TableCell>
                <TableCell>
                  {`R$${order.amount}`}
                </TableCell>
                <TableCell>
                  {createdAt}
                </TableCell>
                <TableCell>
                  <SeverityPill color={statusMap[order.status].color}>
                    {statusMap[order.status].displayName}
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

OverviewLatestOrders.prototype = {
  orders: PropTypes.array,
  sx: PropTypes.object
}
