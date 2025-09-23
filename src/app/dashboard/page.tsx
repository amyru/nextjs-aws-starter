'use client'

import { useEffect, useState } from 'react'

type Booking = { id: string; startDate: string; endDate: string; status: string }

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/bookings')
      .then(r => (r.ok ? r.json() : Promise.reject(r.statusText)))
      .then(setBookings)
      .catch(e => setErr(String(e)))
  }, [])

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <p className="text-sm text-gray-500">Your recent bookings (requires sign-in)</p>
      {err && <div className="text-red-600">Error: {err}</div>}
      <ul className="space-y-2">
        {bookings.map(b => (
          <li key={b.id} className="card">
            <div className="font-mono text-xs">{b.id}</div>
            <div>{new Date(b.startDate).toDateString()} → {new Date(b.endDate).toDateString()}</div>
            <div className="text-xs uppercase text-gray-500">{b.status}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
