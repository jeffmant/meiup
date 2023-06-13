import { Box } from '@mui/system'
import { Invoice } from './Invoice'

export const InvoiceList = ({ invoices = [] }) => {
  return (
    <Box>
      {
        invoices.map(invoice => (
          <Invoice
            key={invoice.id}
            amount={invoice.amount}
            customer={{ name: invoice.customer.name }}
            number={invoice.ref}
            status={invoice.status}
            createdAt={invoice.createdAt}
          />
        ))
      }
    </Box>
  )
}
