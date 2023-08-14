'use client'
import { Alert, Snackbar } from '@mui/material'
import { useContext, useState } from 'react'
import NotificationContext from '../../contexts/notification.context'

const NotificationBar = () => {
  const notificationCtx = useContext(NotificationContext)
  const [isOpen, setIsOpen] = useState(true)

  return (
    notificationCtx.notification !== null &&
      <Snackbar
        open={isOpen}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={() => {
          notificationCtx.clear()
          setIsOpen(false)
        }}
      >
        <Alert
          severity={notificationCtx?.notification}
        >
          {notificationCtx?.notificationText}
        </Alert>
      </Snackbar>
  )
}
export default NotificationBar
