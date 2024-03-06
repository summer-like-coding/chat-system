import { prisma } from '@/lib/db'

async function main() {
  // await prisma.user.create({
  //   data: {
  //     username: 'alex',
  //     password: 'password',
  //   }
  // })
  // const users = await prisma.user.findMany()
  // console.log(users)
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
