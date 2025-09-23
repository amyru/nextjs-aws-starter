import { prisma } from '@/lib/db'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'

const BookingSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
})

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json([], { status: 200 })
  const bookings = await prisma.booking.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } })
  return NextResponse.json(bookings)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = BookingSchema.parse(await req.json())
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  const booking = await prisma.booking.create({ data: { userId: user.id, ...body, status: 'held' } })
  return NextResponse.json(booking, { status: 201 })
}
