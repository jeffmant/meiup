import React from 'react'
import NumberFormat from 'react-number-format'

export default function RealFormat (props) {
  const { inputRef, onChange, ...other } = props

  function formatCurrency (value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            value: values.value
          }
        })
      }}
      thousandSeparator='.'
      decimalSeparator=','
      prefix='R$'
      decimalScale={2}
      fixedDecimalScale
      isNumericString
      renderText={(value) => formatCurrency(value)}
    />
  )
};
