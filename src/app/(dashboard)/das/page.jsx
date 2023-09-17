'use client'
import { useAuth, useUser } from '@clerk/nextjs'
import { Card, CardContent, Container, Grid, Typography, useMediaQuery } from '@mui/material'
import { Box, Stack } from '@mui/system'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { DocumentCardList } from 'src/components/Document/DocumentCardList'
import { DocumentTable } from 'src/components/Document/DocumentTable'
import YearSelector from 'src/components/Selects/YearSelector'

export default function DAS () {
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'))
  const { getToken } = useAuth()
  const { user } = useUser()

  const [documents, setDocuments] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [yearsOptions, setYearsOptions] = useState([new Date().getFullYear()])

  const getDas = async (selectedYear) => {
    setIsLoading(true)
    const accessToken = await getToken()
    if (user) {
      const userCompany = user?.publicMetadata?.userCompanies?.[0]
      const { document, foundationDate } = userCompany
      const years = []
      for (let year = new Date(foundationDate).getFullYear(); year <= new Date().getFullYear(); year++) {
        years.push(year)
      }
      setYearsOptions(years)

      const { data: documents } = await fetch(`/api/infosimples/das/?cnpj=${document}&year=${selectedYear}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      }).then(response => response.json())

      setDocuments(documents || [])
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      getDas(yearsOptions[0])
    }
  }, [user])

  return (
    <>

      <Head>
        <title>das | meiup</title>
      </Head>
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          py: 2
        }}
      >
        <Container maxWidth='xl'>

          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              xs={12}
            >
              <Card
                sx={{
                  minHeight: '70vh',
                  height: '100%',
                  width: '100%'
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Stack>
                      <Typography variant='h5'>
                        DAS
                      </Typography>

                    </Stack>
                    <Stack>
                      <YearSelector
                        handleChange={getDas}
                        options={yearsOptions}
                      />
                    </Stack>
                  </Box>

                  {mdUp
                    ? (
                      <DocumentTable
                        documents={documents}
                        isLoading={isLoading}
                      />
                      )
                    : (
                      <DocumentCardList
                        documents={documents}
                        isLoading={isLoading}
                      />
                      )}
                </CardContent>

              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>

  )
}
