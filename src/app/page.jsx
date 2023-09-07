'use client'

import { useAuth, useUser } from '@clerk/nextjs'
import { Button, CircularProgress, Grid, TextField, Typography } from '@mui/material'
import { Box, Stack } from '@mui/system'
import { useFormik } from 'formik'
import { redirect } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'
import NotificationContext from 'src/contexts/notification.context'
import { cnpjMask, removeMask } from 'src/utils/masks'
import * as Yup from 'yup'

export default function Home () {
  const [isLoading, setIsLoading] = useState(false)
  const [userCompanies, setUserCompanies] = useState([])
  const { isSignedIn, isLoaded, getToken } = useAuth()
  const { user: currentLoggedUser } = useUser()
  const notificationCtx = useContext(NotificationContext)

  if (userCompanies?.length > 0) redirect('/dashboard')

  async function getOrCreateUser () {
    const userToken = await getToken()
    const { data: foundUser } = await fetch('/api/user', {
      method: 'GET',
      headers: { Authorization: `Bearer ${userToken}` }
    }).then(response => response.json())

    if (!foundUser && currentLoggedUser) {
      const { data: createdUser } = await fetch('/api/user', {
        method: 'POST',
        headers: { Authorization: `Bearer ${userToken}` },
        body: JSON.stringify({
          clerkUserId: currentLoggedUser.id,
          firstName: currentLoggedUser.firstName,
          lastName: currentLoggedUser.lastName,
          email: currentLoggedUser.emailAddresses?.[0]?.emailAddress,
          phone: currentLoggedUser.phoneNumbers?.[0]?.phoneNumber
        })
      }).then(response => response.json())
      return createdUser
    }

    return foundUser
  }

  async function getUserCompanies () {
    const userToken = await getToken()
    const user = await getOrCreateUser()
    if (user) {
      const response = await fetch(`/api/company/?userId=${user?.id}`, {
        headers: { Authorization: `Bearer ${userToken}` }
      }).then(response => response.json())

      setUserCompanies(response?.data || [])
    }
  }

  useEffect(() => {
    if (currentLoggedUser) {
      getUserCompanies()
    }
  }, [currentLoggedUser])

  const validateCompanyDocument = async (document) => {
    const userToken = await getToken()

    const response = await fetch(`/api/infosimples/company?cnpj=${document}`, {
      headers: { Authorization: userToken }
    })

    const externalCompanyInformations = await response.json()

    return externalCompanyInformations
  }

  const formik = useFormik({
    initialValues: {
      cnpj: ''
    },
    validationSchema: Yup.object({
      cnpj: Yup.string().required('Digite o CNPJ')
    }),
    onSubmit: async (values, helpers) => {
      setIsLoading(true)
      const userToken = await getToken()

      const { data: companyData } = await validateCompanyDocument(removeMask(values.cnpj))

      if (companyData) {
        const { data } = await fetch('/api/company', {
          method: 'POST',
          headers: { Authorization: userToken },
          body: JSON.stringify(companyData)
        }).then(response => response.json())

        if (data) {
          notificationCtx.success('Empresa Criada com Sucesso!')
          redirect('/dashboard')
        }
      } else {
        notificationCtx.warning('CNPJ não encontrado')
      }

      formik.resetForm()
      setIsLoading(false)
    }
  })

  return (

    isSignedIn &&
        isLoaded &&
        (!userCompanies || userCompanies.length === 0) &&
        (
          <Box
            component='main'
            sx={{
              display: 'flex',
              flex: '1 1 auto'
            }}
          >
            <Grid
              container
              sx={{ flex: '1 1 auto' }}
            >
              <Grid
                item
                xs={12}
                lg={12}
                sx={{
                  backgroundColor: 'neutral.900',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative'
                }}
              >
                <Box
                  sx={{
                    flex: '1 1 auto',
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: 400,
                      px: 3,
                      py: '100px',
                      width: '100%'
                    }}
                  >
                    <div>
                      <Typography
                        variant='h5'
                        sx={{ py: 4 }}
                      >
                        digite o seu cnpj ;)
                      </Typography>

                      <form
                        noValidate
                        onSubmit={formik.handleSubmit}
                      >
                        <Stack spacing={3}>
                          <TextField
                            error={!!(formik.touched.cnpj && formik.errors.cnpj)}
                            fullWidth
                            helperText={formik.touched.cnpj && formik.errors.cnpj}
                            label='CNPJ'
                            name='cnpj'
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={cnpjMask(formik.values.cnpj || '')}
                          />
                        </Stack>
                        {formik.errors.submit && (
                          <Typography
                            color='error'
                            sx={{ mt: 3 }}
                            variant='body2'
                          >
                            {formik.errors.submit}
                          </Typography>
                        )}
                        <Button
                          disabled={!formik.values.cnpj}
                          fullWidth
                          size='large'
                          sx={{ mt: 3 }}
                          variant='contained'
                          type='submit'
                        >
                          {isLoading ? <CircularProgress color='secondary' /> : 'Avançar'}
                        </Button>
                      </form>
                    </div>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )
  )
}
