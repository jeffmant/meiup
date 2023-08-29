import { currentUser } from '@clerk/nextjs'
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

export async function GET (_req) {
  try {
    const { id: clerkUserId } = await currentUser()

    const prisma = new PrismaClient()

    const foundUser = await prisma.user.findFirstOrThrow({ where: { clerkUserId } })

    return NextResponse.json({
      data: foundUser
    }, {
      status: 200
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json({
      error: error.message || 'Internal Server Error'
    }, {
      status: 500
    })
  }
}

export async function POST (req) {
  try {
    const userBody = await req.json()

    const prisma = new PrismaClient()

    const foundUser = await prisma.user.findFirst({
      where: {
        foundUser: userBody.foundUser
      }
    })

    if (foundUser) {
      throw new Error('User already exists')
    }

    const createdUser = await prisma.user.create({
      data: userBody
    })

    return NextResponse.json({
      data: createdUser
    }, {
      status: 201
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json({
      error: error.message || 'Internal Server Error'
    }, {
      status: 500
    })
  }
}
