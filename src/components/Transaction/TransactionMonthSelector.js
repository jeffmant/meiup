import { Button, Menu, MenuItem } from '@mui/material'
import { useState } from 'react'

const TransactionMonthSelector = ({ handleTransactionMonth }) => {
  const currentMonth = new Date().getMonth()
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
        {
          months.map((month, index) => (
            <MenuItem
              key={month}
              onClick={() => handleMonthSelect(index)}
            >{month}
            </MenuItem>
          ))
        }
        {/* <MenuItem onClick={() => handleMonthSelect(1)}>Fevereiro</MenuItem>
        <MenuItem onClick={() => handleMonthSelect(2)}>Março</MenuItem>
        <MenuItem onClick={() => handleMonthSelect(3)}>Abril</MenuItem>
        <MenuItem onClick={() => handleMonthSelect(4)}>Maio</MenuItem>
        <MenuItem onClick={() => handleMonthSelect(5)}>Junho</MenuItem>
        <MenuItem onClick={() => handleMonthSelect(6)}>Julho</MenuItem>
        <MenuItem onClick={() => handleMonthSelect(7)}>Agosto</MenuItem>
        <MenuItem onClick={() => handleMonthSelect(8)}>Setembro</MenuItem>
        <MenuItem onClick={() => handleMonthSelect(9)}>Outubro</MenuItem>
        <MenuItem onClick={() => handleMonthSelect(10)}>Novembro</MenuItem>
        <MenuItem onClick={() => handleMonthSelect(11)}>Dezembro</MenuItem> */}
      </Menu>
    </div>
  )
}

export default TransactionMonthSelector
