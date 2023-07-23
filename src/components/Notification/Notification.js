import React, { useContext, useState } from 'react'
import NotificationContext from '../../contexts/notification.context'
import { Alert, Snackbar } from '@mui/material'

const NotificationBar = () => {
  const notificationCtx = useContext(NotificationContext)
  const [isOpen, setIsOpen] = useState(true)

  return (
    notificationCtx.notification !== null &&
      <Snackbar
        open={isOpen}
        autoHideDuration={3000}
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
