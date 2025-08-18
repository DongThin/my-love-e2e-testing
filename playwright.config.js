const { defineConfig, devices } = require('@playwright/test');

// Load environment-specific config
const envFile = process.env.NODE_ENV === 'production' ? '.env.prod' : '.env';
require('dotenv').config({ path: envFile });

const FRONTEND_URL = process.env.FRONTEND_URL
const IS_CI = process.env.CI === 'true' || !!process.env.CI;

module.exports = defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: IS_CI,
  retries: IS_CI ? 2 : 0,
  workers: IS_CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: FRONTEND_URL,
    trace: 'on-first-retry',
    headless: IS_CI,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],
});