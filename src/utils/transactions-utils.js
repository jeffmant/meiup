export async function createTransaction (transactionBody, accessToken) {
  try {
    const fetchResponse = await fetch('/api/transaction', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(transactionBody)
    })
    const parsedResponse = await fetchResponse.json()

    return parsedResponse
  } catch (error) {
    console.log('Erro ao realizar fetchPost: ', error)
    throw new Error(error)
  }
}

export async function getAllTransactions (accessToken, type, month, year) {
  try {
    const { data: transactions } = await fetch(`/api/transaction/?type=${type}&month=${month}&year=${year}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then((response) => response.json())

    return transactions
  } catch (error) {
    console.log('Erro ao realizar fetchGet: ', error)
    throw new Error(error)
  }
}

export async function deleteTransaction (transactionId, accessToken) {
  try {
    const deleteResponse = await fetch(`/api/transaction/?id=${transactionId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    const parsedResponse = await deleteResponse.json()
    return parsedResponse
  } catch (error) {
    console.log('Erro ao realizar fetchDelete: ', error)
    throw new Error(error)
  }
}

export async function updateTransaction (transactionId, transactionBody, accessToken) {
  try {
    const updateResponse = await fetch(`/api/transaction/?id=${transactionId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(transactionBody)
    })

    const parsedResponse = await updateResponse.json()
    return parsedResponse
  } catch (error) {
    console.log('Erro ao realizar fetchUpdate: ', error)
    throw new Error(error)
  }
}
