import { ptBR } from '@clerk/localizations'
import { ClerkProvider } from '@clerk/nextjs'
import NotificationBar from 'src/components/Notification/Notification'
import { NotificationProvider } from 'src/contexts/notification.context'

export const metadata = {
  title: 'meiup',
  description: ''
}

export default function RootLayout ({
  children
}) {
  return (
    <html lang='en'>
      <body>
        <ClerkProvider localization={ptBR}>
          <NotificationProvider>
            <NotificationBar />
            {children}
          </NotificationProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
