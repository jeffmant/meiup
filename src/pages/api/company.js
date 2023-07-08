import axios from 'axios'

export const getExternalCompanyInfoByCNPJ = async ({ cnpj }) => {
  try {
    const { data: company } = await axios.get(`/api/cnpj/${cnpj}`, {
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
