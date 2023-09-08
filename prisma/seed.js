const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
async function main () {
  await prisma.$transaction(async tx => {
    console.log('Starting Seed...')
    const createdUser = await tx.user.create({
      data: {
        clerkUserId: 'user_2TXBTEJfdw7ys6C2LCvo0Zwtkee',
        email: 'jgsmantovani@gmail.com',
        firstName: 'Jefferson',
        lastName: 'Mantovani'
      }
    })

    console.log('User created -> ', createdUser.id)

    const createdCompany = await tx.company.create({
      data: {
        document: '36255676000173',
        name: 'BOAZ Tecnologias LTDA',
        fantasyName: 'BOAZ Tecnologias',
        type: 'me',
        status: true
      }
    })

    console.log('Company created -> ', createdCompany.id)

    const createdSociety = await tx.society.create({
      data: { companyId: createdCompany.id }
    })

    console.log('Society created -> ', createdSociety.id)

    await tx.company.update({ where: { id: createdCompany.id, deletedAt: null }, data: { societyId: createdSociety.id } })

    console.log('Company updated with society')

    const createdUserSociety = await tx.userSociety.create({
      data: {
        societyId: createdSociety.id,
        userId: createdUser.id
      }
    })

    console.log('User Society created -> ', createdUserSociety.id)
  })
}
main()
  .then(async () => {
    console.log('Successed Seed!')
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.log('Failed Seed', e.message)
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
