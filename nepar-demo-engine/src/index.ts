import { ZodError } from 'zod';
import { attachCustomDomain, detachCustomDomain } from './cloudflare-domains';
import { dashboardHeaders, renderDashboard } from './dashboard';
import { ApiError, errorResponse, isAuthorized, json, parsePositiveInt, readBodyBytes, readJsonBody } from './http';
import type { DemoEventType, DemoRow, LeadRow, RuntimeEnv } from './models';
import {
  MAX_ADMIN_BODY_BYTES,
  MAX_SCREENSHOT_BYTES,
  createDemoSchema,
  createLeadSchema,
  demoContentSchema,
  qaReportSchema,
  slugSchema,
} from './schema';
import { pageHeaders, renderDemo, renderNotFound } from './templates';

export const RESERVED_SUBDOMAINS = new Set([
  'www', 'api', 'mail', 'smtp', 'ftp', 'admin', 'app', 'cdn', 'assets',
  'kids', 'animationstudios', 'sales', 'status', 'support', 'demo',
]);

const EVENT_TYPES = new Set<DemoEventType>([
  'page_view', 'primary_cta_click', 'secondary_cta_click', 'phone_click', 'email_click',
]);

export default {
  async fetch(request: Request, env: RuntimeEnv, ctx: ExecutionContext): Promise<Response> {
    const requestId = crypto.randomUUID();
    const url = new URL(request.url);
    try {
      if (url.pathname === '/__health') {
        return json({ ok: true, service: env.WORKER_SERVICE, now: new Date().toISOString(), requestId });
      }
      if (url.pathname === '/__admin' || url.pathname === '/__admin/') {
        const nonce = crypto.randomUUID().replaceAll('-', '');
        return new Response(renderDashboard(nonce), { headers: dashboardHeaders(nonce) });
      }
      if (url.pathname.startsWith('/__admin/')) {
        return await handleAdmin(request, env, requestId);
      }
      if (url.pathname === '/__event') {
        return await handleTrackedRedirect(request, env);
      }
      return await handlePublicDemo(request, env, ctx);
    } catch (error) {
      return errorResponse(error, requestId);
    }
  },

  async scheduled(_controller: ScheduledController, env: RuntimeEnv, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(cleanupExpired(env));
  },
} satisfies ExportedHandler<RuntimeEnv>;

async function handlePublicDemo(request: Request, env: RuntimeEnv, ctx: ExecutionContext): Promise<Response> {
  const url = new URL(request.url);
  const slug = resolveSlug(url, env.ROOT_DOMAIN);
  if (!slug) return notFound('Demo nije pronađen.');

  const demo = await getDemoBySlug(env, slug);
  if (!demo || demo.status !== 'active') return notFound('Demo nije pronađen ili više nije aktivan.');
  if (isExpired(demo.expires_at)) {
    ctx.waitUntil(expireDemo(env, demo));
    return notFound('Ovaj demo je istekao.');
  }

  let storedContent: unknown;
  try {
    storedContent = JSON.parse(demo.content_json);
  } catch {
    storedContent = null;
  }
  const parsed = demoContentSchema.safeParse(storedContent);
  if (!parsed.success) {
    console.error(JSON.stringify({ event: 'invalid_stored_demo', demoId: demo.id, issues: parsed.error.issues }));
    return new Response(renderNotFound('Sadržaj demo stranice trenutačno nije dostupan.'), { status: 500, headers: pageHeaders() });
  }

  ctx.waitUntil(recordEvent(env, demo.id, 'page_view', request));
  return new Response(renderDemo(demo, parsed.data), { headers: pageHeaders() });
}

async function handleAdmin(request: Request, env: RuntimeEnv, requestId: string): Promise<Response> {
  if (!await isAuthorized(request, env.ADMIN_TOKEN)) {
    throw new ApiError(401, 'UNAUTHORIZED', 'Nedostaje valjan admin token.');
  }
  const url = new URL(request.url);

  if (request.method === 'GET' && url.pathname === '/__admin/leads') return listLeads(env);
  if (request.method === 'POST' && url.pathname === '/__admin/leads') return createLead(request, env);

  const leadAction = url.pathname.match(/^\/__admin\/leads\/(\d+)\/(approve|reject)$/);
  if (request.method === 'POST' && leadAction) {
    return updateLeadDecision(env, Number(leadAction[1]), leadAction[2] as 'approve' | 'reject');
  }

  if (request.method === 'GET' && url.pathname === '/__admin/demos') return listDemos(request, env);
  if (request.method === 'POST' && url.pathname === '/__admin/demos') return createDemo(request, env, requestId);

  const screenshot = url.pathname.match(/^\/__admin\/demos\/([a-z0-9-]+)\/screenshots\/(desktop|mobile)$/);
  if (request.method === 'PUT' && screenshot) return uploadScreenshot(request, env, screenshot[1], screenshot[2] as 'desktop' | 'mobile');

  const qa = url.pathname.match(/^\/__admin\/demos\/([a-z0-9-]+)\/qa$/);
  if (request.method === 'PATCH' && qa) return updateQa(request, env, qa[1]);

  const demoAction = url.pathname.match(/^\/__admin\/demos\/([a-z0-9-]+)\/(approve|regenerate)$/);
  if (request.method === 'POST' && demoAction) {
    return updateDemoWorkflow(env, demoAction[1], demoAction[2] as 'approve' | 'regenerate');
  }

  const demo = url.pathname.match(/^\/__admin\/demos\/([a-z0-9-]+)$/);
  if (request.method === 'DELETE' && demo) return archiveDemo(env, demo[1]);

  const asset = url.pathname.match(/^\/__admin\/assets\/(.+)$/);
  if (request.method === 'GET' && asset) return getAsset(env, decodeURIComponent(asset[1]));

  throw new ApiError(404, 'ADMIN_ROUTE_NOT_FOUND', 'Admin ruta ne postoji.');
}

async function listLeads(env: RuntimeEnv): Promise<Response> {
  const result = await env.DB.prepare(
    `SELECT * FROM leads ORDER BY CASE status
      WHEN 'approved_for_demo' THEN 0 WHEN 'researched' THEN 1 WHEN 'new' THEN 2 ELSE 3 END,
      score DESC, created_at DESC LIMIT 250`,
  ).all<LeadRow>();
  return json({ ok: true, leads: result.results });
}

async function createLead(request: Request, env: RuntimeEnv): Promise<Response> {
  const input = parseSchema(createLeadSchema, await readJsonBody(request, MAX_ADMIN_BODY_BYTES));
  assertSlugAllowed(input.slug);
  try {
    const result = await env.DB.prepare(
      `INSERT INTO leads (
        business_name, slug, website_url, google_business_url, instagram_url, facebook_url,
        public_email, public_phone, city, industry, source, score, score_reasons_json,
        research_json, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *`,
    ).bind(
      input.businessName, input.slug, input.websiteUrl ?? null, input.googleBusinessUrl ?? null,
      input.instagramUrl ?? null, input.facebookUrl ?? null, input.publicEmail ?? null,
      input.publicPhone ?? null, input.city ?? null, input.industry, input.source, input.score,
      JSON.stringify(input.scoreReasons), JSON.stringify(input), input.status,
    ).first<LeadRow>();
    return json({ ok: true, lead: result }, 201);
  } catch (error) {
    if (String(error).includes('UNIQUE')) throw new ApiError(409, 'LEAD_SLUG_EXISTS', 'Lead s ovim slugom već postoji.');
    throw error;
  }
}

async function updateLeadDecision(env: RuntimeEnv, id: number, action: 'approve' | 'reject'): Promise<Response> {
  const status = action === 'approve' ? 'approved_for_demo' : 'rejected';
  const result = await env.DB.prepare(
    `UPDATE leads SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? RETURNING *`,
  ).bind(status, id).first<LeadRow>();
  if (!result) throw new ApiError(404, 'LEAD_NOT_FOUND', 'Lead nije pronađen.');
  await insertWorkflowEvent(env, result.id, null, action === 'approve' ? 'lead_approved_for_demo' : 'lead_rejected', {}, false);
  return json({ ok: true, lead: result });
}

async function listDemos(request: Request, env: RuntimeEnv): Promise<Response> {
  const result = await env.DB.prepare(`SELECT * FROM demos ORDER BY created_at DESC LIMIT 250`).all<DemoRow>();
  const origin = new URL(request.url).origin;
  return json({
    ok: true,
    demos: result.results.map((demo) => ({
      ...demo,
      preview_url: demo.custom_domain_id ? `https://${demo.slug}.${env.ROOT_DOMAIN}` : `${origin}/?demo=${demo.slug}`,
    })),
  });
}

async function createDemo(request: Request, env: RuntimeEnv, requestId: string): Promise<Response> {
  const input = parseSchema(createDemoSchema, await readJsonBody(request, MAX_ADMIN_BODY_BYTES));
  assertSlugAllowed(input.slug);
  const idempotencyKey = normalizeIdempotencyKey(request.headers.get('idempotency-key'));
  const idempotencyHash = idempotencyKey ? await sha256(JSON.stringify(input)) : null;
  if (idempotencyKey) {
    const replay = await env.DB.prepare(`SELECT * FROM demos WHERE idempotency_key = ? LIMIT 1`).bind(idempotencyKey).first<DemoRow>();
    if (replay) {
      if (replay.idempotency_hash !== idempotencyHash) {
        throw new ApiError(409, 'IDEMPOTENCY_KEY_REUSED', 'Idempotency-Key je već korišten za drugi payload.');
      }
      return demoCreatedResponse(request, env, replay, true);
    }
  }
  if (await getDemoBySlug(env, input.slug)) {
    throw new ApiError(409, 'DEMO_SLUG_EXISTS', 'Demo s ovim slugom već postoji. Arhivirajte ga ili odaberite novi slug.');
  }
  if (input.leadId) {
    const lead = await env.DB.prepare(`SELECT id FROM leads WHERE id = ? LIMIT 1`).bind(input.leadId).first<{ id: number }>();
    if (!lead) throw new ApiError(404, 'LEAD_NOT_FOUND', 'Povezani lead nije pronađen.');
  }

  const now = new Date();
  const defaultDays = parsePositiveInt(env.DEFAULT_EXPIRY_DAYS, 7, 30);
  const expiresAt = input.expiresAt
    ? new Date(input.expiresAt)
    : new Date(now.getTime() + (input.expiresInDays ?? defaultDays) * 86_400_000);
  if (!Number.isFinite(expiresAt.getTime()) || expiresAt <= now) {
    throw new ApiError(400, 'INVALID_EXPIRY', 'Datum isteka mora biti u budućnosti.');
  }
  if (input.attachDomain) {
    const active = await env.DB.prepare(
      `SELECT COUNT(*) AS total FROM demos WHERE status = 'active' AND custom_domain_id IS NOT NULL`,
    ).first<{ total: number }>();
    const ceiling = parsePositiveInt(env.ACTIVE_DOMAIN_LIMIT, 80, 99);
    if ((active?.total ?? 0) >= ceiling) {
      throw new ApiError(409, 'DOMAIN_POOL_NEAR_CAPACITY', `Aktivni domain pool dosegnuo je operativni limit ${ceiling}.`);
    }
  }

  let created: DemoRow | null = null;
  let attachedDomainId: string | null = null;
  try {
    created = await env.DB.prepare(
      `INSERT INTO demos (
        slug, business_name, template_key, content_json, source_url, lead_email, status,
        custom_domain_id, created_at, updated_at, expires_at, lead_id, design_system_key,
        generation_version, qa_status, idempotency_key, idempotency_hash, outreach_json
      ) VALUES (?, ?, ?, ?, ?, ?, 'active', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?, ?, ?, ?, 'pending', ?, ?, ?)
      RETURNING *`,
    ).bind(
      input.slug, input.businessName, input.designSystemKey, JSON.stringify(input.content),
      input.sourceUrl ?? null, input.leadEmail ?? null, expiresAt.toISOString(), input.leadId ?? null,
      input.designSystemKey, input.generationVersion, idempotencyKey, idempotencyHash, JSON.stringify(input.outreach),
    ).first<DemoRow>();
    if (!created) throw new ApiError(500, 'DEMO_CREATE_FAILED', 'D1 nije vratio kreirani demo.');
    if (input.attachDomain) {
      attachedDomainId = await attachCustomDomain(env, `${input.slug}.${env.ROOT_DOMAIN}`);
      created.custom_domain_id = attachedDomainId;
      await env.DB.prepare(`UPDATE demos SET custom_domain_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).bind(attachedDomainId, created.id).run();
    }
    if (input.leadId) {
      await env.DB.prepare(`UPDATE leads SET status = 'demo_ready', updated_at = CURRENT_TIMESTAMP WHERE id = ?`).bind(input.leadId).run();
    }
    await insertWorkflowEvent(env, input.leadId ?? null, created.id, 'demo_created', { requestId }, false);
    return demoCreatedResponse(request, env, created, false);
  } catch (error) {
    if (created && attachedDomainId) {
      try {
        await detachCustomDomain(env, attachedDomainId);
      } catch (rollbackError) {
        await env.DB.prepare(`UPDATE demos SET custom_domain_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).bind(attachedDomainId, created.id).run();
        console.error(JSON.stringify({ event: 'domain_rollback_failed', demoId: created.id, domainId: attachedDomainId, error: rollbackError instanceof Error ? rollbackError.message : String(rollbackError) }));
        throw new ApiError(502, 'DOMAIN_ROLLBACK_FAILED', 'Attach nije dovršen, a domena nije mogla biti automatski odvojena. Zapis je sačuvan za ručni oporavak.');
      }
    }
    if (created) await env.DB.prepare(`DELETE FROM demos WHERE id = ? AND custom_domain_id IS NULL`).bind(created.id).run();
    throw error;
  }
}

function demoCreatedResponse(request: Request, env: RuntimeEnv, demo: DemoRow, replayed: boolean): Response {
  const origin = new URL(request.url).origin;
  return json({
    ok: true, replayed,
    demo: {
      id: demo.id, slug: demo.slug, businessName: demo.business_name,
      url: demo.custom_domain_id ? `https://${demo.slug}.${env.ROOT_DOMAIN}` : `${origin}/?demo=${demo.slug}`,
      expiresAt: demo.expires_at, customDomainId: demo.custom_domain_id, qaStatus: demo.qa_status,
    },
  }, replayed ? 200 : 201);
}

async function updateQa(request: Request, env: RuntimeEnv, slug: string): Promise<Response> {
  const report = parseSchema(qaReportSchema, await readJsonBody(request, MAX_ADMIN_BODY_BYTES));
  const desktopKey = report.viewports.find((item) => item.name === 'desktop')?.screenshotKey ?? null;
  const mobileKey = report.viewports.find((item) => item.name === 'mobile')?.screenshotKey ?? null;
  const demo = await env.DB.prepare(
    `UPDATE demos SET qa_status = ?, qa_report_json = ?,
      desktop_screenshot_key = COALESCE(?, desktop_screenshot_key),
      mobile_screenshot_key = COALESCE(?, mobile_screenshot_key), updated_at = CURRENT_TIMESTAMP
     WHERE slug = ? AND status = 'active' RETURNING *`,
  ).bind(report.status, JSON.stringify(report), desktopKey, mobileKey, slug).first<DemoRow>();
  if (!demo) throw new ApiError(404, 'DEMO_NOT_FOUND', 'Aktivni demo nije pronađen.');
  await insertWorkflowEvent(env, demo.lead_id, demo.id, report.status === 'passed' ? 'demo_qa_passed' : 'demo_qa_failed', report, false);
  return json({ ok: true, demo });
}

async function uploadScreenshot(request: Request, env: RuntimeEnv, slug: string, viewport: 'desktop' | 'mobile'): Promise<Response> {
  if (request.headers.get('content-type') !== 'image/png') {
    throw new ApiError(415, 'SCREENSHOT_TYPE_INVALID', 'Screenshot mora biti PNG.');
  }
  const declared = Number(request.headers.get('content-length') ?? 0);
  if (declared > MAX_SCREENSHOT_BYTES) throw new ApiError(413, 'SCREENSHOT_TOO_LARGE', 'Screenshot je veći od 8 MB.');
  const demo = await getDemoBySlug(env, slug);
  if (!demo || demo.status !== 'active') throw new ApiError(404, 'DEMO_NOT_FOUND', 'Aktivni demo nije pronađen.');
  const bytes = await readBodyBytes(request, MAX_SCREENSHOT_BYTES);
  if (bytes.byteLength === 0) throw new ApiError(400, 'SCREENSHOT_EMPTY', 'Screenshot tijelo je prazno.');
  const key = `screenshots/${demo.id}/${viewport}-${Date.now()}.png`;
  const stored = await env.ASSETS.put(key, bytes, {
    httpMetadata: { contentType: 'image/png', cacheControl: 'private, max-age=31536000, immutable' },
    customMetadata: { demoId: String(demo.id), slug: demo.slug, viewport },
  });
  if (!stored) throw new ApiError(500, 'SCREENSHOT_STORE_FAILED', 'R2 nije spremio screenshot.');
  const column = viewport === 'desktop' ? 'desktop_screenshot_key' : 'mobile_screenshot_key';
  await env.DB.prepare(`UPDATE demos SET ${column} = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).bind(key, demo.id).run();
  return json({ ok: true, key }, 201);
}

async function getAsset(env: RuntimeEnv, key: string): Promise<Response> {
  if (!/^screenshots\/\d+\/(desktop|mobile)-\d+\.png$/.test(key)) {
    throw new ApiError(400, 'ASSET_KEY_INVALID', 'Asset ključ nije valjan.');
  }
  const object = await env.ASSETS.get(key);
  if (!object || !('body' in object)) throw new ApiError(404, 'ASSET_NOT_FOUND', 'Asset nije pronađen.');
  const headers = new Headers({ 'Cache-Control': 'private, max-age=300', ETag: object.httpEtag });
  object.writeHttpMetadata(headers);
  return new Response(object.body, { headers });
}

async function updateDemoWorkflow(env: RuntimeEnv, slug: string, action: 'approve' | 'regenerate'): Promise<Response> {
  const demo = await getDemoBySlug(env, slug);
  if (!demo || demo.status !== 'active') throw new ApiError(404, 'DEMO_NOT_FOUND', 'Aktivni demo nije pronađen.');
  if (action === 'approve') {
    if (demo.qa_status !== 'passed') throw new ApiError(409, 'QA_NOT_PASSED', 'Demo se ne može odobriti dok QA ne prođe.');
    await env.DB.batch([
      env.DB.prepare(`UPDATE demos SET approved_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).bind(demo.id),
      env.DB.prepare(
        `INSERT INTO workflow_events (lead_id, demo_id, event_type, payload_json, requires_human_action)
         VALUES (?, ?, 'demo_approved_for_outreach', ?, 1)`,
      ).bind(demo.lead_id, demo.id, demo.outreach_json ?? '{}'),
    ]);
    return json({ ok: true, event: 'demo_approved_for_outreach', emailSent: false });
  }
  await env.DB.batch([
    env.DB.prepare(`UPDATE demos SET qa_status = 'pending', qa_report_json = NULL, approved_at = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).bind(demo.id),
    env.DB.prepare(
      `INSERT INTO workflow_events (lead_id, demo_id, event_type, payload_json, requires_human_action)
       VALUES (?, ?, 'demo_regeneration_requested', '{}', 0)`,
    ).bind(demo.lead_id, demo.id),
  ]);
  return json({ ok: true, event: 'demo_regeneration_requested' }, 202);
}

async function archiveDemo(env: RuntimeEnv, slug: string): Promise<Response> {
  const demo = await getDemoBySlug(env, slug);
  if (!demo) throw new ApiError(404, 'DEMO_NOT_FOUND', 'Demo nije pronađen.');
  if (demo.custom_domain_id) await detachCustomDomain(env, demo.custom_domain_id);
  await env.DB.prepare(
    `UPDATE demos SET status = 'archived', custom_domain_id = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
  ).bind(demo.id).run();
  await insertWorkflowEvent(env, demo.lead_id, demo.id, 'demo_archived', {}, false);
  return json({ ok: true, slug, status: 'archived' });
}

async function handleTrackedRedirect(request: Request, env: RuntimeEnv): Promise<Response> {
  const url = new URL(request.url);
  const slug = normalizeSlug(url.searchParams.get('demo') ?? resolveSlug(url, env.ROOT_DOMAIN) ?? '');
  const eventType = url.searchParams.get('type') as DemoEventType | null;
  const target = safeRedirectTarget(url.searchParams.get('to') ?? '#kontakt');
  if (!slug || !eventType || eventType === 'page_view' || !EVENT_TYPES.has(eventType)) {
    throw new ApiError(400, 'EVENT_INVALID', 'Tracking event nije valjan.');
  }
  const demo = await getDemoBySlug(env, slug);
  if (!demo || demo.status !== 'active' || isExpired(demo.expires_at)) {
    throw new ApiError(404, 'DEMO_NOT_FOUND', 'Aktivni demo nije pronađen.');
  }
  await recordEvent(env, demo.id, eventType, request);
  const destination = target.startsWith('#') ? `${url.origin}/?demo=${encodeURIComponent(slug)}${target}` : target;
  return Response.redirect(destination, 302);
}

function safeRedirectTarget(value: string): string {
  if (value.startsWith('#')) return value;
  if (/^(tel:|mailto:)/i.test(value) && !/["'<>`\s]/.test(value)) return value;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : '#kontakt';
  } catch {
    return '#kontakt';
  }
}

async function recordEvent(env: RuntimeEnv, demoId: number, eventType: DemoEventType, request: Request): Promise<void> {
  const url = new URL(request.url);
  const statements = [
    env.DB.prepare(
      `INSERT INTO demo_events (demo_id, event_type, path, referrer, country, user_agent)
       VALUES (?, ?, ?, ?, ?, ?)`,
    ).bind(demoId, eventType, url.pathname, request.headers.get('referer'), request.headers.get('cf-ipcountry'), request.headers.get('user-agent')),
  ];
  if (eventType === 'page_view') {
    statements.push(env.DB.prepare(
      `UPDATE demos SET view_count = view_count + 1,
       first_viewed_at = COALESCE(first_viewed_at, CURRENT_TIMESTAMP),
       last_viewed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    ).bind(demoId));
  }
  await env.DB.batch(statements);
}

async function cleanupExpired(env: RuntimeEnv): Promise<void> {
  const result = await env.DB.prepare(
    `SELECT * FROM demos WHERE status = 'active' AND expires_at IS NOT NULL AND expires_at <= ? ORDER BY expires_at ASC LIMIT 100`,
  ).bind(new Date().toISOString()).all<DemoRow>();
  for (const demo of result.results) {
    try {
      await expireDemo(env, demo);
    } catch (error) {
      console.error(JSON.stringify({ event: 'expiry_failed', demoId: demo.id, slug: demo.slug, error: error instanceof Error ? error.message : String(error) }));
    }
  }
}

async function expireDemo(env: RuntimeEnv, demo: DemoRow): Promise<void> {
  if (demo.custom_domain_id) await detachCustomDomain(env, demo.custom_domain_id);
  await env.DB.batch([
    env.DB.prepare(`UPDATE demos SET status = 'expired', custom_domain_id = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).bind(demo.id),
    env.DB.prepare(
      `INSERT INTO workflow_events (lead_id, demo_id, event_type, payload_json, requires_human_action)
       VALUES (?, ?, 'demo_expired', '{}', 0)`,
    ).bind(demo.lead_id, demo.id),
  ]);
}

async function insertWorkflowEvent(
  env: RuntimeEnv,
  leadId: number | null,
  demoId: number | null,
  eventType: string,
  payload: unknown,
  requiresHumanAction: boolean,
): Promise<void> {
  await env.DB.prepare(
    `INSERT INTO workflow_events (lead_id, demo_id, event_type, payload_json, requires_human_action) VALUES (?, ?, ?, ?, ?)`,
  ).bind(leadId, demoId, eventType, JSON.stringify(payload), requiresHumanAction ? 1 : 0).run();
}

async function getDemoBySlug(env: RuntimeEnv, slug: string): Promise<DemoRow | null> {
  return env.DB.prepare(`SELECT * FROM demos WHERE slug = ? LIMIT 1`).bind(slug).first<DemoRow>();
}

function parseSchema<T>(schema: { parse(value: unknown): T }, value: unknown): T {
  try {
    return schema.parse(value);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ApiError(422, 'VALIDATION_FAILED', 'Payload nije prošao validaciju.', error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message })));
    }
    throw error;
  }
}

function normalizeIdempotencyKey(value: string | null): string | null {
  if (!value) return null;
  const normalized = value.trim();
  if (!/^[A-Za-z0-9._:-]{8,128}$/.test(normalized)) {
    throw new ApiError(400, 'IDEMPOTENCY_KEY_INVALID', 'Idempotency-Key mora imati 8–128 sigurnih znakova.');
  }
  return normalized;
}

function assertSlugAllowed(slug: string): void {
  if (RESERVED_SUBDOMAINS.has(slug)) throw new ApiError(400, 'SLUG_RESERVED', 'Slug je rezerviran i ne može se koristiti.');
}

export function resolveSlug(url: URL, rootDomain: string): string | null {
  const hostname = url.hostname.toLowerCase();
  const suffix = `.${rootDomain.toLowerCase()}`;
  if (hostname.endsWith(suffix)) {
    const subdomain = hostname.slice(0, -suffix.length);
    if (!subdomain.includes('.') && !RESERVED_SUBDOMAINS.has(subdomain)) return normalizeSlug(subdomain) || null;
  }
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.workers.dev')) {
    const preview = normalizeSlug(url.searchParams.get('demo') ?? '');
    return preview && !RESERVED_SUBDOMAINS.has(preview) ? preview : null;
  }
  return null;
}

export function normalizeSlug(value: string): string {
  const result = slugSchema.safeParse(value);
  return result.success ? result.data : '';
}

export function isExpired(value: string | null, now = Date.now()): boolean {
  return Boolean(value && Number.isFinite(new Date(value).getTime()) && new Date(value).getTime() <= now);
}

async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function notFound(message: string): Response {
  return new Response(renderNotFound(message), { status: 404, headers: pageHeaders() });
}
