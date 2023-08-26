import { currentUser } from '@clerk/nextjs'
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const { id: clerkUserId } = await currentUser()
const prisma = new PrismaClient()
const foundUser = await prisma.user.findFirstOrThrow({ where: { clerkUserId } })
const { companyId } = foundUser

export async function GET () {
  try {
    const transactions = await prisma.transaction.findMany({ where: { companyId } })
    console.log('Transactions encontradas: ', transactions)
    return NextResponse.json(
      { status: 200 },
      { success: true },
      { data: transactions }
    )
  } catch (error) {
    console.log('Erro ao buscar transactions: ', error)
    return NextResponse.json(
      { status: 500 },
      { success: false },
      { message: error }
    )
  };
};

export async function POST (req) {
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
      { status: 201 },
      { success: true },
      { message: 'Transaction created' }
    )
  } catch (error) {
    console.log('Erro ao criar transação: ', error)
    return NextResponse(
      { status: 500 },
      { success: false },
      { message: 'Erro ao criar transação: ', error }
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
      { status: 200 },
      { success: true }
    )
  } catch (error) {
    console.log('Erro ao deletar transaction: ', error)

    return NextResponse(
      { status: 500 },
      { success: false },
      { message: 'Erro ao deletar transaction: ', error }
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
      { status: 200 },
      { success: true }
    )
  } catch (error) {
    console.log('Houve um erro ao atualizar a transação: ', error)

    return NextResponse(
      { status: 500 },
      { success: false },
      { message: 'Erro ao deletar transaction: ', error }
    )
  };
};
