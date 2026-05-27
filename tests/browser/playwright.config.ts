import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  timeout: 30 * 1000,
  retries: 2,
  use: {
    headless: true,
    screenshot: 'only-on-failure',
  },
  reporter: [['list'], ['html', { open: 'never' }]],
});
