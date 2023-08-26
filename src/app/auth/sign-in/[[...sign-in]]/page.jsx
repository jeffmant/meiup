'use client'
import { SignIn } from '@clerk/nextjs'
import { AuthContainer } from '../../auth.styles'

export default function Page () {
  return <AuthContainer><SignIn /></AuthContainer>
}
