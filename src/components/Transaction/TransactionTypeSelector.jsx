import { Button, Menu, MenuItem } from '@mui/material'
import { useState } from 'react'

const TransactionTypeSelector = ({ handleTransactionType }) => {
  const [selectedType, setSelectedType] = useState('Todos')
  const [anchorEl, setAnchorEl] = useState(null)

  const types = [
    { label: 'Todos', value: 'all' },
    { label: 'Receita', value: 'revenue' },
    { label: 'Despesa', value: 'cost' }
  ]

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleTypeSelect = (value) => {
    const type = types.find(type => type.value === value)
    if (type) {
      setSelectedType(type.label)
      handleTransactionType(type.value)
    }
    handleCloseMenu()
  }

  return (
    <div>
      <Button
        variant='outlined'
        onClick={handleOpenMenu}
        sx={{ mb: 2, width: 100 }}
      >
        {selectedType}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        {types.map(type => (
          <MenuItem
            key={type.value}
            onClick={(e) => {
              e.stopPropagation()
              handleTypeSelect(type.value)
            }}
          >
            {type.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

export default TransactionTypeSelector
