import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  // Chromium has been unstable when this product opens two browser contexts at
  // once in the clean worker. Serial execution is the supported, documented run.
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: 'line',
  use: {
    ...devices['Desktop Chrome'],
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: true,
  },
});
