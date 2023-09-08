import { Button, Menu, MenuItem } from '@mui/material'
import { useState } from 'react'

const TransactionTypeSelector = ({ handleTransactionType }) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
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

  const handleTypeSelect = async (index) => {
    setSelectedIndex(index)
    const type = types[index]
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
        {types.map((type, index) => (
          <MenuItem
            key={type.value}
            selected={index === selectedIndex}
            onClick={() => handleTypeSelect(index)}
          >
            {type.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

export default TransactionTypeSelector
