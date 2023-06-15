import Head from 'next/head'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Box, Button, Link, Stack, TextField, Typography } from '@mui/material'
import { useAuth } from 'src/hooks/use-auth'
import { Layout as AuthLayout } from 'src/layouts/auth/layout'
import { cnpjMask } from 'src/utils/masks'

const Page = () => {
  const router = useRouter()
  const auth = useAuth()
  const formik = useFormik({
    initialValues: {
      cnpj: '',
      email: '',
      name: '',
      password: '',
      submit: null
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
      name: Yup.string().max(255).required('Name is required'),
      password: Yup.string().max(255).required('Password is required'),
      confirmPassword: Yup.string().max(255).required('ConfirmPassword is required')
    }),
    onSubmit: async (values, helpers) => {
      try {
        await auth.signUp(values.cnpj, values.email, values.name, values.password)
        router.push('/auth/login') // Retorna à pagina de login para poder realizar a autenticação dentro da plataforma
      } catch (err) {
        helpers.setStatus({ success: false })
        helpers.setErrors({ submit: err.message })
        helpers.setSubmitting(false)
      }
    }
  })

  return (
    <>
      <Head>
        <title>criar conta | meumei</title>
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
            <Typography variant='h5' sx={{ py: 4 }}>
              você vai se juntar ao time? ;)
            </Typography>

            <form noValidate onSubmit={formik.handleSubmit}>
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
                <TextField
                  error={!!(formik.touched.name && formik.errors.name)}
                  fullWidth
                  helperText={formik.touched.name && formik.errors.name}
                  label='Nome'
                  name='name'
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
              </Stack>
              {formik.errors.submit && (
                <Typography color='error' sx={{ mt: 3 }} variant='body2'>
                  {formik.errors.submit}
                </Typography>
              )}
              <Button
                disabled={
                  !formik.values.cnpj ||
                  formik.values.cnpj.length < 18 ||
                  !formik.values.email ||
                  !formik.values.name ||
                  !formik.values.password ||
                  !formik.values.confirmPassword ||
                  formik.values.password !== formik.values.confirmPassword
                }
                fullWidth
                size='large'
                sx={{ mt: 3 }}
                type='submit'
                variant='contained'
              >
                Avançar
              </Button>
            </form>
            <Box
              sx={{
                marginTop: '16px',
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'flex-end'
              }}
            >
              <Link component={NextLink} href='/auth/login' underline='hover' variant='subtitle2'>
                já tenho conta, quero fazer login
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
