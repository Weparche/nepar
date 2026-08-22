declare namespace Cloudflare {
  interface Env {
    ADMIN_TOKEN: string;
    WORKERS_DOMAINS_API_TOKEN: string;
    CF_ACCOUNT_ID: string;
    CF_ZONE_ID: string;
    TEST_MIGRATIONS: D1Migration[];
  }
}
