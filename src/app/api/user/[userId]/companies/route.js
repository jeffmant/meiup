import { PrismaClient } from '@prisma/client'

export default async function GET (req, res) {
  console.log('GET')
  console.log('userId -> ', req.query)
  try {
    const { userId } = req.query
    const prisma = new PrismaClient()
    const userSocietyIds = (await prisma.society.findMany({ where: { userId } })).map(userSociety => userSociety.id)
    console.log('userSocietyIds -> ', userSocietyIds)
    const userCompanies = await prisma.company.findMany({ where: { societyId: { in: userSocietyIds } } })
    console.log('userCompanies -> ', userCompanies)
    return res.status(200).json({
      success: true,
      data: userCompanies
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}
