import { PrismaClient } from '@prisma/client'

export default async function POST (req, res) {
  try {
    const prisma = new PrismaClient()

    const companyBody = JSON.parse(JSON.stringify(req.body))

    if (!companyBody.userId | !companyBody.document) {
      throw new Error('User id and company document are required to create a company')
    }

    await prisma.society.findFirstOrThrow({ where: { AND: { userId: companyBody.userId, companies: { some: companyBody.document } } } })

    const createdSociety = await prisma.society.create({
      data: {
        userId: companyBody.userId
      }
    })

    const createdCompany = await prisma.company.create({
      data: {
        ...companyBody,
        societyId: createdSociety.id
      }
    })

    await prisma.society.update({ where: { id: createdSociety.id }, data: { companies: [createdCompany.id] } })

    return res.status(201).json({ success: true })
  } catch (error) {
    console.error(error.message)
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}
