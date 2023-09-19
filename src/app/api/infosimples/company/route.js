import axios from 'axios'
import { NextResponse } from 'next/server'

export async function GET (req) {
  const {
    NEXT_PUBLIC_INFOSIMPLES_BASE_URL,
    NEXT_PUBLIC_INFOSIMPLES_TOKEN
  } = process.env

  const { searchParams } = new URL(req.url)

  const cnpj = searchParams.get('cnpj')

  try {
    const { data: { data } } = await axios.get(
      `${NEXT_PUBLIC_INFOSIMPLES_BASE_URL}/receita-federal/cnpj`, {
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          token: NEXT_PUBLIC_INFOSIMPLES_TOKEN,
          cnpj,
          origem: 'web'
        }
      })

    if (!data?.length) throw new Error('Empresa não encontrada')

    const foundCnpj = data[0]

    if (foundCnpj.natureza_juridica_codigo !== '2135') throw new Error('Empresa não é MEI')

    const company = {
      document: foundCnpj.normalizado_cnpj,
      name: foundCnpj.razao_social,
      type: 'mei',
      fantasyName: foundCnpj.nome_fantasia,
      status: foundCnpj.situacao_cadastral === 'ATIVA',
      email: foundCnpj.email,
      phone: foundCnpj.telefone,
      foundationDate: new Date(`
        ${foundCnpj.abertura_data.split('/')[2]}-
        ${foundCnpj.abertura_data.split('/')[1]}-
        ${foundCnpj.abertura_data.split('/')[0]}
      `),
      address: {
        zipcode: foundCnpj.normalizado_endereco_cep,
        street: foundCnpj.endereco_logradouro,
        number: +foundCnpj.endereco_numero,
        city: foundCnpj.endereco_municipio,
        state: foundCnpj.endereco_uf,
        block: foundCnpj.endereco_bairro,
        country: 'Brazil'
      }
    }

    return NextResponse.json({
      data: company
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
