import { test, expect } from '@playwright/test'

const EMAIL = process.env.E2E_EMAIL || 'demo@example.com'
const PASSWORD = process.env.E2E_PASSWORD || 'demo1234'

test('sign in and create a booking', async ({ page }) => {
  await page.goto('/api/auth/signin?callbackUrl=/dashboard')
  await page.getByLabel(/email/i).fill(EMAIL)
  await page.getByLabel(/password/i).fill(PASSWORD)
  await page.getByRole('button', { name: 'Sign in with Credentials' }).click()

  await expect(page).toHaveURL(/\/dashboard$/)
  const heading = page.getByRole('heading', { name: /dashboard/i })
  await expect(heading).toBeVisible()
  // wait until the form is hydrated
  await expect(page.getByTestId('booking-form')).toHaveAttribute('data-ready', '1')

  const start = new Date(Date.now() + 5 * 60 * 1000)
  const end = new Date(Date.now() + 65 * 60 * 1000)

  const fmt = (d: Date) => {
    const iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString()
    return iso.slice(0,16)
  }

  const inputs = page.locator('input[type="datetime-local"]')
  await inputs.nth(0).fill(fmt(start))
  await inputs.nth(1).fill(fmt(end))
  // await page.getByRole('button', { name: /create booking/i }).click()
  // await page.waitForLoadState('networkidle')
  // await page.route('/api/bookings', async route => {
  //   expect(route.request().method()).toBe('POST');
  //   await route.continue(); // Allow the request to proceed
  // });

  // wait for POST explicitly
  const [resp] = await Promise.all([
    page.waitForResponse(r => r.url().includes('/api/bookings') && r.request().method() === 'POST'),
    page.getByTestId('booking-submit').click(),
  ])
  console.log('POST status:', resp.status(), await resp.text())
  expect(resp.ok()).toBeTruthy()


  await expect(page.getByTestId('saved-flag')).toBeVisible({ timeout: 10_000 })


  await expect(page.getByText(/recent bookings/i)).toBeVisible()
})
