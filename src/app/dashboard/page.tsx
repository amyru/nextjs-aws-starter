'use client'

import { useEffect, useState } from 'react'
import BookingForm from '@/components/BookingForm'

type Booking = { id: string; startDate: string; endDate: string; status: string }

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true); setError(null)
    try {
      const res = await fetch('/api/bookings', { cache: 'no-store' })
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
      const data: Booking[] = await res.json()
      setBookings(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <BookingForm onCreated={load} />

      <div className="space-y-2">
        <div className="text-sm font-semibold">Recent bookings</div>
        {loading && <div>Loading…</div>}
        {error && <div className="text-red-600">Error: {error}</div>}
        {!loading && bookings.length === 0 && <div className="text-gray-500">No bookings yet.</div>}
        <ul className="grid gap-2">
          {bookings.map(b => (
            <li key={b.id} className="card flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-sm">{new Date(b.startDate).toLocaleString()} → {new Date(b.endDate).toLocaleString()}</div>
                <div className="text-xs uppercase text-gray-500">Status: {b.status}</div>
              </div>
              <code className="text-xs">{b.id}</code>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
