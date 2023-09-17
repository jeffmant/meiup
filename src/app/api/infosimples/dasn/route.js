import { currentUser } from '@clerk/nextjs'
import axios from 'axios'
import { NextResponse } from 'next/server'

export async function GET (req) {
  const {
    NEXT_PUBLIC_INFOSIMPLES_BASE_URL,
    NEXT_PUBLIC_INFOSIMPLES_TOKEN
  } = process.env

  const { publicMetadata: { userCompanies } } = await currentUser()

  const { searchParams } = new URL(req.url)

  const cnpj = searchParams.get('cnpj')

  try {
    const { data: { data } } = await axios.get(
      `${NEXT_PUBLIC_INFOSIMPLES_BASE_URL}/receita-federal/simples-dasn`, {
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          token: NEXT_PUBLIC_INFOSIMPLES_TOKEN,
          cnpj,
          origem: 'web'
        }
      })

    if (!data?.length) throw new Error('Documents not found')

    const { original: foundDocuments } = data[0]

    const documents = Object.entries(foundDocuments).map(document => ({
      year: document[0],
      status: document[1] === 'indisponivel'
    })).reverse()

    return NextResponse.json({
      data: documents.filter(document =>
        +document.year >= new Date(userCompanies?.[0]?.foundationDate).getFullYear()
      )
    }, {
      status: 200
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json({
      error: error.message || 'Internal Server Error'
    },
    { status: 500 })
  }
}
