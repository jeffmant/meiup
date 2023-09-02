'use client'
import { useAuth } from '@clerk/nextjs'
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
import { format } from 'date-fns'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { formatCurrency } from 'src/utils/masks'
import {
  createTransaction,
  deleteTransaction,
  updateTransaction
} from 'src/utils/transactions-utils'
import * as Yup from 'yup'

const TransactionsModal = ({ transaction, refreshTransactions, openModal, handleCloseModal }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const { getToken } = useAuth()

  const handleDelete = async () => {
    const accessToken = await getToken()
    if (transaction) {
      try {
        await deleteTransaction(transaction.id, accessToken)
        await refreshTransactions()
        setConfirmDelete(false)
      } catch (error) {
        setConfirmDelete(false)
      } finally {
        handleCloseModal()
      }
    }
  }

  const handleSave = async (values) => {
    const accessToken = await getToken()
    if (transaction) {
      try {
        setIsLoading(true)
        await updateTransaction(transaction.id, values, accessToken)
        refreshTransactions()
      } catch (err) {
        console.log(err)
      } finally {
        formik.resetForm()
        handleCloseModal()
      }
    } else {
      try {
        setIsLoading(true)
        await createTransaction(values, accessToken)
        refreshTransactions()
      } catch (err) {
        console.log(err)
      } finally {
        setIsLoading(false)
        formik.resetForm()
        handleCloseModal()
      }
    }
  }

  useEffect(() => {
    if (transaction) {
      formik.setValues({
        type: transaction.type,
        partyName: transaction.partyName,
        value: String(transaction.value),
        dueDate: format(new Date(transaction.dueDate), 'dd/MM/yyyy')
      })
    }
  }, [transaction])

  const formik = useFormik({
    initialValues: {
      type: 'revenue',
      partyName: '',
      value: '',
      dueDate: format(new Date(), 'yyyy-MM-dd')
    },
    validationSchema: Yup.object({
      type: Yup.string().required(),
      partyName: Yup.string().required(),
      value: Yup.string().required(),
      dueDate: Yup.date().required()
    })
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
              name='value'
              value={formatCurrency(formik.values.value)}
              label='Valor'
              onChange={formik.handleChange}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              type='date'
              name='dueDate'
              value={formik.values.dueDate}
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
            <Button
              disabled={!formik.isValid}
              variant='contained'
              onClick={async () => await handleSave(formik.values)}
            >
              {isLoading
                ? <CircularProgress
                    size={20}
                    color='secondary'
                  />
                : 'Salvar'}
            </Button>
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
