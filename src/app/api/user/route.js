import { currentUser } from '@clerk/nextjs'
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

export async function POST (req) {
  const { id: clerkUserId } = await currentUser()
  const userBody = await req.json()

  const prisma = new PrismaClient()

  const foundUser = await prisma.user.findFirst({ where: { clerkUserId } })

  if (foundUser) {
    throw new Error('User already exists')
  }

  await prisma.user.create({
    data: {
      ...userBody,
      clerkUserId
    }
  })

  return NextResponse.json({
    success: true,
    status: 201
  })
}
