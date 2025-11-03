import { test, expect } from '@playwright/test'

const EMAIL = process.env.E2E_EMAIL || 'demo@example.com'
const PASSWORD = process.env.E2E_PASSWORD || 'demo1234'

test('sign in and create a booking', async ({ page }) => {
  await page.goto('/api/auth/signin')
  await page.fill('input[name="email"]', EMAIL)
  await page.fill('input[name="password"]', PASSWORD)
  await page.click('button[type="submit"]')

  await page.goto('/dashboard')
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()

  const start = new Date(Date.now() + 5 * 60 * 1000)
  const end = new Date(Date.now() + 65 * 60 * 1000)

  const fmt = (d: Date) => {
    const iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString()
    return iso.slice(0,16)
  }

  await page.fill('input[type="datetime-local"] >> nth=0', fmt(start))
  await page.fill('input[type="datetime-local"] >> nth=1', fmt(end))
  await page.getByRole('button', { name: 'Create booking' }).click()

  await expect(page.getByText('Saved.')).toBeVisible({ timeout: 10000 })
  await expect(page.getByText('Recent bookings')).toBeVisible()
})
