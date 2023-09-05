import { Button, Menu, MenuItem } from '@mui/material'
import { useState } from 'react'

const TransactionMonthSelector = ({ handleTransactionMonth }) => {
  const currentMonth = new Date().getMonth()
  console.log(currentMonth)
  const months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ]

  const [selectedMonth, setSelectedMonth] = useState(months[currentMonth])
  const [anchorEl, setAnchorEl] = useState(null)

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleMonthSelect = (monthIndex) => {
    setSelectedMonth(months[monthIndex])
    handleTransactionMonth(monthIndex)
    handleCloseMenu()
  }

  return (
    <div>
      <Button
        variant='outlined'
        onClick={handleOpenMenu}
        sx={{ mb: 2, width: 100 }}
      >
        {selectedMonth}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        {months.map((month, index) => (
          <MenuItem
            key={month}
            onClick={(e) => {
              e.stopPropagation()
              handleMonthSelect(index)
            }}
          >
            {month}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

export default TransactionMonthSelector
