import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: { 
    environment: 'jsdom',
    setupFiles: './tests/setupTests.ts',
    globals: true,
    exclude: [
      'tests/**',
      'e2e/**',
      'playwright/**',
      'node_modules', 'dist', '.next', '.git', 'coverage'
    ],
  },
})
