const express = require('express')
const next = require('next')
const cors = require('cors')
const bodyParser = require('body-parser')
const axios = require('axios').default

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare()
  .then(() => {
    const server = express()

    server.use(cors())

    server.use(bodyParser.urlencoded({ extended: false }))
    server.use(bodyParser.json())

    server.get('/api/cnpj/:cnpj', async (req, res) => {
      const {
        NEXT_PUBLIC_INFOSIMPLES_BASE_URL,
        NEXT_PUBLIC_INFOSIMPLES_TOKEN
      } = process.env
      const { cnpj } = req.params
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

        if (foundCnpj.natureza_juridica_codigo !== '2135') throw new Error('CNPJ não é MEI')

        res.status(200).json({
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
        })
      } catch (error) {
        console.error(error.message)
        res.status(error.statusCode || 500).json({
          error: error.message || 'Server Error'
        })
      }
    })

    server.get('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(3000, (err) => {
      if (err) throw err
      console.log('> Ready on http://localhost:3000')
    })
  })
  .catch((ex) => {
    console.error(ex.stack)
    process.exit(1)
  })
