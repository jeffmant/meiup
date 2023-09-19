'use client'
import { useAuth, useUser } from '@clerk/nextjs'
import { Box, CircularProgress, Container, Grid, Stack, Typography } from '@mui/material'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { DasnCard } from 'src/components/Dasn/DasnCard'

export default function DAS () {
  const { getToken } = useAuth()
  const { user } = useUser()

  const [documents, setDocuments] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const getDasn = async () => {
    setIsLoading(true)
    const accessToken = await getToken()
    const cnpj = user?.publicMetadata?.userCompanies?.[0]?.document
    const { data } = await fetch(`/api/infosimples/dasn/?cnpj=${cnpj}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    }).then(response => response.json())

    setDocuments(data)
    setIsLoading(false)
  }

  useEffect(() => {
    if (user) {
      getDasn()
    }
  }, [user])

  return (

    <>
      <Head>
        <title>dasn | meiup</title>
      </Head>
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth='xl'>
          <Stack spacing={3}>
            <Stack
              direction='row'
              justifyContent='center'
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant='h4'>
                  DASN
                </Typography>
              </Stack>
            </Stack>

            <Grid
              container
              spacing={3}
            >
              {
                isLoading
                  ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <Typography>Por gentileza, aguarde... </Typography>
                      <CircularProgress />
                    </div>
                    )
                  : documents?.map(document => (
                    <DasnCard
                      key={document.year}
                      document={document}
                    />
                  ))
              }
            </Grid>
          </Stack>
        </Container>
      </Box>
    </>

  )
}
