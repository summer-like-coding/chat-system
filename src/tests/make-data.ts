import { prisma } from '@/lib/db'

async function main() {
  await prisma.user.create({
    data: {
      password: 'password',
      username: 'alex',
    },
  })
  const users = await prisma.user.findMany()
  console.warn(users)
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
