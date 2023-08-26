'use client'
import { SignUp } from '@clerk/nextjs'
import { AuthContainer } from '../../auth.styles'

export default function Page () {
  return <AuthContainer><SignUp /></AuthContainer>
}
