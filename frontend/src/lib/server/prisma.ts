import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

const pClient = globalForPrisma.prisma ?? prismaClientSingleton()

export default pClient

if (process.env.NODE_ENV !== 'PROD') globalForPrisma.prisma = pClient