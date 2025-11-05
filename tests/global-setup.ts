// tests/global-setup.ts
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

export default async function globalSetup() {
  const prisma = new PrismaClient()
  try {
    const email = process.env.E2E_EMAIL || 'demo@example.com'
    const password = process.env.E2E_PASSWORD || 'demo1234'
    const hashed = await hash(password, 10)
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, name: 'E2E User', password: hashed },
    })
  } finally {
    await prisma.$disconnect()
  }
}
