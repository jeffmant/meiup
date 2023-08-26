'use client'

import { Button, Typography } from '@mui/material'

export default function GlobalError ({ error, reset }) {
  return (
    <html>
      <body>
        <Typography component='h2'>{error.message || 'Ops! Algo deu errado'}</Typography>
        <Button onClick={() => reset()}>Tentar novamente</Button>
      </body>
    </html>
  )
}
