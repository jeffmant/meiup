import { Button, Menu, MenuItem } from '@mui/material'
import { useState } from 'react'

const YearSelector = ({ handleChange, options }) => {
  const currentYear = new Date().getFullYear()

  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [anchorEl, setAnchorEl] = useState(null)

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleYearSelect = (year) => {
    setSelectedYear(year)
    handleChange(year)
    handleCloseMenu()
  }

  return (
    <div>
      <Button
        variant='outlined'
        onClick={handleOpenMenu}
        sx={{ mb: 2, width: 100 }}
      >
        {selectedYear}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        {options?.map((year) => (
          <MenuItem
            key={year}
            onClick={(e) => {
              e.stopPropagation()
              handleYearSelect(year)
            }}
          >
            {year}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

export default YearSelector
