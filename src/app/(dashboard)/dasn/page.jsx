'use client'
import { useAuth, useUser } from '@clerk/nextjs'
import { useEffect } from 'react'

export default function DAS () {
  const { getToken } = useAuth()
  const { user } = useUser()

  const getDas = async () => {
    const accessToken = await getToken()
    const cnpj = user?.publicMetadata?.userCompanies?.[0]?.document
    const { data } = await fetch(`/api/infosimples/dasn/?cnpj=${cnpj}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    }).then(response => response.json())

    console.log('data -> ', data)
  }

  useEffect(() => {
    if (user) {
      getDas()
    }
  }, [user])

  return (
    <h1>DASN</h1>
  )
}
