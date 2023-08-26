import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography
} from '@mui/material'
import Box from '@mui/material/Box'
import { useFormik } from 'formik'
import { useState } from 'react'
import { formatCurrency } from 'src/utils/masks'
import { createTransaction, deleteTransaction, updateTransaction } from 'src/utils/transactions-utils'
import * as Yup from 'yup'

const TransactionsModal = ({ transaction, refreshTransactions, openModal, handleCloseModal }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleDelete = async () => {
    if (transaction) {
      try {
        await deleteTransaction(transaction)
        await refreshTransactions()
        setConfirmDelete(false)
      } catch (error) {
        setConfirmDelete(false)
      }
    }
  }

  const formik = useFormik({
    initialValues: {
      type: transaction ? transaction.type : 'revenue',
      partyName: transaction ? transaction.partyName : '',
      amount: transaction ? transaction.amount : '',
      date: transaction ? transaction.date : ''
    },
    validationSchema: Yup.object({
      type: Yup.string().required(),
      partyName: Yup.string().required(),
      amount: Yup.number().required(),
      date: Yup.date().required()
    }),
    onSubmit: async (values, helpers) => {
      if (transaction) {
        try {
          console.log('Atualizando...')
          setIsLoading(true)
          await updateTransaction(values)
          setTimeout(() => {
            setIsLoading(false)
          }, 3000)
          console.log('transaction data -> ', values)
          refreshTransactions()
        } catch (err) {
          helpers.setStatus({ success: false })
          console.log(err)
        } finally {
          formik.resetForm()
        }
      } else {
        try {
          console.log('Salvando...')
          setIsLoading(true)
          await createTransaction(values)
          setTimeout(() => {
            setIsLoading(false)
          }, 3000)
          console.log('transaction data -> ', values)
          refreshTransactions()
        } catch (err) {
          helpers.setStatus({ success: false })
          console.log(err)
        } finally {
          formik.resetForm()
        }
      }
    }
  })

  return (
    <Modal
      open={openModal}
      onClose={handleCloseModal}
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Box
        sx={{
          width: { xs: '100%', sm: '50%' },
          borderRadius: '12px',
          p: 2,
          bgcolor: 'background.paper',
          boxShadow: 24,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box>
          <DialogTitle>{transaction ? 'Editar Transação' : 'Nova Transação'}</DialogTitle>
        </Box>
        <form
          noValidate
          onSubmit={formik.handleSubmit}
        >
          <DialogContent>
            <FormControl
              fullWidth
              sx={{ mb: 2 }}
            >
              <InputLabel id='select-type-label'>Tipo</InputLabel>
              <Select
                name='type'
                labelId='select-type-label'
                error={formik.errors.type}
                value={formik.values.type}
                label='Tipo'
                onChange={formik.handleChange}
              >
                <MenuItem value='revenue'>Receita</MenuItem>
                <MenuItem value='cost'>Despesa</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              name='partyName'
              value={formik.values.partyName}
              label={formik.values.type === 'cost' ? 'Fornecedor' : 'Cliente'}
              onChange={formik.handleChange}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              name='amount'
              value={formatCurrency(formik.values.amount)}
              label='Valor'
              onChange={formik.handleChange}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              type='date'
              name='date'
              value={formik.values.date}
              label='Data'
              onChange={formik.handleChange}
              sx={{ mb: 2 }}
            />

          </DialogContent>
          <DialogActions>
            {formik.errors.submit && (
              <Typography
                color='error'
                sx={{ mt: 3 }}
                variant='body2'
              >
                {formik.errors.submit}
              </Typography>
            )}
            {transaction && (
              <Button
                variant='contained'
                color='error'
                onClick={() => setConfirmDelete(true)}
              >
                Excluir
              </Button>
            )}
            <Button
              onClick={() => {
                handleCloseModal()
                formik.resetForm()
              }}
              variant='outlined'
              sx={{ mr: 1 }}
            >
              Cancelar
            </Button>
            {isLoading
              ? (
                <CircularProgress />
                )
              : (
                <Button
                  variant='contained'
                  type='submit'
                >
                  Salvar
                </Button>
                )}
          </DialogActions>
        </form>
        <Dialog
          open={confirmDelete}
          onClose={() => setConfirmDelete(false)}
        >
          <DialogTitle>Confirmação de Exclusão</DialogTitle>
          <DialogContent>
            <Typography>Deseja realmente excluir esta transação?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDelete(false)}>Cancelar</Button>
            <Button onClick={handleDelete}>Confirmar</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Modal>
  )
}

export default TransactionsModal
