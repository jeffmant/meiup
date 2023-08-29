import { NextResponse } from 'next/server'

const getMockedCompanyData = async (cnpj) => {
  return new Promise((resolve) => resolve(cnpj === '36255676000173'
    ? {
        data: [
          {
            normalizado_cnpj: '36255676000173',
            razao_social: 'BOAZ Tecnologias LTDA.',
            nome_fantasia: 'BOAZ Tecnologias',
            situacao_cadastral: 'ATIVA',
            email: 'jgsmantovani@gmail.com',
            telefone: '11936187180',
            abertura_data: '05/02/2020',
            normalizado_endereco_cep: '87309086',
            endereco_logradouro: 'Rua Geremias Araujo',
            endereco_numero: '241',
            endereco_municipio: 'Campo Mourão',
            endereco_uf: 'PR',
            endereco_bairro: 'Jardim Albuquerque'
          }
        ]
      }
    : { data: [] }))
}

export async function GET (req) {
  // const {
  //   NEXT_PUBLIC_INFOSIMPLES_BASE_URL,
  //   NEXT_PUBLIC_INFOSIMPLES_TOKEN
  // } = process.env

  const { searchParams } = new URL(req.url)

  const cnpj = searchParams.get('cnpj')

  try {
    // const { data: { data } } = await fetch(
    //   `${NEXT_PUBLIC_INFOSIMPLES_BASE_URL}/receita-federal/cnpj/?
    //     token=${NEXT_PUBLIC_INFOSIMPLES_TOKEN},
    //     cnpj=${cnpj}
    //     origem=web
    //   `, {
    //     headers: {
    //       'Content-Type': 'application/json'
    //     }
    //   })

    // getting mocked company data while infosimples api isn't working
    const { data } = await getMockedCompanyData(cnpj)

    if (!data?.length) throw new Error('Company not found')

    const foundCnpj = data[0]

    const company = {
      document: foundCnpj.normalizado_cnpj,
      name: foundCnpj.razao_social,
      fantasyName: foundCnpj.nome_fantasia,
      status: foundCnpj.situacao_cadastral === 'ATIVA',
      email: foundCnpj.email,
      phone: foundCnpj.telefone,
      foundationDate: new Date(foundCnpj.abertura_data),
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
