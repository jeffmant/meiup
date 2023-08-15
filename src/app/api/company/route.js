import { currentUser } from '@clerk/nextjs'
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

export async function POST (req) {
  const { id: clerkUserId } = await currentUser()

  const prisma = new PrismaClient()

  const foundUser = await prisma.user.findFirstOrThrow({ where: { clerkUserId } })

  const companyBody = await req.json()

  const societyAlreadyExists = await prisma.society.findFirst({ where: { AND: { userId: foundUser.id, companies: { some: { document: companyBody.document } } } } })

  if (societyAlreadyExists) {
    throw new Error('This society already exists')
  }

  const createdSociety = await prisma.society.create({
    data: {
      userId: foundUser.id
    }
  })

  await prisma.company.create({
    data: {
      ...companyBody,
      societyId: createdSociety.id
    }
  })

  return NextResponse.json({
    success: true,
    status: 201,
    message: 'Company created'
  })
}

export async function GET () {
  const { id: clerkUserId } = await currentUser()

  const prisma = new PrismaClient()

  const foundUser = await prisma.user.findFirstOrThrow({ where: { clerkUserId } })

  const userSocieties = await prisma.society.findMany({ where: { userId: foundUser.id }, include: { companies: true } })

  return NextResponse.json({
    success: true,
    status: 200,
    data: userSocieties
  })
}
