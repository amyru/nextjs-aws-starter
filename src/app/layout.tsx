import './globals.css'
import { ReactNode } from 'react'
import Link from 'next/link'

export const metadata = { title: 'Next.js AWS Starter', description: 'Auth + Prisma + Playwright' }

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b bg-white/60 dark:bg-gray-950/60 backdrop-blur">
          <div className="container flex items-center justify-between h-14">
            <Link href="/" className="font-semibold">Next.js AWS Starter</Link>
            <nav className="flex gap-4 text-sm">
              <Link href="/dashboard">Dashboard</Link>
              <a href="https://github.com" target="_blank">GitHub</a>
            </nav>
          </div>
        </header>
        <main className="container py-6">{children}</main>
      </body>
    </html>
  )
}
