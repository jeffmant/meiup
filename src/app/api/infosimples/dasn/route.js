import axios from 'axios'
import { NextResponse } from 'next/server'

export async function GET (req) {
  console.log('GET DASN')
  const {
    NEXT_PUBLIC_INFOSIMPLES_BASE_URL,
    NEXT_PUBLIC_INFOSIMPLES_TOKEN
  } = process.env

  const { searchParams } = new URL(req.url)

  const cnpj = searchParams.get('cnpj')

  console.log('cnpj ->', cnpj)

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

    console.log('data ->', data)

    return NextResponse.json({
      data
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
