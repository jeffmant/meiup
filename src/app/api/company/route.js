import { currentUser } from '@clerk/nextjs'
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

export async function POST (req) {
  const { id: clerkUserId } = await currentUser()

  const companyBody = await req.json()

  const addressBody = companyBody.address
  delete companyBody.address

  const prisma = new PrismaClient()

  await prisma.$transaction(async (tx) => {
    const foundUser = await tx.user.findFirstOrThrow({ where: { clerkUserId } })

    const userSocieties = await tx.userSociety.findMany({
      where: {
        userId: foundUser.id
      }
    })

    const userSocietiesIds = userSocieties.map(userSociety => userSociety.id)

    const societyAlreadyExists = await tx.society.findFirst({
      where: {
        AND: {
          company: { document: companyBody.document },
          userSocieties: { some: { id: { in: userSocietiesIds } } }
        }
      }
    })

    if (societyAlreadyExists) {
      throw new Error('This society already exists')
    }

    const createdCompany = await tx.company.create({
      data: companyBody
    })

    await tx.address.create({
      data: {
        ...addressBody,
        companyId: createdCompany.id
      }
    })

    const createdSociety = await tx.society.create({
      data: { companyId: createdCompany.id }
    })

    await tx.company.update({ where: { id: createdCompany.id }, data: { societyId: createdSociety.id } })

    await tx.userSociety.create({
      data: {
        societyId: createdSociety.id,
        userId: foundUser.id
      }
    })
  })

  return NextResponse.json({
    success: true,
    status: 201,
    message: 'Company created'
  })
}

export async function GET (req) {
  try {
    const { searchParams } = new URL(req.url)

    const userId = searchParams.get('userId')

    // TODO: add params to query

    const prisma = new PrismaClient()

    const foundUser = await prisma.user.findFirstOrThrow({ where: { id: userId } })

    const userSocieties = await prisma.userSociety.findMany({ where: { userId: foundUser.id } })

    const userSocietiesIds = userSocieties.map(userSociety => userSociety.societyId)

    const userCompanies = await prisma.company.findMany({ where: { societyId: { in: userSocietiesIds } } })

    return NextResponse.json({
      data: userCompanies
    }, {
      status: 200
    })
  } catch (error) {
    return NextResponse.json({
      error: error.message || 'Internal Server Error'
    }, {
      status: error.statusCode || 500
    })
  }
}
