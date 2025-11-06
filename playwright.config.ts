import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'

if (!process.env.CI) {
 dotenv.config({ path: '.env.test' })
}

export default defineConfig({
  testDir: './tests',
  timeout: 90_000,
  expect: { timeout: 10_000 },
  workers: 1,
  use: {
    headless: true,
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev',          
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120_000,
  },
  globalSetup: './tests/global-setup.ts',
})