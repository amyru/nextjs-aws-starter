'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const BookingSchema = z.object({
  start: z.string().min(1, 'Start is required'),
  end: z.string().min(1, 'End is required')
}).refine((val) => new Date(val.end) > new Date(val.start), {
  message: 'End must be after start',
  path: ['end']
})

type BookingFormValues = z.infer<typeof BookingSchema>

export default function BookingForm({ onCreated }: { onCreated: () => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } =
    useForm<BookingFormValues>({
      resolver: zodResolver(BookingSchema),
      defaultValues: {
        start: new Date().toISOString().slice(0,16),
        end: new Date(Date.now() + 60*60*1000).toISOString().slice(0,16),
      },
    })

  const [ok, setOk] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])


  const onSubmit = async (data: BookingFormValues) => {
    setOk(false); setErr(null)
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        startDate: new Date(data.start).toISOString(),
        endDate: new Date(data.end).toISOString(),
      }),
    })
    if (!res.ok) {
      const msg = (await res.json().catch(() => ({} as any)))?.error ?? 'Request failed'
      throw new Error(msg)
    }
    setOk(true)
    setTimeout(() => setOk(false), 3000) // keep visible for tests
    reset()
    onCreated()
  }

  // 👇 explicitly prevent default, and ensure type="submit"
  const onSubmitHandler: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    // call RHF submit
    void handleSubmit(async (values) => {
      try { await onSubmit(values) } catch (e:any) { setErr(e.message) }
    })(e)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card space-y-3" data-testid="booking-form" data-ready={ready ? '1' : '0'}>
      <div className="text-sm font-semibold">Create a booking</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-500">Start (local)</span>
          <input type="datetime-local" className="border rounded-lg px-3 py-2 bg-white dark:bg-gray-900" {...register('start')} />
          {errors.start && <span className="text-xs text-red-600">{errors.start.message}</span>}
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-500">End (local)</span>
          <input type="datetime-local" className="border rounded-lg px-3 py-2 bg-white dark:bg-gray-900" {...register('end')} />
          {errors.end && <span className="text-xs text-red-600">{errors.end.message}</span>}
        </label>
      </div>
      <div className="flex items-center gap-2">
        <button className="btn" disabled={isSubmitting} data-testid="booking-submit">
          {isSubmitting ? 'Creating…' : 'Create booking'}
        </button>
        {ok && <span className="text-green-700 text-sm" data-testid="saved-flag">Saved.</span>}
        {err && <span className="text-red-600 text-sm">{err}</span>}
      </div>
      <p className="text-xs text-gray-500">Note: Requires you to be signed in.</p>
    </form>
  )
}
