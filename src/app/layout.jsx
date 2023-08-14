'use client'
import { ThemeProvider } from '@emotion/react'
import { CssBaseline } from '@mui/material'
import NotificationBar from 'src/components/Notification/Notification'
import { NotificationProvider } from 'src/contexts/notification.context'
import { createTheme } from 'src/theme'

export default function RootLayout ({
  children
}) {
  const theme = createTheme()

  return (
    <html lang='en'>
      <body>
        <NotificationProvider>
          <NotificationBar />
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </NotificationProvider>
      </body>
    </html>
  )
}
