'use client'
import { useAuth, useUser } from '@clerk/nextjs'
import { useEffect } from 'react'

export default function DAS () {
  console.log('DAS Server Component Page')
  const { getToken } = useAuth()
  const { user } = useUser()

  const getDas = async () => {
    const accessToken = await getToken()
    if (user) {
      const cnpj = user?.publicMetadata?.userCompanies?.[0]
      const { data } = await fetch(`/api/infosimples/das/?cnpj=${cnpj}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      }).then(response => response.json())

      console.log('data -> ', data)
    }
  }

  useEffect(() => {
    if (user) {
      getDas()
    }
  }, [user])

  return (
    <h1>DAS</h1>
  )
}
