'use client'

import CheckBadgeIcon from '@heroicons/react/24/solid/CheckBadgeIcon'
import XCircleIcon from '@heroicons/react/24/solid/XCircleIcon'
import { CircularProgress, SvgIcon, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { Box } from '@mui/system'

export const DocumentTable = ({ documents, isLoading }) => {
  return (
    <Box sx={{ minWidth: 800, mt: 2 }}>
      {isLoading
        ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography>Por gentileza, aguarde...</Typography>
            <CircularProgress />
          </div>
          )
        : (
            documents?.length > 0
              ? (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Pago</TableCell>
                      <TableCell>Período</TableCell>
                      <TableCell>Valor</TableCell>
                      <TableCell sortDirection='desc'>Vencimento</TableCell>
                      <TableCell>Multa</TableCell>
                      <TableCell>Juros</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {documents.map((document) => (
                      <TableRow
                        hover
                        key={document.code}
                        sx={{ '&:hover': { cursor: 'pointer' } }}
                        onClick={() => window.open(document.url, 'blank')}
                      >
                        <TableCell>
                          <SvgIcon fontSize='small'>
                            {document.status ? <CheckBadgeIcon color='green' /> : <XCircleIcon color='red' />}
                          </SvgIcon>
                        </TableCell>
                        <TableCell>{document.month} / {document.year}</TableCell>
                        <TableCell>{document.value?.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
                        <TableCell>{document.dueDate}</TableCell>
                        <TableCell>{document.penalty?.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
                        <TableCell>{document.fee?.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
                      </TableRow>
                    )
                    )}
                  </TableBody>
                </Table>
                )
              : (
                <Typography
                  value={{ mt: 8 }}
                  align='center'
                >Ops! Nenhum DAS foi encontrado.
                </Typography>
                )
          )}
    </Box>
  )
}
