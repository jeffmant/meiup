import { ptBR } from '@clerk/localizations'
import { ClerkProvider } from '@clerk/nextjs'

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
          {children}
        </ClerkProvider>
      </body>
    </html>
  )
}
