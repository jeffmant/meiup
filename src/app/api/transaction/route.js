import { currentUser } from '@clerk/nextjs'
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET (req) {
  const { id: clerkUserId } = await currentUser()
  const { searchParams } = new URL(req.url)
  const transactionType = searchParams.get('type')
  const transactionMonth = searchParams.get('month')
  const transactionYear = searchParams.get('year')

  const startDate = new Date(transactionYear, transactionMonth, 1)
  const endDate = new Date(transactionYear, transactionMonth, 0)

  try {
    const foundUser = await prisma.user.findFirstOrThrow({ where: { clerkUserId, deletedAt: null } })

    const userSocieties = await prisma.userSociety.findMany({ where: { userId: foundUser.id, deletedAt: null } })

    const userCompanies = await prisma.company.findMany({
      where: { societyId: { in: userSocieties.map((userSociety) => userSociety.societyId) }, deletedAt: null }
    })

    const transactionQuery = { where: { companyId: { in: userCompanies.map((userCompany) => userCompany.id) }, dueDate: { gte: startDate, lte: endDate }, deletedAt: null } }

    if (transactionType !== 'all') {
      transactionQuery.where.type = transactionType
    };

    const transactions = await prisma.transaction.findMany(transactionQuery)

    return NextResponse.json({ data: transactions }, { status: 200 })
  } catch (error) {
    console.log('Erro ao buscar transactions: ', error)
    return NextResponse.json({ error: 'Erro ao buscar transactions: ' }, { status: 500 })
  }
}

export async function POST (req) {
  const { id: clerkUserId } = await currentUser()

  const transactionBody = await req.json()

  try {
    const foundUser = await prisma.user.findFirstOrThrow({ where: { clerkUserId, deletedAt: null } })

    const userSocieties = await prisma.userSociety.findMany({ where: { userId: foundUser.id, deletedAt: null } })

    const userCompanies = await prisma.company.findMany({
      where: { societyId: { in: userSocieties.map((userSociety) => userSociety.societyId) }, deletedAt: null }
    })

    await prisma.transaction.create({
      data: {
        ...transactionBody,
        dueDate: new Date(transactionBody.dueDate),
        companyId: userCompanies?.[0]?.id
      }
    })
    return NextResponse.json({ data: 'Transaction created' }, { status: 201 })
  } catch (CreateError) {
    console.log('Erro ao criar transação: ', CreateError)
    return NextResponse.json({ error: 'Erro ao criar transação: ', CreateError }, { status: 500 })
  }
}

export async function DELETE (req) {
  const url = new URL(req.url)
  const transactionId = url.searchParams.get('id')

  try {
    await prisma.transaction.update({
      where: {
        id: transactionId
      },
      data: {
        deletedAt: new Date()
      }
    })

    return NextResponse.json({ status: 200 })
  } catch (error) {
    console.log('Erro ao deletar transaction: ', error)

    return NextResponse.json({ error: 'Erro ao deletar transaction: ' }, { status: 500 })
  }
}
