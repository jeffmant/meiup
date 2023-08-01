import React, { useState, useEffect } from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Modal,
  CircularProgress,
  useMediaQuery,
  Typography
} from '@mui/material'
import Box from '@mui/material/Box'
import { formatCurrency } from 'src/utils/masks'
import { useAuth } from 'src/hooks/use-auth'
import createTransactionDoc from 'src/utils/create-transaction-doc'
import updateTransactionDoc from 'src/utils/update-transaction'
import deleteTransaction from 'src/utils/delete-transaction'

const TransactionsModal = ({ transaction, cancelTransactionSelect, handleTransactionSaved }) => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'))
  const { user } = useAuth()
  const companyId = user?.company?.id
  const docId = transaction?.id
  const currentDate = new Date().toISOString().split('T')[0]

  const [modalState, setModalState] = useState({
    open: false,
    type: '',
    party: '',
    amount: '',
    date: currentDate
  })

  const [savingDoc, setSavingDoc] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const resetModalStateAndClose = () => {
    setModalState({
      open: false,
      type: '',
      party: '',
      amount: '',
      date: currentDate
    })
  }

  useEffect(() => {
    if (transaction) {
      setModalState({ ...transaction, open: true })
    } else {
      resetModalStateAndClose()
    }
  }, [transaction])

  const handleOpen = () => {
    setModalState({ ...modalState, open: true })
  }

  const handleClose = () => {
    resetModalStateAndClose()
    cancelTransactionSelect()
  }

  const handleDelete = async () => {
    if (transaction) {
      try {
        await deleteTransaction(transaction.id)
        handleTransactionSaved('DeleteOK')
        setConfirmDelete(false)
        handleClose()
      } catch (error) {
        handleTransactionSaved('DeleteFail')
        setConfirmDelete(false)
        handleClose()
      }
    }
  }

  const handleSave = async () => {
    const { open, ...data } = modalState

    const transactionData = { ...data, companyId, amount: Number(+(modalState.amount.replace(',', '.'))).toFixed(2) }
    console.log('transactionData -> ', transactionData)

    setSavingDoc(true)

    try {
      if (transaction) {
        await updateTransactionDoc(transactionData, docId)
      } else {
        await createTransactionDoc(transactionData, docId)
      }
      handleTransactionSaved('OK')
      handleClose()
    } catch (error) {
      handleTransactionSaved('Fail')
      handleClose()
      console.log('Houve um erro ao salvar a transação: ', error)
    }
    setSavingDoc(false)
  }

  const handleTypeChange = (event) => {
    setModalState({ ...modalState, type: event.target.value })
  }

  const handlePartyChange = (event) => {
    setModalState({ ...modalState, party: event.target.value })
  }

  const handleAmountChange = (event) => {
    setModalState({ ...modalState, amount: event.target.value })
  }

  console.log(modalState.amount)

  const handleDateChange = (event) => {
    setModalState({ ...modalState, date: event.target.value })
  }

  return (
    <div style={{ display: 'flex', justifyContent: lgUp ? 'flex-end' : 'center' }}>
      {!transaction && (
        <Button variant='contained' onClick={handleOpen} sx={{ mb: 2 }}>
          Nova Transação
        </Button>
      )}
      <Modal
        open={modalState.open}
        onClose={handleClose}
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
          <DialogContent>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id='select-type-label'>Tipo</InputLabel>
              <Select
                labelId='select-type-label'
                id='select-type'
                value={modalState.type}
                label='Tipo'
                onChange={handleTypeChange}
              >
                <MenuItem value='revenue'>Receita</MenuItem>
                <MenuItem value='cost'>Despesa</MenuItem>
              </Select>
            </FormControl>

            {modalState.type && (
              <TextField
                fullWidth
                value={modalState.party}
                label={modalState.type === 'cost' ? 'Fornecedor' : 'Cliente'}
                onChange={handlePartyChange}
                id='party'
                sx={{ mb: 2 }}
              />
            )}

            <TextField
              fullWidth
              value={formatCurrency(modalState.amount)}
              label='Valor'
              onChange={handleAmountChange}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              type='date'
              value={modalState.date}
              label='Data'
              onChange={handleDateChange}
              sx={{ mb: 2 }}
            />

          </DialogContent>
          <DialogActions>
            {transaction && (
              <Button variant='contained' color='error' onClick={() => setConfirmDelete(true)}>
                Excluir
              </Button>
            )}
            <Button onClick={handleClose} variant='outlined' sx={{ mr: 1 }}>
              Cancelar
            </Button>
            {savingDoc
              ? (
                <CircularProgress />
                )
              : (
                <Button variant='contained' onClick={handleSave}>
                  Salvar
                </Button>
                )}
          </DialogActions>
          <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
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
    </div>
  )
}

export default TransactionsModal
