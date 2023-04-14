import { format } from 'date-fns';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  Pagination,
  SvgIcon,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { SeverityPill } from 'src/components/severity-pill';
import { useCallback, useState } from 'react';

const statusMap = {
  pending: 'warning',
  delivered: 'success',
  refunded: 'error'
};

export const OverviewLatestOrders = (props) => {
  const { orders = [], sx } = props;


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
            <TableCell sortDirection="desc">
              Data
            </TableCell>
            <TableCell>
              Status da NFS
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => {
            const createdAt = format(order.createdAt, 'dd/MM/yyyy');

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
                  {createdAt}
                </TableCell>
                <TableCell>
                  <SeverityPill color={statusMap[order.status]}>
                    {order.status}
                  </SeverityPill>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Box>
  );
};

OverviewLatestOrders.prototype = {
  orders: PropTypes.array,
  sx: PropTypes.object
};
