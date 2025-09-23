import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './db'
import type { NextAuthOptions } from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Credentials from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: 'jwt' },
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null
        const user = await prisma.user.findUnique({ where: { email: credentials.email } })
        if (!user || !user.password) return null
        const ok = await compare(credentials.password, user.password)
        return ok ? { id: user.id, email: user.email, name: user.name || null } : null
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token && session.user) (session.user as any).id = token.sub
      return session
    },
  },
}
