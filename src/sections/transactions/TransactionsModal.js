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
  Modal,
  InputAdornment
} from '@mui/material'
import Box from '@mui/material/Box'

const TransactionsModal = () => {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState('')
  const [description, setDescription] = useState('')
  const [value, setValue] = useState('')
  const [category, setCategory] = useState('')

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSave = () => {
    // TODO: Salvar documento da transaction no firebase
    handleClose()
  }

  const handleTypeChange = (event) => {
    setType(event.target.value)
  }

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value)
  }

  const handleValueChange = (event) => {
    setValue(event.target.value)
  }

  const handleCategoryChange = (event) => {
    setCategory(event.target.value)
  }

  return (
    <div>
      <Button variant='contained' onClick={handleOpen}>
        Nova Transação
      </Button>
      <Modal open={open} onClose={handleClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                value={type}
                label='Tipo'
                onChange={handleTypeChange}
              >
                <MenuItem value='receita'>Receita</MenuItem>
                <MenuItem value='despesa'>Despesa</MenuItem>
              </Select>
            </FormControl>

            {type === 'receita' && (
              <TextField
                fullWidth
                value='Cliente'
                label='Cliente/Fornecedor'
                disabled
                sx={{ mb: 2 }}
              />
            )}

            {type === 'despesa' && (
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
              value={description}
              label='Descrição'
              onChange={handleDescriptionChange}
              multiline
              rows={4}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              value={value}
              label='Valor'
              onChange={handleValueChange}
              InputProps={{
                startAdornment: <InputAdornment position='start'>R$</InputAdornment>
              }}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id='select-category-label'>Categoria</InputLabel>
              <Select
                labelId='select-category-label'
                id='select-category'
                value={category}
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
