import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  //define env files
  const env = loadEnv(mode, process.cwd(), '');

  for (const [k, v] of Object.entries(env)) {
    if (process.env[k] === undefined) process.env[k] = v;
  }

  return {  
    test: { 
      environment: 'node',
      environmentMatchGlobs: [
      ['**/*.dom.test.{ts,tsx,js,jsx}', 'jsdom'], // UI tests
    ],
      setupFiles: './tests/setupTests.ts',
      globals: true,
      exclude: [
        'tests/**',
        'e2e/**',
        'playwright/**',
        'node_modules', 'dist', '.next', '.git', 'coverage'
      ],
    },
  };
})
