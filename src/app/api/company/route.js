import { clerkClient, currentUser } from '@clerk/nextjs'
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient({})

export async function POST (req) {
  const { id: clerkUserId } = await currentUser()

  const companyBody = await req.json()

  const addressBody = companyBody.address
  delete companyBody.address

  try {
    await prisma.$transaction(async (tx) => {
      const foundUser = await tx.user.findFirstOrThrow({ where: { clerkUserId, deletedAt: null } })

      const userSocieties = await tx.userSociety.findMany({
        where: {
          userId: foundUser.id,
          deletedAt: null
        }
      })

      const userSocietiesIds = userSocieties.map(userSociety => userSociety.id)

      const societyAlreadyExists = await tx.society.findFirst({
        where: {
          company: { document: companyBody.document },
          userSocieties: { some: { id: { in: userSocietiesIds } } },
          deletedAt: null
        }
      })

      if (societyAlreadyExists) {
        throw new Error('This society already exists')
      }

      let createdCompany = await tx.company.create({
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

      createdCompany = await tx.company.update({ where: { id: createdCompany.id, deletedAt: null }, data: { societyId: createdSociety.id } })

      await tx.userSociety.create({
        data: {
          societyId: createdSociety.id,
          userId: foundUser.id
        }
      })

      await clerkClient.users.updateUserMetadata(clerkUserId, {
        publicMetadata: {
          userId: foundUser.id,
          userCompanies: [createdCompany.id]
        }
      })
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({
      error: error.message || 'Internal Server Error'
    },
    { status: 500 })
  }
}

export async function GET (req) {
  try {
    const { searchParams } = new URL(req.url)
    let params = { deletedAt: null }

    const userId = searchParams.get('userId')
    if (userId) params = { ...params, id: userId }
    const clerkUserId = searchParams.get('clerkUserId')
    if (clerkUserId) params = { ...params, clerkUserId }

    // TODO: add params to query

    const foundUser = await prisma.user.findFirstOrThrow({ where: params })

    const userSocieties = await prisma.userSociety.findMany({ where: { userId: foundUser.id, deletedAt: null } })

    const userSocietiesIds = userSocieties.map(userSociety => userSociety.societyId)

    const userCompanies = await prisma.company.findMany({ where: { societyId: { in: userSocietiesIds }, deletedAt: null } })

    return NextResponse.json({
      data: userCompanies
    }, {
      status: 200
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json({
      error: error.message || 'Internal Server Error'
    },
    { status: 500 })
  }
}
