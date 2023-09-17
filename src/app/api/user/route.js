import { clerkClient, currentUser } from '@clerk/nextjs'
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient({})

export async function GET (_req) {
  try {
    const { id: clerkUserId } = await currentUser()

    const foundUser = await prisma.user.findFirstOrThrow({ where: { clerkUserId, deletedAt: null } })

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
    const { id: clerkUserId } = await currentUser()

    const userBody = await req.json()
    let createdUser

    const foundUser = await prisma.user.findFirst({
      where: {
        foundUser: userBody.foundUser
      }
    })

    if (foundUser) {
      if (foundUser.deletedAt !== null) {
        createdUser = await prisma.user.update({
          where: {
            id: foundUser.id
          },
          data: {
            deletedAt: null,
            ...userBody
          }
        })
      } else {
        throw new Error('User already exists')
      }
    } else {
      createdUser = await prisma.user.create({
        data: userBody
      })
    }

    await clerkClient.users.updateUserMetadata(clerkUserId, {
      publicMetadata: {
        userId: createdUser.id
      }
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
