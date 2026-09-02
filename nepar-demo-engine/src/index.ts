import base, { RESERVED_SUBDOMAINS, isExpired, normalizeSlug, resolveSlug } from './index-v2';
import { ingestGitHubLeadQueue } from './github-lead-ingest';
import { isAuthorized } from './http';
import type { DemoRow, LeadRow, OutreachStatus, RuntimeEnv } from './models';
import { OUTREACH_STATUSES } from './models';
import { createLeadSchema } from './schema';
import { buildDemoPayload } from './generation';
import { composeOutreachEmail, sendOutreachEmail } from './outreach';
import { attachCustomDomain } from './cloudflare-domains';

export { RESERVED_SUBDOMAINS, isExpired, normalizeSlug, resolveSlug };

const LEAD_INGEST_CRONS = new Set(['30 7 * * *', '30 9 * * *']);

function unauthorized() {
  return Response.json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Nedostaje valjan admin token.' } }, { status: 401 });
}
function apiError(status: number, code: string, message: string) {
  return Response.json({ ok: false, error: { code, message } }, { status });
}

async function handleGenerateFromLead(request: Request, env: RuntimeEnv, ctx: ExecutionContext, leadId: number, origin: string): Promise<Response> {
  const lead = await env.DB.prepare(`SELECT * FROM leads WHERE id = ? LIMIT 1`).bind(leadId).first<LeadRow>();
  if (!lead) return apiError(404, 'LEAD_NOT_FOUND', 'Lead nije pronađen.');
  let researchRaw: unknown;
  try { researchRaw = JSON.parse(lead.research_json); } catch { return apiError(500, 'LEAD_RESEARCH_INVALID', 'research_json nije valjan JSON.'); }
  const parsed = createLeadSchema.safeParse(researchRaw);
  if (!parsed.success) return apiError(422, 'LEAD_RESEARCH_SCHEMA_INVALID', 'Pohranjeni research podaci ne prolaze shemu.');
  if (lead.status === 'researched') {
    await env.DB.prepare(`UPDATE leads SET status = 'approved_for_demo', updated_at = CURRENT_TIMESTAMP WHERE id = ?`).bind(leadId).run();
  }
  const payload = await buildDemoPayload(parsed.data);
  payload.leadId = leadId;
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(payload)));
  const idempotencyKey = `generate-ui:${lead.slug}:${Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('').slice(0, 40)}`;
  const subRequest = new Request(`${origin}/__admin/demos`, {
    method: 'POST',
    headers: { Authorization: request.headers.get('Authorization') || '', 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
    body: JSON.stringify(payload),
  });
  return base.fetch(subRequest, env, ctx);
}

async function handleReattachDomain(env: RuntimeEnv, slug: string): Promise<Response> {
  const demo = await env.DB.prepare(`SELECT * FROM demos WHERE slug = ? LIMIT 1`).bind(slug).first<DemoRow>();
  if (!demo) return apiError(404, 'DEMO_NOT_FOUND', 'Demo nije pronađen.');
  if (demo.status !== 'active') return apiError(409, 'DEMO_NOT_ACTIVE', 'Demo nije aktivan.');
  const hostname = `${slug}.${env.ROOT_DOMAIN}`;
  let domainId: string;
  try {
    domainId = await attachCustomDomain(env, hostname);
  } catch (error) {
    const code = error && typeof error === 'object' && 'code' in error ? String((error as { code: unknown }).code) : 'E_UNKNOWN';
    return apiError(502, 'REATTACH_FAILED', `Reattach nije uspio (${code}): ${error instanceof Error ? error.message : String(error)}`);
  }
  await env.DB.prepare(`UPDATE demos SET custom_domain_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).bind(domainId, demo.id).run();
  return Response.json({ ok: true, slug, previousDomainId: demo.custom_domain_id, domainId, url: `https://${hostname}` });
}

async function handleOutreachEmailPreview(env: RuntimeEnv, slug: string): Promise<Response> {
  const demo = await env.DB.prepare(`SELECT * FROM demos WHERE slug = ? LIMIT 1`).bind(slug).first<DemoRow>();
  if (!demo) return apiError(404, 'DEMO_NOT_FOUND', 'Demo nije pronađen.');
  const email = composeOutreachEmail(demo, env);
  if (!email) return apiError(422, 'OUTREACH_EMAIL_UNAVAILABLE', 'Nema dovoljno podataka (recipientEmail) za sastavljanje e-maila.');
  return Response.json({ ok: true, email: { to: email.to, subject: email.subject, html: email.html, text: email.text }, alreadySent: Boolean(demo.sent_at) });
}

async function handleSendOutreach(env: RuntimeEnv, slug: string): Promise<Response> {
  const demo = await env.DB.prepare(`SELECT * FROM demos WHERE slug = ? LIMIT 1`).bind(slug).first<DemoRow>();
  if (!demo) return apiError(404, 'DEMO_NOT_FOUND', 'Demo nije pronađen.');
  if (!demo.approved_at) return apiError(409, 'DEMO_NOT_APPROVED', 'Demo mora biti odobren (approve) prije slanja.');
  if (demo.sent_at) return apiError(409, 'ALREADY_SENT', 'E-mail je već poslan za ovaj demo.');
  const email = composeOutreachEmail(demo, env);
  if (!email) return apiError(422, 'OUTREACH_EMAIL_UNAVAILABLE', 'Nema dovoljno podataka (recipientEmail) za slanje.');
  let messageId: string;
  try {
    messageId = await sendOutreachEmail(env, email);
  } catch (error) {
    const code = error && typeof error === 'object' && 'code' in error ? String((error as { code: unknown }).code) : 'E_UNKNOWN';
    return apiError(502, 'OUTREACH_SEND_FAILED', `Slanje nije uspjelo (${code}): ${error instanceof Error ? error.message : String(error)}`);
  }
  await env.DB.prepare(
    `UPDATE demos SET sent_at = CURRENT_TIMESTAMP, outreach_status = 'sent', outreach_message_id = ?, outreach_sent_subject = ?, outreach_sent_body = ?, outreach_status_updated_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
  ).bind(messageId, email.subject, email.text, demo.id).run();
  await env.DB.prepare(
    `INSERT INTO workflow_events (lead_id, demo_id, event_type, payload_json, requires_human_action) VALUES (?, ?, 'outreach_email_sent', ?, 0)`,
  ).bind(demo.lead_id, demo.id, JSON.stringify({ to: email.to, messageId })).run();
  return Response.json({ ok: true, sent: true, to: email.to, messageId });
}

async function handleOutreachStatusUpdate(request: Request, env: RuntimeEnv, slug: string): Promise<Response> {
  let body: unknown;
  try { body = await request.json(); } catch { return apiError(400, 'INVALID_JSON', 'Tijelo zahtjeva nije valjan JSON.'); }
  const status = (body as { status?: string } | null)?.status;
  if (!status || !OUTREACH_STATUSES.includes(status as OutreachStatus)) {
    return apiError(422, 'INVALID_STATUS', `status mora biti jedan od: ${OUTREACH_STATUSES.join(', ')}`);
  }
  const demo = await env.DB.prepare(
    `UPDATE demos SET outreach_status = ?, outreach_status_updated_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE slug = ? RETURNING *`,
  ).bind(status, slug).first<DemoRow>();
  if (!demo) return apiError(404, 'DEMO_NOT_FOUND', 'Demo nije pronađen.');
  return Response.json({ ok: true, demo });
}

const handler = {
  async fetch(request: Request, env: RuntimeEnv, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    if (request.method === 'POST' && url.pathname === '/__admin/ingest/github') {
      if (!await isAuthorized(request, env.ADMIN_TOKEN)) return unauthorized();
      try {
        const result = await ingestGitHubLeadQueue(env);
        return Response.json({ ok: true, ...result });
      } catch (error) {
        console.error(JSON.stringify({ event: 'github_lead_ingest_failed', error: error instanceof Error ? error.message : String(error) }));
        return Response.json({ ok: false, error: { code: 'GITHUB_LEAD_INGEST_FAILED', message: error instanceof Error ? error.message : String(error) } }, { status: 502 });
      }
    }
    const genMatch = url.pathname.match(/^\/__admin\/leads\/(\d+)\/generate$/);
    if (request.method === 'POST' && genMatch) {
      if (!await isAuthorized(request, env.ADMIN_TOKEN)) return unauthorized();
      return handleGenerateFromLead(request, env, ctx, Number(genMatch[1]), url.origin);
    }
    const reattachMatch = url.pathname.match(/^\/__admin\/demos\/([a-z0-9-]+)\/reattach-domain$/);
    if (request.method === 'POST' && reattachMatch) {
      if (!await isAuthorized(request, env.ADMIN_TOKEN)) return unauthorized();
      return handleReattachDomain(env, reattachMatch[1]);
    }
    const emailPreviewMatch = url.pathname.match(/^\/__admin\/demos\/([a-z0-9-]+)\/outreach-email$/);
    if (request.method === 'GET' && emailPreviewMatch) {
      if (!await isAuthorized(request, env.ADMIN_TOKEN)) return unauthorized();
      return handleOutreachEmailPreview(env, emailPreviewMatch[1]);
    }
    const sendMatch = url.pathname.match(/^\/__admin\/demos\/([a-z0-9-]+)\/send-outreach$/);
    if (request.method === 'POST' && sendMatch) {
      if (!await isAuthorized(request, env.ADMIN_TOKEN)) return unauthorized();
      return handleSendOutreach(env, sendMatch[1]);
    }
    const statusMatch = url.pathname.match(/^\/__admin\/demos\/([a-z0-9-]+)\/outreach-status$/);
    if (request.method === 'PATCH' && statusMatch) {
      if (!await isAuthorized(request, env.ADMIN_TOKEN)) return unauthorized();
      return handleOutreachStatusUpdate(request, env, statusMatch[1]);
    }
    return base.fetch(request, env, ctx);
  },

  async scheduled(controller: ScheduledController, env: RuntimeEnv, ctx: ExecutionContext): Promise<void> {
    await base.scheduled(controller, env, ctx);
    if (LEAD_INGEST_CRONS.has(controller.cron)) {
      ctx.waitUntil(
        ingestGitHubLeadQueue(env)
          .then((result) => console.log(JSON.stringify({ event: 'github_lead_ingest_complete', ...result })))
          .catch((error) => console.error(JSON.stringify({ event: 'github_lead_ingest_failed', error: error instanceof Error ? error.message : String(error) }))),
      );
    }
  },
} satisfies ExportedHandler<RuntimeEnv>;

export default handler;
