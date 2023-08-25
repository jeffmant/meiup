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
      { message: error }
    )
  };
};
