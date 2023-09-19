'use client'

import { useAuth, useUser } from '@clerk/nextjs'
import { Button, CircularProgress, Grid, TextField, Typography } from '@mui/material'
import { Box, Stack } from '@mui/system'
import { useFormik } from 'formik'
import { useRouter } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'
import NotificationContext from 'src/contexts/notification.context'
import { cnpjMask, removeMask } from 'src/utils/masks'
import * as Yup from 'yup'

export default function Home () {
  const { push } = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)
  const { isSignedIn, isLoaded, getToken } = useAuth()
  const { user: currentLoggedUser } = useUser()
  const notificationCtx = useContext(NotificationContext)

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
    setIsLoading(true)
    const userToken = await getToken()
    const user = await getOrCreateUser()
    if (user) {
      const response = await fetch(`/api/company/?userId=${user?.id}`, {
        headers: { Authorization: `Bearer ${userToken}` }
      }).then(response => response.json())

      const userCompanies = response?.data || []

      if (userCompanies?.length > 0) push('/transactions')

      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (currentLoggedUser) {
      getUserCompanies()
    }
  }, [currentLoggedUser])

  const validateCompanyDocument = async (document) => {
    const userToken = await getToken()

    return fetch(`/api/infosimples/company?cnpj=${document}`, {
      headers: { Authorization: userToken }
    }).then(response => response.json())
  }

  const formik = useFormik({
    initialValues: {
      cnpj: ''
    },
    validationSchema: Yup.object({
      cnpj: Yup.string().required('Digite o CNPJ')
    }),
    onSubmit: async (values, helpers) => {
      setIsLoadingSubmit(true)
      const userToken = await getToken()

      const { data: companyData, error } = await validateCompanyDocument(removeMask(values.cnpj))

      if (companyData) {
        const { success } = await fetch('/api/company', {
          method: 'POST',
          headers: { Authorization: userToken },
          body: JSON.stringify(companyData)
        }).then(response => response.json())

        if (success) {
          notificationCtx.success('Empresa Criada com Sucesso!')
          push('/transactions')
          formik.resetForm()
          setIsLoadingSubmit(false)
        } else {
          helpers.setErrors({ cnpj: error })
          notificationCtx.error('Empresa Não foi Criada! Tente novamente.')
          formik.resetForm()
          setIsLoadingSubmit(false)
        }
      } else {
        notificationCtx.error(error)
        formik.resetForm()
        setIsLoadingSubmit(false)
      }
    }
  })

  return (

    isSignedIn &&
        isLoaded &&
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
                       {
                        isLoading
                          ? 'Verificando a sua conta...'
                          : 'digite o seu cnpj ;)'
                      }

                     </Typography>
                     {
                      isLoading
                        ? (
                          <CircularProgress
                            size={50}
                            color='primary'
                          />
                          )
                        : (
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
                              {isLoadingSubmit
                                ? <CircularProgress color='info' />
                                : 'Avançar'}
                            </Button>
                          </form>

                          )
                     }

                   </div>
                 </Box>
               </Box>
             </Grid>
           </Grid>
         </Box>
       )
  )
}
