import Head from 'next/head'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {
  Box,
  Button,
  CircularProgress,
  Link,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { useAuth } from 'src/hooks/use-auth'
import { Layout as AuthLayout } from 'src/layouts/auth/layout'
import { cnpjMask, removeMask } from 'src/utils/masks'
import { useContext, useState } from 'react'
import { getCompanyByCnpj } from 'src/firebase/helpers/company.helper'
import NotificationContext from 'src/contexts/notification.context'

const Page = () => {
  const router = useRouter()
  const auth = useAuth()

  if (auth.user) router.push('/')

  const [isLoading, setIsLoading] = useState(false)
  const [cnpjIsValid, setCnpjIsValid] = useState(false)
  const [companyData, setCompanyData] = useState(null)

  const notificationCtx = useContext(NotificationContext)

  const validateCNPJ = async ({ cnpj }) => {
    const company = await getCompanyByCnpj({ cnpj })

    if (company) {
      formik.values.cnpj = ''
      setIsLoading(false)

      notificationCtx.warning('Este MEI já está cadastrado. Vamos fazer o login?')
      setTimeout(() => {
        router.push('/auth/login')
      }, 3000)
    } else {
      const response = await fetch(`/api/company/${cnpj}`)
      const { error, data: externalCompanyInfo } = await response.json()

      if (error) {
        formik.values.cnpj = ''
        notificationCtx.error(error)
      }

      if (externalCompanyInfo) {
        setCnpjIsValid(true)
        setCompanyData(externalCompanyInfo)
        formik.values.email = externalCompanyInfo.email
        formik.values.name = externalCompanyInfo.fantasyName
      }
      setIsLoading(false)
    }
  }

  const formik = useFormik({
    initialValues: {
      cnpj: '',
      email: '',
      name: '',
      password: '',
      confirmPassword: '',
      submit: null
    },
    validationSchema: Yup.object({
      cnpj: Yup.string().required('Digite o CNPJ do seu MEI'),
      email: Yup.string()
        .email('Eita! Este Email é inválido')
        .max(255)
        .required('Ops! Esqueceu do Email'),
      password: Yup.string().min(8, 'Mínimo 8 dígitos').required('Ops! Esqueceu da Senha'),
      confirmPassword: Yup.string()
        .min(8, 'Mínimo 8 dígitos')
        .required('Ops! Esqueceu de Confirmar a Senha')
        .oneOf([Yup.ref('password'), null], 'As senhas precisam ser iguais')
    }),
    onSubmit: async (values, helpers) => {
      setIsLoading(true)
      try {
        auth
          .signUp({
            email: values.email,
            password: values.password,
            companyData
          })
          .then(() => {
            setIsLoading(false)
            notificationCtx.success('Cadastro realizado com sucesso!')
            setTimeout(() => {
              router.push('/')
            }, 3000)
          })
          .catch((error) => {
            throw new Error(error)
          })
      } catch (err) {
        setIsLoading(false)
        notificationCtx.error(err.message)
        helpers.setStatus({ success: false })
        helpers.setErrors({ submit: err.message })
        helpers.setSubmitting(false)
      }
    }
  })

  return (
    <>
      <Head>
        <title>criar conta | meiup</title>
      </Head>
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
              você vai se juntar ao time? ;)
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
                  disabled={cnpjIsValid}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={cnpjMask(formik.values.cnpj || '')}
                />
                {cnpjIsValid && (
                  <>
                    <TextField
                      error={!!(formik.touched.name && formik.errors.name)}
                      fullWidth
                      helperText={formik.touched.name && formik.errors.name}
                      label='Nome Fantasia'
                      name='name'
                      disabled
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.name}
                    />
                    <TextField
                      error={!!(formik.touched.email && formik.errors.email)}
                      fullWidth
                      helperText={formik.touched.email && formik.errors.email}
                      label='Email'
                      name='email'
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      type='email'
                      value={formik.values.email.toLowerCase()}
                    />
                    <TextField
                      error={!!(formik.touched.password && formik.errors.password)}
                      fullWidth
                      helperText={formik.touched.password && formik.errors.password}
                      label='Senha'
                      name='password'
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      type='password'
                      value={formik.values.password}
                    />
                    <TextField
                      error={!!(formik.touched.confirmPassword && formik.errors.confirmPassword)}
                      fullWidth
                      helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                      label='Confirmar Senha'
                      name='confirmPassword'
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      type='password'
                      value={formik.values.confirmPassword}
                    />
                  </>
                )}
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
              {!cnpjIsValid
                ? (
                  <Button
                    disabled={!formik.values.cnpj || isLoading}
                    fullWidth
                    size='large'
                    sx={{ mt: 3 }}
                    variant='contained'
                    onClick={async () => {
                      setIsLoading(true)
                      await validateCNPJ({ cnpj: removeMask(formik.values.cnpj) })
                    }}
                  >
                    {isLoading ? <CircularProgress color='primary' /> : 'Avançar'}
                  </Button>
                  )
                : (
                  <Button
                    disabled={
                    !formik.values.cnpj ||
                    removeMask(formik.values.cnpj || '').length < 14 ||
                    !formik.values.email ||
                    !formik.values.name ||
                    !formik.values.password ||
                    !formik.values.confirmPassword ||
                    formik.values.password !== formik.values.confirmPassword ||
                    isLoading
                  }
                    fullWidth
                    size='large'
                    sx={{ mt: 3 }}
                    type='submit'
                    variant='contained'
                  >
                    {isLoading ? <CircularProgress color='primary' /> : 'Criar Conta'}
                  </Button>
                  )}
            </form>
            <Box
              sx={{
                marginTop: '16px',
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'flex-end'
              }}
            >
              {' '}
              {!isLoading && !cnpjIsValid && (
                <Link
                  component={NextLink}
                  href='/auth/login'
                  underline='hover'
                  variant='subtitle2'
                >
                  já tenho conta, quero fazer login
                </Link>
              )}
            </Box>
          </div>
        </Box>
      </Box>
    </>
  )
}

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>

export default Page
