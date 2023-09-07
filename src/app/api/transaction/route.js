import { currentUser } from '@clerk/nextjs'
import { PrismaClient } from '@prisma/client'
import { endOfMonth, startOfMonth } from 'date-fns'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET (req, params) {
  const { id: clerkUserId } = await currentUser()

  const { searchParams } = new URL(req.url)

  const page = +searchParams.get('page') || 1
  const limit = +searchParams.get('limit') || 10

  const paginationQuery = { skip: (page - 1) * limit, take: limit, orderBy: { dueDate: 'desc' } }

  const transactionQuery = { where: { deletedAt: null } }

  const transactionType = searchParams.get('type')

  if (transactionType && transactionType !== 'all') {
    transactionQuery.where.type = transactionType
  };

  const transactionMonth = +searchParams.get('month') || new Date().getMonth()
  const transactionYear = +searchParams.get('year') || new Date().getFullYear()

  const startDate = startOfMonth(new Date(transactionYear, transactionMonth))
  const endDate = endOfMonth(new Date(transactionYear, transactionMonth))

  transactionQuery.where.dueDate = {
    gte: startDate, lt: endDate
  }

  try {
    const foundUser = await prisma.user.findFirstOrThrow({ where: { clerkUserId, deletedAt: null } })

    const userSocieties = await prisma.userSociety.findMany({ where: { userId: foundUser.id, deletedAt: null } })

    const userCompanies = await prisma.company.findMany({
      where: { societyId: { in: userSocieties.map((userSociety) => userSociety.societyId) }, deletedAt: null }
    })

    transactionQuery.where.companyId = {
      in: userCompanies.map((userCompany) => userCompany.id)
    }

    const transactionsCount = await prisma.transaction.count(transactionQuery)

    const transactionsSummary = await prisma.transaction.groupBy({
      by: ['type', 'value']
    })

    let totalCosts = 0
    let totalRevenues = 0

    for (const transaction of transactionsSummary) {
      if (transaction.type === 'revenue') totalRevenues += transaction.value
      if (transaction.type === 'cost') totalCosts += transaction.value
    }

    const transactions = await prisma.transaction.findMany({ ...transactionQuery, ...paginationQuery })

    const totalPages = Math.floor(transactionsCount / limit)

    return NextResponse.json({ data: { totalPages, transactions, totalRevenues, totalCosts } }, { status: 200 })
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
