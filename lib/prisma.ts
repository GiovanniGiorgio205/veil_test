import { PrismaClient } from '@prisma/client'

// Best practice: Create a single PrismaClient instance and reuse it
// This prevents connection pool exhaustion [^2]
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
