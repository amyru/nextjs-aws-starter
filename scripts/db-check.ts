/**
 * scripts/db-check.ts
 * Simple Prisma/RDS connectivity check for CI or local use.
 * Usage:
 *   DATABASE_URL=postgresql://... npm run db:check
 */
import { PrismaClient } from '@prisma/client'

async function main() {
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) {
    console.error('ERROR: DATABASE_URL is not set')
    process.exit(2)
  }

  const prisma = new PrismaClient()
  try {
    // 1) raw connectivity
    const ping = await prisma.$queryRaw<{ now: Date }[]>`SELECT NOW() as now`
    // 2) optional: check prisma migration table exists & show latest migration
    let latest = 'no _prisma_migrations table'
    try {
      const rows = await prisma.$queryRaw<{ name: string; finished_at: Date | null }[]>`
        SELECT migration_name as name, finished_at
        FROM "_prisma_migrations"
        ORDER BY finished_at DESC NULLS LAST, started_at DESC
        LIMIT 1
      `
      if (rows.length > 0) {
        latest = `${rows[0].name}${rows[0].finished_at ? ' (finished)' : ' (pending?)'}`
      }
    } catch (_) {
      // table may not exist yet (before first migrate)
    }

    console.log('✅ DB OK:', ping[0]?.now, '| latest migration:', latest)
    process.exit(0)
  } catch (err) {
    console.error('❌ DB ERROR:', err)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
