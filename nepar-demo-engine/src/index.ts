import base, { RESERVED_SUBDOMAINS, isExpired, normalizeSlug, resolveSlug } from './index-v2';
import { ingestGitHubLeadQueue } from './github-lead-ingest';
import { isAuthorized } from './http';
import type { RuntimeEnv } from './models';

export { RESERVED_SUBDOMAINS, isExpired, normalizeSlug, resolveSlug };

const handler = {
  async fetch(request: Request, env: RuntimeEnv, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    if (request.method === 'POST' && url.pathname === '/__admin/ingest/github') {
      if (!await isAuthorized(request, env.ADMIN_TOKEN)) {
        return Response.json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Nedostaje valjan admin token.' } }, { status: 401 });
      }
      try {
        const result = await ingestGitHubLeadQueue(env);
        return Response.json({ ok: true, ...result });
      } catch (error) {
        console.error(JSON.stringify({ event: 'github_lead_ingest_failed', error: error instanceof Error ? error.message : String(error) }));
        return Response.json({ ok: false, error: { code: 'GITHUB_LEAD_INGEST_FAILED', message: error instanceof Error ? error.message : String(error) } }, { status: 502 });
      }
    }
    return base.fetch(request, env, ctx);
  },

  async scheduled(controller: ScheduledController, env: RuntimeEnv, ctx: ExecutionContext): Promise<void> {
    await base.scheduled(controller, env, ctx);
    if (controller.cron === '30 7 * * *') {
      ctx.waitUntil(
        ingestGitHubLeadQueue(env)
          .then((result) => console.log(JSON.stringify({ event: 'github_lead_ingest_complete', ...result })))
          .catch((error) => console.error(JSON.stringify({ event: 'github_lead_ingest_failed', error: error instanceof Error ? error.message : String(error) }))),
      );
    }
  },
} satisfies ExportedHandler<RuntimeEnv>;

export default handler;
