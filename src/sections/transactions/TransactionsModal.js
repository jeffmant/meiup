import React, { useState } from 'react'
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

const TransactionsModal = () => {
  const [modalState, setModalState] = useState({
    open: false,
    type: '',
    description: '',
    value: '',
    category: ''
  })

  const handleOpen = () => {
    setModalState({ ...modalState, open: true })
  }

  const handleClose = () => {
    setModalState({ ...modalState, open: false })
  }

  const handleSave = () => {
    // Lógica para salvar os dados do formulário
    handleClose()
  }

  const handleTypeChange = (event) => {
    setModalState({ ...modalState, type: event.target.value })
  }

  const handleDescriptionChange = (event) => {
    setModalState({ ...modalState, description: event.target.value })
  }

  const handleValueChange = (event) => {
    setModalState({ ...modalState, value: event.target.value })
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
          <DialogTitle>Nova Transação</DialogTitle>
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
                <MenuItem value=''>Selecione</MenuItem>
                <MenuItem value='receita'>Receita</MenuItem>
                <MenuItem value='despesa'>Despesa</MenuItem>
              </Select>
            </FormControl>

            {modalState.type === 'receita' && (
              <TextField
                fullWidth
                value='Cliente'
                label='Cliente/Fornecedor'
                InputProps={{
                  readOnly: true
                }}
                sx={{ mb: 2 }}
              />
            )}

            {modalState.type === 'despesa' && (
              <TextField
                fullWidth
                value='Fornecedor'
                label='Cliente/Fornecedor'
                InputProps={{
                  readOnly: true
                }}
                sx={{ mb: 2 }}
              />
            )}

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
              value={formatCurrency(modalState.value)}
              label='Valor'
              onChange={handleValueChange}
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
                <MenuItem value=''>Selecione</MenuItem>
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
