import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Welcome 👋</h1>
      <p className="text-gray-600 dark:text-gray-300">
        This starter includes Next.js App Router, Prisma + Postgres, NextAuth (GitHub + credentials),
        TailwindCSS, Playwright, Vitest, and a tiny Bookings API.
      </p>
      <div className="card">
        <h2 className="font-semibold mb-2">Next steps</h2>
        <ol className="list-decimal ml-5 space-y-1">
          <li>Create your <code>.env</code></li>
          <li>Run <code>npx prisma migrate dev</code></li>
          <li><code>npm run dev</code> and visit <Link href="/dashboard" className="underline">Dashboard</Link></li>
        </ol>
      </div>
    </div>
  )
}
