import { prisma } from '../src/lib/db'
import { hash } from 'bcryptjs'

async function main() {
  const email = 'demo@example.com'
  const password = await hash('demo1234', 10)
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name: 'Demo User', password },
  })
  console.log('Seeded user:', email, 'password: demo1234')
}
main().then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(1)})
