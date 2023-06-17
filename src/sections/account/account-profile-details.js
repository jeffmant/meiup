import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid,
  CircularProgress
} from '@mui/material'
import { useAuth } from 'src/hooks/use-auth'
import { cnpjMask, maskCPF, maskPhone, removeMask } from 'src/utils/masks'
import { useFormik } from 'formik'
import { useState } from 'react'

export const AccountProfileDetails = () => {
  const { user, updateUserProfile } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      fantasyName: user?.company?.fantasyName,
      cnpj: user?.company?.cnpj,
      cpf: user?.company?.cpf,
      email: user?.email,
      phone: user?.company?.phone
    },
    onSubmit: async (values) => {
      setIsLoading(true)
      try {
        await updateUserProfile({
          companyId: user.company.id,
          companyData: {
            cpf: removeMask(values.cpf || ''),
            phone: removeMask(values.phone || '')
          }
        })
        console.log('Informações de cadastro atualizadas com sucesso!')
      } catch (error) {
        console.log('Houve um erro ao atualizar o cadastro:', error)
      } finally {
        setIsLoading(false)
      }
    }
  })

  return (
    <form
      autoComplete='off'
      noValidate
      onSubmit={formik.handleSubmit}
    >
      <Card>
        <CardHeader
          subheader='mantenha seu perfil atualizado ;)'
          title='perfil'
        />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid
              container
              spacing={3}
            >
              {/* Company Info */}
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label='nome fantasia'
                  name='fantasyName'
                  onChange={formik.handleChange}
                  disabled
                  value={formik.values.fantasyName}
                  error={formik.touched.fantasyName && formik.errors.fantasyName}
                  helperText={formik.touched.fantasyName && formik.errors.fantasyName}
                  readOnly
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  error={!!(formik.touched.cnpj && formik.errors.cnpj)}
                  fullWidth
                  helperText={formik.touched.cnpj && formik.errors.cnpj}
                  label='cnpj'
                  name='cnpj'
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  disabled
                  value={cnpjMask(formik.values.cnpj || '')}
                  readOnly
                />
              </Grid>

              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  type='email'
                  fullWidth
                  label='email'
                  name='email'
                  onChange={formik.handleChange}
                  required
                  disabled
                  value={formik.values.email}
                  error={formik.touched.email && formik.errors.email}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>

              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label='cpf'
                  name='cpf'
                  onChange={formik.handleChange}
                  value={maskCPF(formik.values.cpf || '')}
                  error={formik.touched.cpf && formik.errors.cpf}
                  helperText={formik.touched.cpf && formik.errors.cpf}
                />
              </Grid>

              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label='celular'
                  name='phone'
                  onChange={formik.handleChange}
                  value={maskPhone(formik.values.phone || '')}
                  error={formik.touched.phone && formik.errors.phone}
                  helperText={formik.touched.phone && formik.errors.phone}
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button
            variant='contained'
            type='submit'
            disabled={isLoading}
          >
            {
              isLoading ? <CircularProgress /> : 'salvar'
            }
          </Button>
        </CardActions>
      </Card>
    </form>
  )
}
