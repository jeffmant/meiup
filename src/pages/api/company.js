import axios from 'axios'

export const getCompanyInfoByCNPJ = async ({ cnpj }) => {
  try {
    const { data: company } = await axios.get(`http://localhost:3000/api/cnpj/${cnpj}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return {
      success: true,
      data: company
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      error: {
        statusCode: error?.response?.status || 500,
        message: error?.response?.data?.error || 'Server Error'
      }
    }
  }
}
