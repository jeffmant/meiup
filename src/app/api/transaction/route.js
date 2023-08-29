import { currentUser } from '@clerk/nextjs'
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET () {
  const { id: clerkUserId } = await currentUser()
  const foundUser = await prisma.user.findFirstOrThrow({ where: { clerkUserId } })
  const { companyId } = foundUser
  try {
    const transactions = await prisma.transaction.findMany({ where: { companyId } })
    console.log('Transactions encontradas: ', transactions)
    return NextResponse.json(
      { data: transactions },
      { status: 200 }
    )
  } catch (error) {
    console.log('Erro ao buscar transactions: ', error)
    return NextResponse.json(
      { error: 'Erro ao buscar transactions: ' },
      { status: 500 }
    )
  };
};

export async function POST (req) {
  const { id: clerkUserId } = await currentUser()
  const foundUser = await prisma.user.findFirstOrThrow({ where: { clerkUserId } })
  const { companyId } = foundUser
  const transactionBody = await req.json()

  try {
    const createdTransaction = await prisma.transaction.create({
      data: {
        ...transactionBody,
        companyId
      }
    })

    console.log('Transação criada com sucesso: ', createdTransaction)
    return NextResponse.json(
      { data: 'Transaction created' },
      { status: 201 }
    )
  } catch (error) {
    console.log('Erro ao criar transação: ', error)
    return NextResponse(
      { error: 'Erro ao criar transação: ' },
      { status: 500 }
    )
  };
};

export async function DELETE (req) {
  const transactionBody = await req.json()

  try {
    await prisma.transaction.delete({
      where: {
        id: transactionBody.id
      }
    })
    console.log('Transaction deletada com sucesso!')

    return NextResponse(
      { status: 200 }
    )
  } catch (error) {
    console.log('Erro ao deletar transaction: ', error)

    return NextResponse(
      { error: 'Erro ao deletar transaction: ' },
      { status: 500 }
    )
  };
};

export async function PATCH (req) {
  const transactionData = await req.json()
  const { type, partyName, amount } = transactionData

  try {
    const updatedTransaction = await prisma.transaction.update({
      where: {
        id: transactionData.id
      },
      data: {
        type,
        partyName,
        amount
      }
    })

    console.log('Transação atualizada com sucesso!')
    console.log('Updated data: ', updatedTransaction)

    return NextResponse(
      { status: 200 }
    )
  } catch (error) {
    console.log('Houve um erro ao atualizar a transação: ', error)

    return NextResponse(
      { error: 'Erro ao deletar transaction: ' },
      { status: 500 }
    )
  };
};
