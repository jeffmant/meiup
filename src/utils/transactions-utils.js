import Cookies from 'js-cookie'

const token = Cookies.get('_session')

export async function createTransaction (values) {
  try {
    const fetchResponse = await fetch('/api/transaction', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(values)
    })
    const parsedResponse = await fetchResponse.json()

    return parsedResponse
  } catch (error) {
    console.log('Erro ao realizar fetchPost: ', error)
    throw new Error(error)
  }
};

export async function getAllTransactions () {
  try {
    const fetchResponse = await fetch('/api/transaction', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const transactions = await fetchResponse.json()

    return transactions
  } catch (error) {
    console.log('Erro ao realizar fetchGet: ', error)
    throw new Error(error)
  }
}

export async function deleteTransaction (transaction) {
  try {
    const deleteResponse = await fetch('/api/transaction', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(transaction)
    })

    const parsedResponse = await deleteResponse.json()
    return parsedResponse
  } catch (error) {
    console.log('Erro ao realizar fetchDelete: ', error)
    throw new Error(error)
  };
};

export async function updateTransaction (values) {
  try {
    const updateResponse = await fetch('/api/transaction', {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(values)
    })

    const parsedResponse = await updateResponse.json()
    return parsedResponse
  } catch (error) {
    console.log('Erro ao realizar fetchUpdate: ', error)
    throw new Error(error)
  };
}
