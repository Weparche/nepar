import { resolve } from 'node:path';
import { cloudflareTest, readD1Migrations } from '@cloudflare/vitest-plugin';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    cloudflareTest(async () => ({
      wrangler: { configPath: './wrangler.jsonc' },
      miniflare: {
        bindings: {
          ADMIN_TOKEN: 'test-admin-token-123',
          WORKERS_DOMAINS_API_TOKEN: 'test-cloudflare-token',
          CF_ACCOUNT_ID: 'account-test',
          CF_ZONE_ID: 'zone-test',
          TEST_MIGRATIONS: await readD1Migrations(resolve('migrations')),
        },
      },
    })),
  ],
  test: {
    setupFiles: ['./test/setup.ts'],
    fileParallelism: false,
  },
});
