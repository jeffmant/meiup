import axios from 'axios'
import { NextResponse } from 'next/server'

export async function GET (req) {
  const {
    NEXT_PUBLIC_INFOSIMPLES_BASE_URL,
    NEXT_PUBLIC_INFOSIMPLES_TOKEN
  } = process.env

  const { searchParams } = new URL(req.url)

  const cnpj = searchParams.get('cnpj')
  const year = searchParams.get('year') || new Date().getFullYear().toString()

  let periodsParams = ''

  for (let month = 1; month < 13; month++) {
    periodsParams = `${periodsParams} ${year}${month < 10 ? '0' + month : month}`
  }

  try {
    const { data: { data } } = await axios.get(
      `${NEXT_PUBLIC_INFOSIMPLES_BASE_URL}/receita-federal/simples-das`, {
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          token: NEXT_PUBLIC_INFOSIMPLES_TOKEN,
          cnpj,
          periodos: periodsParams.trimStart(),
          origem: 'web'
        }
      })

    if (!data?.length) throw new Error('Documents not found')

    const { periodos: foundDocuments } = data[0]

    const documents = Object.values(foundDocuments).map(period => ({
      code: period.codigo_barras_das,
      url: period.url_das,
      status: !!period.data_pagamento,
      fee: period.normalizado_juros,
      penalty: period.normalizado_multas,
      value: period.normalizado_valor_total_das,
      dueDate: period.data_vencimento,
      paymentDate: period.data_pagamento,
      month: period.periodo.split('/')[0],
      year: period.periodo.split('/')[1],
      type: 'das'
    })).reverse()

    return NextResponse.json({
      data: documents
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
