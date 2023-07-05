import React, { useState, useEffect } from 'react'
import {
  Button,
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
  useMediaQuery
} from '@mui/material'
import Box from '@mui/material/Box'
import { formatCurrency } from 'src/utils/masks'
import { useAuth } from 'src/hooks/use-auth'
import createTransactionDoc from 'src/utils/create-transaction-doc'
import updateTransactionDoc from 'src/utils/update-transaction'

const TransactionsModal = ({ handleTransactionSaved, transaction }) => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'))
  const { user } = useAuth()
  const companyId = user?.company?.id
  const docId = transaction?.id

  const [modalState, setModalState] = useState({
    open: false,
    type: '',
    party: '',
    description: '',
    amount: '',
    category: '',
    status: ''
  })

  const [savingDoc, setSavingDoc] = useState(false)
  const resetModalStateAndClose = () => {
    setModalState({
      open: false,
      type: '',
      party: '',
      description: '',
      amount: '',
      category: '',
      status: ''
    })
  }

  useEffect(() => {
    if (transaction) {
      setModalState({ ...transaction, open: true })
      console.log(transaction)
    } else {
      resetModalStateAndClose()
    }
  }, [transaction])

  useEffect(() => {
    if (modalState.type === 'revenue') {
      setModalState({ ...modalState, party: 'Cliente' })
    } else if (modalState.type === 'cost') {
      setModalState({ ...modalState, party: 'Fornecedor' })
    }
  }, [modalState.type])

  const handleOpen = () => {
    setModalState({ ...modalState, open: true })
  }

  const handleClose = () => {
    resetModalStateAndClose()
  }

  const handleSave = async () => {
    const { open, ...data } = modalState

    const transactionData = { ...data, companyId, createdAt: new Date().toISOString() }

    setSavingDoc(true)

    try {
      if (transaction) {
        await updateTransactionDoc(transactionData, docId)
      } else {
        await createTransactionDoc(transactionData, docId)
      }

      handleClose()
      handleTransactionSaved(true)
    } catch (error) {
      handleClose()
      handleTransactionSaved(false)
      console.log('Houve um erro ao salvar a transação: ', error)
    }
    setSavingDoc(false)
  }

  const handleTypeChange = (event) => {
    setModalState({ ...modalState, type: event.target.value })
  }

  const handleDescriptionChange = (event) => {
    setModalState({ ...modalState, description: event.target.value })
  }

  const handleAmountChange = (event) => {
    const inputValue = event.target.value.replace(/[^\d]/g, '')
    const formattedValue = formatCurrency(inputValue)
    setModalState({ ...modalState, amount: formattedValue })
  }

  const handleCategoryChange = (event) => {
    setModalState({ ...modalState, category: event.target.value })
  }

  const handleStatusChange = (event) => {
    setModalState({ ...modalState, status: event.target.value })
  }

  return (
    <div style={{ display: 'flex', justifyContent: lgUp ? 'flex-end' : 'center' }}>
      {!transaction && (
        <Button
          variant='contained'
          onClick={handleOpen}
          sx={{ mb: 2 }}
        >
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
            <DialogTitle>Nova Transação</DialogTitle>
          </Box>
          <DialogContent>
            <FormControl
              fullWidth
              sx={{ mb: 2 }}
            >
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

            {modalState.type && <TextField
              fullWidth
              value={modalState.party}
              label={modalState.type === 'cost' ? 'Fornecedor' : 'Cliente'}
              id='party'
              InputProps={{
                readOnly: true
              }}
              sx={{ mb: 2 }}
                                />}

            <TextField
              fullWidth
              value={modalState.description}
              label='Descrição'
              onChange={handleDescriptionChange}
              multiline
              rows={4}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              value={formatCurrency(modalState.amount)}
              label='Valor'
              onChange={handleAmountChange}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id='select-category-label'>Categoria</InputLabel>
              <Select
                labelId='select-category-label'
                id='select-category'
                value={modalState.category}
                label='Categoria'
                onChange={handleCategoryChange}
              >
                <MenuItem value='reposicao'>Reposição</MenuItem>
                <MenuItem value='manutencao'>Manutenção</MenuItem>
                <MenuItem value='venda'>Venda</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id='select-status-label'>Status</InputLabel>
              <Select
                labelId='select-status-label'
                id='select-status'
                value={modalState.status}
                label='Status'
                onChange={handleStatusChange}
              >
                <MenuItem value='emited'>Emitida</MenuItem>
                <MenuItem value='canceled'>Cancelada</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
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
        </Box>
      </Modal>
    </div>
  )
}

export default TransactionsModal
