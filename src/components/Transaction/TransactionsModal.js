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
  Modal
} from '@mui/material'
import Box from '@mui/material/Box'
import { formatCurrency } from 'src/utils/masks'
import { useAuth } from 'src/hooks/use-auth'
import createTransactionDoc from 'src/utils/create-transaction-doc'

const TransactionsModal = ({ handleTransactionSaved }) => {
  const { user } = useAuth()
  const companyId = user?.company?.id

  const [modalState, setModalState] = useState({
    open: false,
    type: '',
    party: '',
    description: '',
    amount: '',
    category: ''
  })

  const resetModalStateAndClose = () => {
    setModalState({
      open: false,
      type: '',
      party: '',
      description: '',
      amount: '',
      category: ''
    })
  }

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

    const transactionData = { ...data, companyId, createdAt: new Date().toISOString(), status: true }

    await createTransactionDoc(transactionData)

    handleClose()

    handleTransactionSaved()
  }

  const handleTypeChange = (event) => {
    setModalState({ ...modalState, type: event.target.value })
  }

  const handleDescriptionChange = (event) => {
    setModalState({ ...modalState, description: event.target.value })
  }

  const handleAmountChange = (event) => {
    setModalState({ ...modalState, amount: event.target.value.replace(/[^\d]/g, '') })
  }

  const handleCategoryChange = (event) => {
    setModalState({ ...modalState, category: event.target.value })
  }

  return (
    <div>
      <Button variant='contained' onClick={handleOpen}>
        Nova Transação
      </Button>
      <Modal open={modalState.open} onClose={handleClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

            {modalState.type && <TextField
              fullWidth
              value={modalState.party}
              label='Cliente/Fornecedor'
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
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant='outlined' sx={{ mr: 1 }}>
              Cancelar
            </Button>
            <Button onClick={handleSave} variant='contained' color='primary'>
              Salvar
            </Button>
          </DialogActions>
        </Box>
      </Modal>
    </div>
  )
}

export default TransactionsModal
