import axios from 'axios'

export default async function GET (req, res) {
  const {
    NEXT_PUBLIC_INFOSIMPLES_BASE_URL,
    NEXT_PUBLIC_INFOSIMPLES_TOKEN
  } = process.env

  const { cnpj } = req.query

  try {
    const { data: { data } } = await axios.get(`${NEXT_PUBLIC_INFOSIMPLES_BASE_URL}/receita-federal/cnpj`, {
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        token: NEXT_PUBLIC_INFOSIMPLES_TOKEN,
        cnpj,
        origem: 'web'
      }
    })

    if (!data?.length) throw new Error()

    const foundCnpj = data[0]

    if (foundCnpj.natureza_juridica_codigo !== '2135') throw new Error('Este CNPJ não é MEI')

    const company = {
      cnpj: foundCnpj.normalizado_cnpj,
      companyName: foundCnpj.razao_social,
      fantasyName: foundCnpj.nome_fantasia,
      status: foundCnpj.situacao_cadastral === 'ATIVA',
      email: foundCnpj.email,
      phone: foundCnpj.telefone,
      foundationDate: foundCnpj.abertura_data,
      address: {
        cep: foundCnpj.normalizado_endereco_cep,
        street: foundCnpj.endereco_logradouro,
        number: foundCnpj.endereco_numero,
        city: foundCnpj.endereco_municipio,
        state: foundCnpj.endereco_uf,
        block: foundCnpj.endereco_bairro
      }
    }

    res.status(200).json({
      success: true,
      data: company
    })
  } catch (error) {
    console.error(error.message)
    res.status(error.statusCode || 500).json({
      error: error.message || 'Server Error'
    })
  }
}
