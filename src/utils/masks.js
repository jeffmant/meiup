// 00.000.000/0001-00
export const cnpjMask = (value) => {
  return value
    .replace(/\D+/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')
}

export const removeMask = (value) => value.replace(/[^\d]+/g, '')

// 000.000.000-00
export const maskCPF = (value) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')
}

// (00) 00000-0000
export const maskPhone = (value) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1')
}

// 00000-000
export const maskCEP = (value) => {
  return value.replace(/\D/g, '').replace(/^(\d{5})(\d{3})+?$/, '$1-$2')
}

// 00/00/0000
export const maskDate = (value) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1')
}

export const formatCurrency = (value) => {
  // Remove todos os caracteres não numéricos
  const numericValue = value.replace(/[^\d]/g, '')

  // Divide o valor em partes (parte inteira e parte decimal)
  const integerPart = numericValue.slice(0, -2)
  const decimalPart = numericValue.slice(-2)

  // Adiciona separadores de milhares à parte inteira
  const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')

  // Formata o valor completo com o símbolo "R$" e os separadores
  const formattedValue = `${formattedIntegerPart},${decimalPart}`

  return formattedValue
}
