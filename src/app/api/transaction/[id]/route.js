import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient({})

export async function PATCH (req, { params: { id: transactionId } }) {
  const transactionData = await req.json()

  try {
    const updatedTransaction = await prisma.transaction.update({
      where: {
        id: transactionId,
        deletedAt: null
      },
      data: {
        ...transactionData,
        dueDate: new Date(transactionData.dueDate),
        updatedAt: new Date()
      }
    })

    return NextResponse.json({ status: 200 }, { data: updatedTransaction })
  } catch (error) {
    console.log('Houve um erro ao atualizar a transação: ', error)

    return NextResponse.json({ error: 'Erro ao deletar transaction: ' }, { status: 500 })
  }
}
