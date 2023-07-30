import Head from 'next/head'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Box, Button, Link, Stack, TextField, Typography } from '@mui/material'
import { useAuth } from 'src/hooks/use-auth'
import { Layout as AuthLayout } from 'src/layouts/auth/layout'

const Page = () => {
  const router = useRouter()
  const auth = useAuth()

  if (auth.user) router.push('/')

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      submit: null
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
      password: Yup.string().max(255).required('Password is required')
    }),
    onSubmit: async (values, helpers) => {
      try {
        await auth.signIn({ email: values.email, password: values.password })
        router.push('/')
      } catch (err) {
        helpers.setStatus({ success: false })
        helpers.setErrors({
          submit: 'Ocorreu um erro durante o login. Por favor, tente novamente.'
        })
        helpers.setSubmitting(false)
        console.log(err)
      }
    }
  })

  return (
    <>
      <Head>
        <title>entrar | meiup</title>
      </Head>
      <Box
        sx={{
          backgroundColor: 'background.paper',
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
          <Typography variant='h4' sx={{ py: 4 }}>
            olá mei :)
          </Typography>
          <div>
            <form noValidate onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label='Email'
                  name='email'
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type='email'
                  value={formik.values.email}
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
              </Stack>
              {formik.errors.submit && (
                <Typography color='error' sx={{ mt: 3 }} variant='body2'>
                  {formik.errors.submit}
                </Typography>
              )}
              <Button fullWidth size='large' sx={{ mt: 3 }} type='submit' variant='contained'>
                Entrar
              </Button>
            </form>
            <Box
              sx={{
                marginTop: '16px',
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <Link component={NextLink} href='/auth/forgot' underline='hover' variant='subtitle2'>
                esqueci minha senha
              </Link>
              <Link
                component={NextLink}
                href='/auth/register'
                underline='hover'
                variant='subtitle2'
              >
                criar uma conta
              </Link>
            </Box>
          </div>
        </Box>
      </Box>
    </>
  )
}

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>

export default Page
