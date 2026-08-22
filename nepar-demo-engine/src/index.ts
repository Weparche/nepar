interface Env {
  DB: D1Database;
  ADMIN_TOKEN: string;
  CF_API_TOKEN?: string;
  CF_ACCOUNT_ID?: string;
  ROOT_DOMAIN: string;
  ZONE_NAME: string;
  WORKER_SERVICE: string;
}

interface DemoRow {
  id: number;
  slug: string;
  business_name: string;
  template_key: string;
  content_json: string;
  source_url: string | null;
  lead_email: string | null;
  status: 'active' | 'expired' | 'archived';
  custom_domain_id: string | null;
  created_at: string;
  updated_at: string;
  expires_at: string | null;
}

interface DemoContent {
  eyebrow?: string;
  headline?: string;
  description?: string;
  heroImage?: string;
  accent?: string;
  location?: string;
  primaryCta?: { label?: string; href?: string };
  secondaryCta?: { label?: string; href?: string };
  stats?: Array<{ value?: string; label?: string }>;
  services?: Array<{ title?: string; description?: string }>;
  aboutTitle?: string;
  aboutText?: string;
  proofTitle?: string;
  proofText?: string;
  phone?: string;
  email?: string;
  address?: string;
}

interface CreateDemoBody {
  slug?: string;
  businessName?: string;
  templateKey?: string;
  sourceUrl?: string;
  leadEmail?: string;
  content?: DemoContent;
  expiresAt?: string;
  attachDomain?: boolean;
}

const RESERVED = new Set(['www', 'api', 'mail', 'kids', 'animationstudios', 'sales']);

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/__health') {
      return json({ ok: true, service: env.WORKER_SERVICE, now: new Date().toISOString() });
    }

    if (url.pathname.startsWith('/__admin/')) {
      return handleAdmin(request, env);
    }

    const slug = resolveSlug(url, env.ROOT_DOMAIN);
    if (!slug) return notFound('Demo nije pronađen.');

    const demo = await env.DB.prepare(
      `SELECT * FROM demos WHERE slug = ? AND status = 'active' LIMIT 1`,
    ).bind(slug).first<DemoRow>();

    if (!demo) return notFound('Demo nije pronađen ili više nije aktivan.');
    if (isExpired(demo.expires_at)) {
      ctx.waitUntil(markExpired(env, demo));
      return notFound('Ovaj demo je istekao.');
    }

    let content: DemoContent;
    try {
      content = JSON.parse(demo.content_json) as DemoContent;
    } catch {
      return new Response('Invalid demo content', { status: 500 });
    }

    ctx.waitUntil(recordEvent(env, demo.id, request));

    return new Response(renderDemo(demo, content), {
      headers: pageHeaders(),
    });
  },

  async scheduled(_controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(cleanupExpired(env));
  },
} satisfies ExportedHandler<Env>;

async function handleAdmin(request: Request, env: Env): Promise<Response> {
  if (!isAuthorized(request, env.ADMIN_TOKEN)) {
    return json({ error: 'Unauthorized' }, 401);
  }

  const url = new URL(request.url);

  if (request.method === 'POST' && url.pathname === '/__admin/demos') {
    return createDemo(request, env);
  }

  if (request.method === 'GET' && url.pathname === '/__admin/demos') {
    const result = await env.DB.prepare(
      `SELECT id, slug, business_name, template_key, source_url, lead_email, status,
              custom_domain_id, created_at, updated_at, expires_at
       FROM demos ORDER BY created_at DESC LIMIT 100`,
    ).all();
    return json({ demos: result.results });
  }

  const match = url.pathname.match(/^\/__admin\/demos\/([a-z0-9-]+)$/);
  if (request.method === 'DELETE' && match) {
    return archiveDemo(match[1], env);
  }

  return json({ error: 'Admin route not found' }, 404);
}

async function createDemo(request: Request, env: Env): Promise<Response> {
  let body: CreateDemoBody;
  try {
    body = await request.json<CreateDemoBody>();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const slug = normalizeSlug(body.slug ?? '');
  const businessName = (body.businessName ?? '').trim();
  if (!slug || RESERVED.has(slug)) return json({ error: 'Invalid or reserved slug' }, 400);
  if (!businessName) return json({ error: 'businessName is required' }, 400);
  if (!body.content || typeof body.content !== 'object') return json({ error: 'content is required' }, 400);

  const now = new Date();
  const expiresAt = body.expiresAt ? new Date(body.expiresAt) : new Date(now.getTime() + 7 * 86400000);
  if (Number.isNaN(expiresAt.getTime()) || expiresAt <= now) {
    return json({ error: 'expiresAt must be a valid future date' }, 400);
  }

  const existing = await env.DB.prepare(
    `SELECT * FROM demos WHERE slug = ? LIMIT 1`,
  ).bind(slug).first<DemoRow>();

  await env.DB.prepare(
    `INSERT INTO demos (
       slug, business_name, template_key, content_json, source_url, lead_email,
       status, custom_domain_id, created_at, updated_at, expires_at
     ) VALUES (?, ?, ?, ?, ?, ?, 'active', ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?)
     ON CONFLICT(slug) DO UPDATE SET
       business_name = excluded.business_name,
       template_key = excluded.template_key,
       content_json = excluded.content_json,
       source_url = excluded.source_url,
       lead_email = excluded.lead_email,
       status = 'active',
       updated_at = CURRENT_TIMESTAMP,
       expires_at = excluded.expires_at`,
  ).bind(
    slug,
    businessName,
    body.templateKey ?? 'premium-local-service',
    JSON.stringify(body.content),
    body.sourceUrl ?? null,
    body.leadEmail ?? null,
    existing?.custom_domain_id ?? null,
    expiresAt.toISOString(),
  ).run();

  let customDomainId = existing?.custom_domain_id ?? null;
  let domainWarning: string | null = null;

  if (body.attachDomain !== false && !customDomainId) {
    try {
      customDomainId = await attachCustomDomain(env, `${slug}.${env.ROOT_DOMAIN}`);
      if (customDomainId) {
        await env.DB.prepare(
          `UPDATE demos SET custom_domain_id = ?, updated_at = CURRENT_TIMESTAMP WHERE slug = ?`,
        ).bind(customDomainId, slug).run();
      }
    } catch (error) {
      domainWarning = error instanceof Error ? error.message : 'Custom Domain attach failed';
    }
  }

  const origin = new URL(request.url).origin;
  return json({
    ok: true,
    slug,
    businessName,
    url: customDomainId ? `https://${slug}.${env.ROOT_DOMAIN}` : `${origin}/?demo=${slug}`,
    expiresAt: expiresAt.toISOString(),
    customDomainId,
    warning: domainWarning,
  }, 201);
}

async function archiveDemo(slug: string, env: Env): Promise<Response> {
  const demo = await env.DB.prepare(
    `SELECT * FROM demos WHERE slug = ? LIMIT 1`,
  ).bind(slug).first<DemoRow>();

  if (!demo) return json({ error: 'Demo not found' }, 404);

  if (demo.custom_domain_id) {
    try {
      await detachCustomDomain(env, demo.custom_domain_id);
    } catch (error) {
      return json({
        error: 'Failed to detach custom domain',
        detail: error instanceof Error ? error.message : String(error),
      }, 502);
    }
  }

  await env.DB.prepare(
    `UPDATE demos SET status = 'archived', custom_domain_id = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
  ).bind(demo.id).run();

  return json({ ok: true, slug, status: 'archived' });
}

async function attachCustomDomain(env: Env, hostname: string): Promise<string | null> {
  if (!env.CF_API_TOKEN || !env.CF_ACCOUNT_ID) return null;

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(env.CF_ACCOUNT_ID)}/workers/domains`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${env.CF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        hostname,
        service: env.WORKER_SERVICE,
        zone_name: env.ZONE_NAME,
      }),
    },
  );

  const payload = await response.json() as {
    success?: boolean;
    result?: { id?: string };
    errors?: Array<{ message?: string }>;
  };

  if (!response.ok || !payload.success || !payload.result?.id) {
    throw new Error(payload.errors?.map((e) => e.message).filter(Boolean).join('; ') || `Cloudflare API ${response.status}`);
  }

  return payload.result.id;
}

async function detachCustomDomain(env: Env, domainId: string): Promise<void> {
  if (!env.CF_API_TOKEN || !env.CF_ACCOUNT_ID) {
    throw new Error('CF_API_TOKEN or CF_ACCOUNT_ID is missing');
  }

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(env.CF_ACCOUNT_ID)}/workers/domains/${encodeURIComponent(domainId)}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${env.CF_API_TOKEN}` },
    },
  );

  if (!response.ok) throw new Error(`Cloudflare detach failed (${response.status})`);
}

async function cleanupExpired(env: Env): Promise<void> {
  const result = await env.DB.prepare(
    `SELECT * FROM demos
     WHERE status = 'active' AND expires_at IS NOT NULL AND expires_at <= ?
     ORDER BY expires_at ASC LIMIT 100`,
  ).bind(new Date().toISOString()).all<DemoRow>();

  for (const demo of result.results) {
    if (demo.custom_domain_id && env.CF_API_TOKEN && env.CF_ACCOUNT_ID) {
      try {
        await detachCustomDomain(env, demo.custom_domain_id);
      } catch (error) {
        console.error('Failed to detach expired domain', demo.slug, error);
        continue;
      }
    }

    await env.DB.prepare(
      `UPDATE demos SET status = 'expired', custom_domain_id = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    ).bind(demo.id).run();
  }
}

async function markExpired(env: Env, demo: DemoRow): Promise<void> {
  if (demo.custom_domain_id && env.CF_API_TOKEN && env.CF_ACCOUNT_ID) {
    try {
      await detachCustomDomain(env, demo.custom_domain_id);
    } catch (error) {
      console.error('Failed to detach expired domain', demo.slug, error);
      return;
    }
  }

  await env.DB.prepare(
    `UPDATE demos SET status = 'expired', custom_domain_id = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
  ).bind(demo.id).run();
}

async function recordEvent(env: Env, demoId: number, request: Request): Promise<void> {
  const url = new URL(request.url);
  await env.DB.prepare(
    `INSERT INTO demo_events (demo_id, event_type, path, referrer, country, user_agent)
     VALUES (?, 'page_view', ?, ?, ?, ?)`,
  ).bind(
    demoId,
    url.pathname,
    request.headers.get('referer'),
    request.headers.get('cf-ipcountry'),
    request.headers.get('user-agent'),
  ).run();
}

function resolveSlug(url: URL, rootDomain: string): string | null {
  const hostname = url.hostname.toLowerCase();
  const suffix = `.${rootDomain.toLowerCase()}`;

  if (hostname.endsWith(suffix)) {
    const subdomain = hostname.slice(0, -suffix.length);
    if (!subdomain.includes('.') && !RESERVED.has(subdomain)) return normalizeSlug(subdomain);
  }

  if (hostname === 'localhost' || hostname.endsWith('.workers.dev')) {
    return normalizeSlug(url.searchParams.get('demo') ?? '');
  }

  return null;
}

function normalizeSlug(value: string): string {
  const slug = value.trim().toLowerCase();
  return /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(slug) ? slug : '';
}

function isExpired(value: string | null): boolean {
  return Boolean(value && new Date(value).getTime() <= Date.now());
}

function isAuthorized(request: Request, token: string): boolean {
  const auth = request.headers.get('authorization');
  return Boolean(token && auth === `Bearer ${token}`);
}

function pageHeaders(): HeadersInit {
  return {
    'Content-Type': 'text/html; charset=UTF-8',
    'Cache-Control': 'private, max-age=60',
    'X-Robots-Tag': 'noindex, nofollow, noarchive',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Content-Type-Options': 'nosniff',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Content-Security-Policy': "default-src 'none'; img-src https: data:; style-src 'unsafe-inline'; font-src https: data:; connect-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action https: mailto: tel:;",
  };
}

function json(value: unknown, status = 200): Response {
  return Response.json(value, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}

function notFound(message: string): Response {
  return new Response(`<!doctype html><html lang="hr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>NEPAR demo</title><body style="font-family:system-ui;background:#0b1020;color:#fff;display:grid;place-items:center;min-height:100vh;margin:0"><main style="text-align:center;padding:32px"><p style="opacity:.6;letter-spacing:.12em;text-transform:uppercase;font-size:12px">NEPAR demo</p><h1>${escapeHtml(message)}</h1><a href="https://nepar.hr" style="color:#91b7ff">nepar.hr</a></main></body></html>`, {
    status: 404,
    headers: pageHeaders(),
  });
}

function renderDemo(demo: DemoRow, content: DemoContent): string {
  const name = escapeHtml(demo.business_name);
  const accent = safeColor(content.accent);
  const heroImage = safeImageUrl(content.heroImage);
  const headline = escapeHtml(content.headline || `${demo.business_name} — moderno iskustvo za vaše klijente.`);
  const description = escapeHtml(content.description || 'Jasna ponuda, brz kontakt i prezentacija prilagođena mobitelu.');
  const primaryLabel = escapeHtml(content.primaryCta?.label || 'Kontaktirajte nas');
  const primaryHref = safeHref(content.primaryCta?.href || '#kontakt');
  const secondaryLabel = escapeHtml(content.secondaryCta?.label || 'Pogledajte usluge');
  const secondaryHref = safeHref(content.secondaryCta?.href || '#usluge');
  const services = (content.services || []).slice(0, 6);
  const stats = (content.stats || []).slice(0, 4);

  return `<!doctype html>
<html lang="hr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex,nofollow,noarchive">
  <title>${name} — demo web</title>
  <style>
    :root{--accent:${accent};--ink:#10131a;--muted:#667085;--paper:#f7f8fb;--line:rgba(16,19,26,.1)}
    *{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:var(--ink);background:#fff;line-height:1.5}
    a{color:inherit}.shell{width:min(1180px,calc(100% - 40px));margin:auto}.nav{height:84px;display:flex;align-items:center;justify-content:space-between}.brand{font-weight:850;letter-spacing:-.03em;font-size:22px}.navlinks{display:flex;gap:28px;align-items:center;font-size:14px}.navlinks a{text-decoration:none;color:#454b57}.btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 20px;border-radius:999px;text-decoration:none;font-weight:750;font-size:14px;border:1px solid transparent}.btn-primary{background:var(--ink);color:#fff}.btn-ghost{border-color:var(--line);background:rgba(255,255,255,.76);backdrop-filter:blur(10px)}
    .hero{position:relative;overflow:hidden;border-radius:34px;min-height:620px;background:linear-gradient(135deg,#f4f7ff 0%,#fff 45%,color-mix(in srgb,var(--accent) 13%,#fff) 100%);border:1px solid var(--line)}.hero-grid{display:grid;grid-template-columns:1.05fr .95fr;min-height:620px}.hero-copy{padding:86px 34px 70px 70px;display:flex;flex-direction:column;justify-content:center}.eyebrow{text-transform:uppercase;letter-spacing:.14em;font-weight:800;font-size:12px;color:#667085}.hero h1{font-size:clamp(48px,6vw,78px);line-height:.96;letter-spacing:-.065em;margin:18px 0 24px;max-width:820px}.lead{font-size:19px;color:#596170;max-width:640px;margin:0}.actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:34px}.visual{position:relative;min-height:520px;margin:34px;border-radius:26px;overflow:hidden;background:linear-gradient(145deg,color-mix(in srgb,var(--accent) 24%,#dfe8ff),#131824)}.visual.has-image{background-size:cover;background-position:center}.visual::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 36%,rgba(5,8,15,.55))}.visual-card{position:absolute;z-index:2;left:24px;right:24px;bottom:24px;padding:22px;border-radius:20px;background:rgba(255,255,255,.92);backdrop-filter:blur(14px);box-shadow:0 20px 60px rgba(7,12,25,.18)}.visual-card strong{display:block;font-size:18px}.visual-card span{font-size:14px;color:#667085}.glow{position:absolute;width:340px;height:340px;border-radius:50%;background:var(--accent);filter:blur(100px);opacity:.23;right:-90px;top:-90px}
    .stats{display:grid;grid-template-columns:repeat(4,1fr);border-bottom:1px solid var(--line);padding:44px 0}.stat{padding:8px 24px;border-right:1px solid var(--line)}.stat:first-child{padding-left:0}.stat:last-child{border-right:0}.stat strong{font-size:34px;letter-spacing:-.04em}.stat span{display:block;color:var(--muted);font-size:13px;margin-top:4px}
    section{padding:94px 0}.section-head{display:flex;align-items:end;justify-content:space-between;gap:32px;margin-bottom:34px}.kicker{font-size:12px;letter-spacing:.14em;text-transform:uppercase;font-weight:800;color:var(--muted)}h2{font-size:clamp(34px,4.5vw,58px);line-height:1;letter-spacing:-.055em;margin:10px 0 0;max-width:750px}.section-head p{max-width:440px;color:var(--muted)}.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.card{min-height:240px;padding:28px;border:1px solid var(--line);border-radius:24px;background:var(--paper);display:flex;flex-direction:column;justify-content:flex-end}.card .n{font-size:12px;color:var(--muted);margin-bottom:auto}.card h3{font-size:23px;letter-spacing:-.035em;margin:0 0 8px}.card p{color:var(--muted);margin:0;font-size:15px}.about{background:#11151d;color:#fff;border-radius:34px;padding:68px;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center}.about p{color:#aeb6c5;font-size:18px}.about h2{margin-top:0}.contact{padding-bottom:130px}.contact-box{border-radius:34px;background:linear-gradient(130deg,color-mix(in srgb,var(--accent) 18%,#f4f7ff),#fff);border:1px solid var(--line);padding:62px;display:grid;grid-template-columns:1.1fr .9fr;gap:50px}.details{display:grid;gap:10px;align-content:center}.detail{padding:16px 18px;background:rgba(255,255,255,.74);border:1px solid var(--line);border-radius:16px}.detail small{display:block;color:var(--muted);margin-bottom:4px}.demo-badge{position:fixed;z-index:20;right:16px;bottom:16px;text-decoration:none;background:#10131a;color:#fff;border-radius:999px;padding:11px 15px;font-size:12px;font-weight:750;box-shadow:0 10px 35px rgba(0,0,0,.18)}
    @media(max-width:900px){.shell{width:min(100% - 24px,720px)}.nav{height:70px}.navlinks>a:not(.btn){display:none}.hero{border-radius:24px}.hero-grid{grid-template-columns:1fr}.hero-copy{padding:60px 24px 24px}.hero h1{font-size:50px}.visual{min-height:430px;margin:12px}.stats{grid-template-columns:1fr 1fr}.stat{border-bottom:1px solid var(--line);padding:22px}.stat:nth-child(2){border-right:0}.cards{grid-template-columns:1fr}.section-head{display:block}.about,.contact-box{grid-template-columns:1fr;padding:34px;gap:28px}section{padding:68px 0}}
    @media(max-width:520px){.hero h1{font-size:43px}.hero-copy{padding-top:44px}.lead{font-size:17px}.visual{min-height:360px}.stats{grid-template-columns:1fr 1fr}.stat strong{font-size:27px}.about,.contact-box{border-radius:24px;padding:26px}.demo-badge{font-size:11px}}
  </style>
</head>
<body>
  <header class="shell nav">
    <div class="brand">${name}</div>
    <nav class="navlinks"><a href="#usluge">Usluge</a><a href="#o-nama">O nama</a><a href="#kontakt" class="btn btn-primary">Kontakt</a></nav>
  </header>

  <main>
    <section class="shell hero" style="padding:0">
      <div class="glow"></div>
      <div class="hero-grid">
        <div class="hero-copy">
          <div class="eyebrow">${escapeHtml(content.eyebrow || content.location || 'Vaša lokalna usluga')}</div>
          <h1>${headline}</h1>
          <p class="lead">${description}</p>
          <div class="actions"><a class="btn btn-primary" href="${primaryHref}">${primaryLabel}</a><a class="btn btn-ghost" href="${secondaryHref}">${secondaryLabel}</a></div>
        </div>
        <div class="visual${heroImage ? ' has-image' : ''}"${heroImage ? ` style="background-image:url('${escapeHtml(heroImage)}')"` : ''}>
          <div class="visual-card"><strong>${name}</strong><span>${escapeHtml(content.location || 'Jednostavan kontakt. Jasna ponuda. Mobile-first iskustvo.')}</span></div>
        </div>
      </div>
    </section>

    ${stats.length ? `<div class="shell stats">${stats.map((s) => `<div class="stat"><strong>${escapeHtml(s.value || '')}</strong><span>${escapeHtml(s.label || '')}</span></div>`).join('')}</div>` : ''}

    <section id="usluge" class="shell">
      <div class="section-head"><div><div class="kicker">Usluge</div><h2>${escapeHtml(content.proofTitle || 'Sve bitno, bez komplikacija.')}</h2></div><p>${escapeHtml(content.proofText || 'Ponuda je strukturirana tako da posjetitelj odmah razumije što nudite i kako vas može kontaktirati.')}</p></div>
      <div class="cards">${(services.length ? services : [{title:'Glavna usluga',description:'Jasno predstavljena ključna usluga.'},{title:'Brz kontakt',description:'Poziv ili upit dostupni bez traženja.'},{title:'Prilagođeno mobitelu',description:'Brzo i pregledno na svakom uređaju.'}]).map((s, i) => `<article class="card"><div class="n">0${i + 1}</div><h3>${escapeHtml(s.title || '')}</h3><p>${escapeHtml(s.description || '')}</p></article>`).join('')}</div>
    </section>

    <section id="o-nama" class="shell" style="padding-top:0"><div class="about"><div><div class="kicker" style="color:#7f899c">O nama</div><h2>${escapeHtml(content.aboutTitle || `Zašto ${demo.business_name}?`)}</h2></div><p>${escapeHtml(content.aboutText || 'Ovdje dolazi kratka, vjerodostojna priča o poslovanju, iskustvu i razlogu zbog kojeg bi klijent trebao odabrati upravo ovu tvrtku.')}</p></div></section>

    <section id="kontakt" class="shell contact"><div class="contact-box"><div><div class="kicker">Kontakt</div><h2>Spremni za sljedeći korak?</h2><p class="lead" style="margin-top:18px">Kontakt treba biti vidljiv, jednostavan i dostupan u jednom dodiru.</p><div class="actions"><a class="btn btn-primary" href="${primaryHref}">${primaryLabel}</a></div></div><div class="details">${contactDetail('Telefon', content.phone)}${contactDetail('E-mail', content.email)}${contactDetail('Adresa', content.address)}</div></div></section>
  </main>

  <a class="demo-badge" href="https://nepar.hr" rel="noopener">Demo koncept · NEPAR</a>
</body>
</html>`;
}

function contactDetail(label: string, value?: string): string {
  if (!value) return '';
  return `<div class="detail"><small>${escapeHtml(label)}</small><strong>${escapeHtml(value)}</strong></div>`;
}

function safeColor(value?: string): string {
  if (value && /^#[0-9a-f]{6}$/i.test(value)) return value;
  return '#5b7cff';
}

function safeImageUrl(value?: string): string {
  if (!value) return '';
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.href : '';
  } catch {
    return '';
  }
}

function safeHref(value: string): string {
  if (value.startsWith('#') || value.startsWith('/') || value.startsWith('tel:') || value.startsWith('mailto:')) {
    return escapeHtml(value);
  }
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? escapeHtml(url.href) : '#kontakt';
  } catch {
    return '#kontakt';
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
