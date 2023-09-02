import { currentUser } from '@clerk/nextjs'
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET () {
  const { id: clerkUserId } = await currentUser()
  try {
    const foundUser = await prisma.user.findFirstOrThrow({ where: { clerkUserId, deletedAt: null } })

    const userSocieties = await prisma.userSociety.findMany({ where: { userId: foundUser.id, deletedAt: null } })

    const userCompanies = await prisma.company.findMany({
      where: { societyId: { in: userSocieties.map((userSociety) => userSociety.societyId) }, deletedAt: null }
    })

    const transactions = await prisma.transaction.findMany({
      where: { companyId: { in: userCompanies.map((userCompany) => userCompany.id) }, deletedAt: null }
    })

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
        value: +String(transactionBody.value).replace(',', ''),
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

export async function PATCH (req) {
  const url = new URL(req.url)
  const transactionId = url.searchParams.get('id')
  const transactionData = await req.json()
  const { type, partyName, value } = transactionData

  try {
    const updatedTransaction = await prisma.transaction.update({
      where: {
        id: transactionId,
        createdAt: null
      },
      data: {
        type,
        partyName,
        value
      }
    })

    return NextResponse.json({ status: 200 }, { data: updatedTransaction })
  } catch (error) {
    console.log('Houve um erro ao atualizar a transação: ', error)

    return NextResponse.json({ error: 'Erro ao deletar transaction: ' }, { status: 500 })
  }
}
