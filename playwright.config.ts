import { defineConfig, devices } from '@playwright/test'
import 'dotenv/config'

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
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  // Ensure envs are present AND start the app for tests
  webServer: {
    // uses dotenv-cli to load .env.test for the dev server
    command: 'dotenv -e .env.test -- npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120_000,
    env: { NODE_ENV: 'test' }, // optional; fine to omit if you prefer
  },
  globalSetup: './tests/global-setup.ts',
})
