import * as dns from "node:dns/promises";

const ALLOWED_ORIGINS = [
  "https://nepar.hr",
  "https://www.nepar.hr",
  "http://localhost:5173",
  "http://localhost:4173",
];
const ANALYTICS_RETENTION_MONTHS = 14;
const ATTRIBUTION_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f-\u009f]/g;

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Content-Type": "application/json",
  };
}

function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders(origin),
  });
}

const DIGITAL_PRICE_LIST_MAX_HTML_BYTES = 2 * 1024 * 1024;
const DIGITAL_PRICE_LIST_MAX_DOCUMENT_BYTES = 128 * 1024;
const DIGITAL_PRICE_LIST_TIMEOUT_MS = 8000;
const DIGITAL_PRICE_LIST_MAX_REDIRECTS = 3;
const DIGITAL_PRICE_LIST_MAX_CANDIDATES = 10;
const DIGITAL_PRICE_LIST_METADATA_HOSTS = new Set([
  "metadata.google.internal", "metadata", "instance-data", "instance-data.ec2.internal",
]);

function digitalPriceListResult(status, message, details = {}) {
  return { status, message, details: { reachable: false, https: false, csvFound: false, xmlFound: false, pricePageFound: false, csvUrl: null, xmlUrl: null, pricePageUrl: null, ...details } };
}

function normalizedHostname(hostname) {
  return String(hostname || "").replace(/^\[|\]$/g, "").replace(/\.$/, "").toLowerCase();
}

export function isForbiddenIp(address) {
  const value = normalizedHostname(address);
  if (!value) return true;
  const ipv4 = value.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4) {
    const octets = ipv4.slice(1).map(Number);
    if (octets.some((part) => part > 255)) return true;
    const [a, b] = octets;
    return a === 0 || a === 10 || a === 127 || (a === 100 && b >= 64 && b <= 127)
      || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31)
      || (a === 192 && b === 168) || (a === 192 && b === 0)
      || (a === 198 && (b === 18 || b === 19)) || a >= 224;
  }
  if (!value.includes(":")) return false;
  if (value === "::" || value === "::1" || value.startsWith("fc") || value.startsWith("fd")) return true;
  if (/^fe[89ab]/.test(value)) return true;
  const mapped = value.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  return Boolean(mapped && isForbiddenIp(mapped[1]));
}

export function isForbiddenHostname(hostname) {
  const host = normalizedHostname(hostname);
  return !host || host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local")
    || host.endsWith(".internal") || DIGITAL_PRICE_LIST_METADATA_HOSTS.has(host) || isForbiddenIp(host);
}

export function normalizeDigitalPriceListUrl(value) {
  if (typeof value !== "string" || !value.trim() || value.trim().length > 2048) throw new Error("invalid_url");
  const raw = value.trim();
  const candidate = /^[a-z][a-z\d+.-]*:/i.test(raw) ? raw : `https://${raw}`;
  let url;
  try { url = new URL(candidate); } catch { throw new Error("invalid_url"); }
  if (!/^https?:$/.test(url.protocol) || url.username || url.password || isForbiddenHostname(url.hostname)) throw new Error("invalid_url");
  return url;
}

function dnsResolverFor(env) { return env?.DIGITAL_PRICE_LIST_DNS_RESOLVER || dns; }

export async function resolvePublicHostname(hostname, resolver = dns) {
  const host = normalizedHostname(hostname);
  if (isForbiddenHostname(host)) throw new Error("blocked_destination");
  const responses = await Promise.allSettled([resolver.resolve4(host), resolver.resolve6(host)]);
  const addresses = responses.flatMap((entry) => (entry.status === "fulfilled" && Array.isArray(entry.value) ? entry.value : []));
  if (!addresses.length) throw new Error("dns_unavailable");
  if (addresses.some((address) => isForbiddenIp(address))) throw new Error("blocked_destination");
  return addresses;
}

async function assertPublicDigitalPriceListUrl(url, env, dnsCache) {
  if (!/^https?:$/.test(url.protocol) || url.username || url.password || isForbiddenHostname(url.hostname)) throw new Error("blocked_destination");
  const host = normalizedHostname(url.hostname);
  if (!dnsCache.has(host)) dnsCache.set(host, resolvePublicHostname(host, dnsResolverFor(env)));
  await dnsCache.get(host);
}

async function readResponseLimit(response, maxBytes) {
  if (!response.body) return "";
  const reader = response.body.getReader();
  const chunks = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) { await reader.cancel(); throw new Error("response_too_large"); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const output = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) { output.set(chunk, offset); offset += chunk.byteLength; }
  return new TextDecoder().decode(output);
}

function isRedirect(response) { return [301, 302, 303, 307, 308].includes(response.status); }

async function safeDigitalPriceListFetch(initialUrl, env, dnsCache, signal) {
  let current = initialUrl instanceof URL ? initialUrl : new URL(initialUrl);
  for (let redirects = 0; redirects <= DIGITAL_PRICE_LIST_MAX_REDIRECTS; redirects += 1) {
    await assertPublicDigitalPriceListUrl(current, env, dnsCache);
    const response = await fetch(current.href, { method: "GET", redirect: "manual", cache: "no-store", signal, headers: { Accept: "text/html,application/xml,text/xml,text/csv,*/*;q=0.1" } });
    if (!isRedirect(response)) return { response, url: current };
    if (redirects === DIGITAL_PRICE_LIST_MAX_REDIRECTS) throw new Error("too_many_redirects");
    const location = response.headers.get("Location");
    if (!location) throw new Error("invalid_redirect");
    current = new URL(location, current);
  }
  throw new Error("too_many_redirects");
}

function extractDigitalPriceListLinks(html, baseUrl) {
  const results = [];
  const anchorPattern = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = anchorPattern.exec(html)) && results.length < DIGITAL_PRICE_LIST_MAX_CANDIDATES - 4) {
    const href = match[1].match(/\bhref\s*=\s*["']([^"']+)["']/i)?.[1];
    if (!href) continue;
    let url;
    try { url = new URL(href, baseUrl); } catch { continue; }
    if (url.origin !== baseUrl.origin || !/^https?:$/.test(url.protocol)) continue;
    const lowerHref = href.toLowerCase();
    const text = match[2].replace(/<[^>]+>/g, " ").toLowerCase();
    const isCsv = /\.csv(?:$|[?#])/.test(lowerHref);
    const isXml = /\.xml(?:$|[?#])/.test(lowerHref);
    if (isCsv || isXml || /(cjenik|cijene|price)/.test(`${lowerHref} ${text}`)) results.push({ url, kind: isCsv ? "csv" : isXml ? "xml" : "price" });
  }
  return results;
}

function documentLooksValid(kind, body, contentType) {
  const trimmed = body.trim();
  return kind === "csv" ? Boolean(trimmed) : Boolean(trimmed) && (/(?:application|text)\/xml/i.test(contentType || "") || /^<\?xml\b/i.test(trimmed));
}

async function handleDigitalPriceListCheck(request, env, origin) {
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405, origin);
  const body = await parseInternalJson(request, 4096);
  if (!body || typeof body.url !== "string") return json(digitalPriceListResult("red", "Unesite ispravnu adresu web stranice."), 400, origin);
  let initialUrl;
  try { initialUrl = normalizeDigitalPriceListUrl(body.url); } catch { return json(digitalPriceListResult("red", "Unesite ispravnu adresu web stranice."), 400, origin); }
  const dnsCache = new Map();
  const signal = AbortSignal.timeout(DIGITAL_PRICE_LIST_TIMEOUT_MS);
  let homepage;
  try {
    homepage = await safeDigitalPriceListFetch(initialUrl, env, dnsCache, signal);
    if (!homepage.response.ok) throw new Error("homepage_unavailable");
  } catch (error) {
    const blocked = error?.message === "blocked_destination";
    return json(digitalPriceListResult("red", blocked ? "Unesite ispravnu adresu web stranice." : "Nismo uspjeli dohvatiti web stranicu."), blocked ? 400 : 200, origin);
  }
  let html;
  try { html = await readResponseLimit(homepage.response, DIGITAL_PRICE_LIST_MAX_HTML_BYTES); } catch { return json(digitalPriceListResult("red", "Nismo uspjeli dohvatiti web stranicu."), 200, origin); }
  const candidates = [...extractDigitalPriceListLinks(html, homepage.url), { url: new URL("/cjenik.csv", homepage.url.origin), kind: "csv" }, { url: new URL("/cjenik.xml", homepage.url.origin), kind: "xml" }, { url: new URL("/cjenik/", homepage.url.origin), kind: "price" }, { url: new URL("/cjenici/", homepage.url.origin), kind: "price" }];
  const unique = [];
  const seen = new Set();
  for (const candidate of candidates) {
    const key = `${candidate.kind}:${candidate.url.href}`;
    if (!seen.has(key) && unique.length < DIGITAL_PRICE_LIST_MAX_CANDIDATES) { seen.add(key); unique.push(candidate); }
  }
  const details = { reachable: true, https: homepage.url.protocol === "https:", csvFound: false, xmlFound: false, pricePageFound: false, csvUrl: null, xmlUrl: null, pricePageUrl: null };
  for (const candidate of unique) {
    if (signal.aborted) break;
    try {
      const fetched = await safeDigitalPriceListFetch(candidate.url, env, dnsCache, signal);
      if (!fetched.response.ok) continue;
      if (candidate.kind === "price") { details.pricePageFound = true; details.pricePageUrl ||= fetched.url.href; continue; }
      const documentBody = await readResponseLimit(fetched.response, DIGITAL_PRICE_LIST_MAX_DOCUMENT_BYTES);
      if (!documentLooksValid(candidate.kind, documentBody, fetched.response.headers.get("Content-Type"))) continue;
      details.pricePageFound = true;
      if (candidate.kind === "csv") { details.csvFound = true; details.csvUrl ||= fetched.url.href; }
      else { details.xmlFound = true; details.xmlUrl ||= fetched.url.href; }
    } catch { /* An inaccessible candidate does not invalidate a fetched homepage. */ }
  }
  if (details.csvFound || details.xmlFound) return json(digitalPriceListResult("green", "Na web stranici pronađen je javno dostupan CSV ili XML dokument.", details), 200, origin);
  if (details.pricePageFound) return json(digitalPriceListResult("yellow", "Na stranici postoje informacije o cijenama ili cjeniku, ali automatska provjera nije pronašla javno dostupan XML ili CSV dokument.", details), 200, origin);
  return json(digitalPriceListResult("red", "Automatska provjera nije pronašla javno dostupan XML ili CSV cjenik.", details), 200, origin);
}

function internalTokenMatches(request, env) {
  const expected = typeof env.KIDS_SERVICE_TOKEN === "string" ? env.KIDS_SERVICE_TOKEN : "";
  const supplied = request.headers.get("X-Nepar-Internal-Token") || "";
  if (!expected || !supplied || expected.length !== supplied.length) return false;
  let mismatch = 0;
  for (let index = 0; index < expected.length; index += 1) {
    mismatch |= expected.charCodeAt(index) ^ supplied.charCodeAt(index);
  }
  return mismatch === 0;
}

async function parseInternalJson(request, maxBytes = 120000) {
  const contentLength = Number(request.headers.get("Content-Length") || "0");
  if (contentLength > maxBytes) return null;
  try {
    const body = await request.text();
    if (new TextEncoder().encode(body).byteLength > maxBytes) return null;
    return JSON.parse(body);
  } catch {
    return null;
  }
}

async function handleKidsOpenAI(request, env, origin) {
  if (!internalTokenMatches(request, env)) return json({ error: "Unauthorized" }, 401, origin);
  const body = await parseInternalJson(request);
  if (!body || typeof body !== "object" || Array.isArray(body)) return json({ error: "Invalid JSON" }, 400, origin);
  if (!env.OPENAI_API_KEY) return json({ error: "OpenAI is not configured" }, 503, origin);

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const responseBody = await response.text();
  return new Response(responseBody, {
    status: response.status,
    headers: { "Content-Type": response.headers.get("Content-Type") || "application/json" },
  });
}

async function handleKidsEmail(request, env, origin) {
  if (!internalTokenMatches(request, env)) return json({ error: "Unauthorized" }, 401, origin);
  if (!env.RESEND_API_KEY) return json({ error: "Resend is not configured" }, 503, origin);
  const body = await parseInternalJson(request, 180000);
  if (!body || typeof body !== "object" || Array.isArray(body)) return json({ error: "Invalid JSON" }, 400, origin);
  const to = Array.isArray(body.to) ? body.to.filter((value) => typeof value === "string" && value.length <= 240) : [];
  const subject = typeof body.subject === "string" ? body.subject.slice(0, 240) : "";
  const html = typeof body.html === "string" ? body.html.slice(0, 160000) : "";
  if (!to.length || !subject || !html) return json({ error: "Invalid email payload" }, 400, origin);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY || ""}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.KIDS_EMAIL_FROM || "NEPAR Kids <orders@kids.nepar.hr>",
      to,
      ...(typeof body.reply_to === "string" && body.reply_to ? { reply_to: body.reply_to.slice(0, 240) } : {}),
      subject,
      html,
    }),
  });
  const responseBody = await response.text();
  return new Response(responseBody || JSON.stringify({ ok: response.ok }), {
    status: response.status,
    headers: { "Content-Type": response.headers.get("Content-Type") || "application/json" },
  });
}

export function normalizeAnalyticsPath(value) {
  if (typeof value !== "string") return "/";
  try {
    const url = value.startsWith("http")
      ? new URL(value)
      : new URL(value, "https://nepar.hr");
    return url.pathname === "" ? "/" : url.pathname;
  } catch {
    return value.startsWith("/") ? value.split("?")[0].split("#")[0] : "/";
  }
}

export function normalizeAnalyticsReferrer(value) {
  if (typeof value !== "string" || !value) return "";
  try {
    const url = new URL(value, "https://nepar.hr");
    if (!/^https?:$/.test(url.protocol)) return "";
    return `${url.origin}${url.pathname}`.slice(0, 240);
  } catch {
    return "";
  }
}

export function sanitizeAttributionValue(value) {
  if (typeof value !== "string") return "";
  const withoutControls = [...value.trim()].filter((character) => {
    const code = character.charCodeAt(0);
    return code > 31 && (code < 127 || code > 159);
  }).join("");
  return withoutControls.slice(0, 160);
}

export function sanitizeAttribution(value, formName = "") {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const attribution = {};
  for (const key of ATTRIBUTION_KEYS) {
    const sanitized = sanitizeAttributionValue(source[key]);
    if (sanitized) attribution[key] = sanitized;
  }
  if (formName === "web_landing") attribution.landing_path = "/web";
  return attribution;
}

function sanitizeContactText(value, maxLength) {
  return typeof value === "string"
    ? value.trim().replace(CONTROL_CHARACTERS, "").slice(0, maxLength)
    : "";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function addCalendarMonthsExpiration(value = new Date(), months = ANALYTICS_RETENTION_MONTHS) {
  const source = value instanceof Date ? new Date(value.getTime()) : new Date(value);
  if (Number.isNaN(source.getTime())) throw new TypeError("A valid date is required");

  const totalMonths = source.getUTCFullYear() * 12 + source.getUTCMonth() + months;
  const targetYear = Math.floor(totalMonths / 12);
  const targetMonth = ((totalMonths % 12) + 12) % 12;
  const lastDay = new Date(Date.UTC(targetYear, targetMonth + 1, 0)).getUTCDate();
  const targetDay = Math.min(source.getUTCDate(), lastDay);
  const target = new Date(Date.UTC(
    targetYear,
    targetMonth,
    targetDay,
    source.getUTCHours(),
    source.getUTCMinutes(),
    source.getUTCSeconds(),
    source.getUTCMilliseconds(),
  ));
  return Math.floor(target.getTime() / 1000);
}

function analyticsKey(path) {
  return `analytics:page:${encodeURIComponent(path)}`;
}

function analyticsDayKey(date, path) {
  return `analytics:day:${date}:${encodeURIComponent(path)}`;
}

function analyticsVisitorKey(visitorId) {
  return `analytics:visitor:${encodeURIComponent(visitorId)}`;
}

function analyticsDayVisitorKey(date, visitorId) {
  return `analytics:dayvisitor:${date}:${encodeURIComponent(visitorId)}`;
}

function getClientIp(request) {
  return (
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ||
    ""
  );
}

async function addToIndex(kv, key, value) {
  const current = await kv.get(key, "json");
  const next = Array.isArray(current) ? current : [];
  if (!next.includes(value)) {
    next.push(value);
    await kv.put(key, JSON.stringify(next));
  }
}

function getBasicAuth(request) {
  const header = request.headers.get("Authorization") || "";
  const [scheme, encoded] = header.split(" ");
  if (scheme !== "Basic" || !encoded) return null;

  try {
    const [username, ...passwordParts] = atob(encoded).split(":");
    return { username, password: passwordParts.join(":") };
  } catch {
    return null;
  }
}

async function timingSafeEqual(a, b) {
  const encoder = new TextEncoder();
  const left = encoder.encode(a);
  const right = encoder.encode(b);
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let i = 0; i < left.length; i += 1) {
    diff |= left[i] ^ right[i];
  }
  return diff === 0;
}

async function requireAdmin(request, env) {
  const auth = getBasicAuth(request);
  if (!auth) return false;

  const username = env.ADMIN_USER || "nepar";
  const password = env.ADMIN_PASS || "admin123";
  const userOk = await timingSafeEqual(auth.username, username);
  const passOk = await timingSafeEqual(auth.password, password);
  return userOk && passOk;
}

async function incrementStoredJson(kv, key, update, options) {
  const current = await kv.get(key, "json");
  const next = update(current);
  await kv.put(key, JSON.stringify(next), options);
  return next;
}

function normalizeDevice(value) {
  return ["desktop", "mobile", "tablet"].includes(value) ? value : "unknown";
}

function sourceFromReferrer(referrer) {
  if (!referrer) return "Direct";
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "").toLowerCase();
    if (host.includes("google.")) return "Google";
    if (host.includes("facebook.") || host.includes("fb.")) return "Facebook";
    if (host.includes("instagram.")) return "Instagram";
    if (host.includes("linkedin.")) return "LinkedIn";
    if (host.includes("nepar.hr")) return "Nepar";
    return host;
  } catch {
    return "Other";
  }
}

async function appendRecentEvent(kv, event, expiration) {
  const key = "analytics:recent";
  const current = await kv.get(key, "json");
  const next = Array.isArray(current) ? current : [];
  next.unshift(event);
  const nowSeconds = Math.floor(Date.now() / 1000);
  const retained = next
    .filter((item) => {
      if (typeof item?.at !== "string") return false;
      try {
        return addCalendarMonthsExpiration(item?.at) > nowSeconds;
      } catch {
        return false;
      }
    })
    .slice(0, 50);
  await kv.put(key, JSON.stringify(retained), { expiration });
}

async function handlePageview(request, env, origin) {
  if (!env.ANALYTICS) {
    return json({ error: "Analytics storage is not configured" }, 500, origin);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400, origin);
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return json({ error: "Invalid JSON" }, 400, origin);
  }

  const path = normalizeAnalyticsPath(body.path || body.url);
  if (path === "/admin") {
    return json({ ok: true, skipped: true }, 200, origin);
  }

  const nowDate = new Date();
  const now = nowDate.toISOString();
  const expiration = addCalendarMonthsExpiration(nowDate);
  const date = now.slice(0, 10);
  const pageKey = analyticsKey(path);
  const dayKey = analyticsDayKey(date, path);
  const referrer = normalizeAnalyticsReferrer(body.referrer);
  const title = typeof body.title === "string" ? body.title.slice(0, 160) : "";
  const isOwner = body.ownerDevice === true;
  const ownerIncrement = isOwner ? 1 : 0;
  const visitorIncrement = isOwner ? 0 : 1;
  const rawVisitorId = typeof body.visitorId === "string" ? body.visitorId.slice(0, 80) : "";
  const visitorId = /^[a-f0-9-]{16,80}$/i.test(rawVisitorId) ? rawVisitorId : "";
  const device = normalizeDevice(body.device);
  const attribution = sanitizeAttribution(body.attribution);
  const source = attribution.utm_source || sourceFromReferrer(referrer);

  const page = await incrementStoredJson(env.ANALYTICS, pageKey, (current) => ({
    path,
    title: title || current?.title || path,
    total: (current?.total || 0) + 1,
    ownerTotal: (current?.ownerTotal || 0) + ownerIncrement,
    visitorTotal: (current?.visitorTotal || current?.otherTotal || 0) + visitorIncrement,
    firstSeen: current?.firstSeen || now,
    lastSeen: now,
    referrers: {
      ...(current?.referrers || {}),
      ...(referrer ? { [referrer]: ((current?.referrers || {})[referrer] || 0) + 1 } : {}),
    },
  }));

  await incrementStoredJson(env.ANALYTICS, dayKey, (current) => ({
    path,
    date,
    total: (current?.total || 0) + 1,
    ownerTotal: (current?.ownerTotal || 0) + ownerIncrement,
    visitorTotal: (current?.visitorTotal || current?.otherTotal || 0) + visitorIncrement,
  }), { expiration });
  await incrementStoredJson(env.ANALYTICS, "analytics:meta", (current) => ({
    total: (current?.total || 0) + 1,
    sources: {
      ...(current?.sources || {}),
      [source]: ((current?.sources || {})[source] || 0) + 1,
    },
    devices: {
      ...(current?.devices || {}),
      [device]: ((current?.devices || {})[device] || 0) + 1,
    },
  }));
  if (visitorId) {
    await incrementStoredJson(env.ANALYTICS, analyticsVisitorKey(visitorId), (current) => ({
      visitorId,
      firstSeen: current?.firstSeen || now,
      lastSeen: now,
    }), { expiration });
    await env.ANALYTICS.put(analyticsDayVisitorKey(date, visitorId), JSON.stringify({
      visitorId,
      date,
    }), { expiration });
  }
  await appendRecentEvent(env.ANALYTICS, {
    at: now,
    path,
    title: title || path,
    referrer,
    source,
    device,
    owner: isOwner,
    attribution,
  }, expiration);
  await addToIndex(env.ANALYTICS, "analytics:index:pages", path);
  await addToIndex(env.ANALYTICS, "analytics:index:days", `${date}|${path}`);

  return json({
    ok: true,
    page: {
      path: page.path,
      total: page.total,
      ownerTotal: page.ownerTotal || 0,
      visitorTotal: page.visitorTotal || 0,
    },
  }, 200, origin);
}

async function listJson(kv, prefix) {
  const items = [];
  let cursor;
  do {
    const listed = await kv.list({ prefix, cursor });
    const values = await Promise.all(listed.keys.map((entry) => kv.get(entry.name, "json")));
    for (const value of values) {
      if (value) items.push(value);
    }
    cursor = listed.list_complete ? undefined : listed.cursor;
  } while (cursor);
  return items;
}

async function listKeys(kv, prefix) {
  const keys = [];
  let cursor;
  do {
    const listed = await kv.list({ prefix, cursor });
    keys.push(...listed.keys.map((entry) => entry.name));
    cursor = listed.list_complete ? undefined : listed.cursor;
  } while (cursor);
  return keys;
}

async function handleAnalyticsReset(request, env, origin) {
  if (!(await requireAdmin(request, env))) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: {
        ...corsHeaders(origin),
        "WWW-Authenticate": 'Basic realm="Nepar admin"',
      },
    });
  }

  if (!env.ANALYTICS) {
    return json({ error: "Analytics storage is not configured" }, 500, origin);
  }

  const keys = await listKeys(env.ANALYTICS, "analytics:");
  await Promise.all(keys.map((key) => env.ANALYTICS.delete(key)));

  return json({ ok: true, deleted: keys.length }, 200, origin);
}

async function handleAnalyticsSummary(request, env, origin) {
  if (!(await requireAdmin(request, env))) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: {
        ...corsHeaders(origin),
        "WWW-Authenticate": 'Basic realm="Nepar admin"',
      },
    });
  }

  if (!env.ANALYTICS) {
    return json({ error: "Analytics storage is not configured" }, 500, origin);
  }

  const pageIndex = await env.ANALYTICS.get("analytics:index:pages", "json");
  const dayIndex = await env.ANALYTICS.get("analytics:index:days", "json");

  const indexedPages = Array.isArray(pageIndex)
    ? await Promise.all(pageIndex.map((path) => env.ANALYTICS.get(analyticsKey(path), "json")))
    : [];
  const indexedDaily = Array.isArray(dayIndex)
    ? await Promise.all(dayIndex.map((entry) => {
        const [date, path] = String(entry).split("|");
        return env.ANALYTICS.get(analyticsDayKey(date, path), "json");
      }))
    : [];

  const listedPages = await listJson(env.ANALYTICS, "analytics:page:");
  const listedDaily = await listJson(env.ANALYTICS, "analytics:day:");
  const visitors = await listJson(env.ANALYTICS, "analytics:visitor:");
  const dayVisitors = await listJson(env.ANALYTICS, "analytics:dayvisitor:");
  const meta = await env.ANALYTICS.get("analytics:meta", "json") || {};
  const recent = await env.ANALYTICS.get("analytics:recent", "json") || [];
  const pageMap = new Map();
  const dayMap = new Map();

  for (const page of [...indexedPages, ...listedPages]) {
    if (page?.path) pageMap.set(page.path, page);
  }

  for (const day of [...indexedDaily, ...listedDaily]) {
    if (day?.path && day?.date) dayMap.set(`${day.date}|${day.path}`, day);
  }

  const pages = [...pageMap.values()].sort((a, b) => (b.total || 0) - (a.total || 0));
  const daily = [...dayMap.values()]
    .sort((a, b) => `${b.date}:${b.path}`.localeCompare(`${a.date}:${a.path}`));
  const trendMap = new Map();
  const uniqueByDay = new Map();

  for (const row of daily) {
    const current = trendMap.get(row.date) || { date: row.date, total: 0, ownerTotal: 0, visitorTotal: 0 };
    current.total += row.total || 0;
    current.ownerTotal += row.ownerTotal || 0;
    current.visitorTotal += row.visitorTotal ?? Math.max(0, (row.total || 0) - (row.ownerTotal || 0));
    trendMap.set(row.date, current);
  }

  for (const row of dayVisitors) {
    if (!row?.date || !row?.visitorId) continue;
    const set = uniqueByDay.get(row.date) || new Set();
    set.add(row.visitorId);
    uniqueByDay.set(row.date, set);
  }

  const trend = [...trendMap.values()]
    .map((row) => ({ ...row, uniqueVisitors: uniqueByDay.get(row.date)?.size || 0 }))
    .sort((a, b) => a.date.localeCompare(b.date));
  const sources = Object.entries(meta.sources || {})
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total);
  const devices = Object.entries(meta.devices || {})
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total);

  return json({
    generatedAt: new Date().toISOString(),
    requesterIp: getClientIp(request),
    totals: {
      pages: pages.length,
      visits: pages.reduce((sum, page) => sum + (page.total || 0), 0),
      uniqueVisitors: new Set(visitors.map((visitor) => visitor?.visitorId).filter(Boolean)).size,
      ownerVisits: pages.reduce((sum, page) => sum + (page.ownerTotal || 0), 0),
      visitorVisits: pages.reduce((sum, page) => sum + (
        page.visitorTotal ?? Math.max(0, (page.total || 0) - (page.ownerTotal || 0))
      ), 0),
    },
    pages,
    daily,
    trend,
    trend7: trend.slice(-7),
    trend30: trend.slice(-30),
    sources,
    devices,
    recent: Array.isArray(recent) ? recent : [],
  }, 200, origin);
}

async function handleContact(request, env, origin) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405, origin);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400, origin);
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return json({ error: "Invalid JSON" }, 400, origin);
  }

  const formName = sanitizeContactText(body.formName, 80);
  const name = sanitizeContactText(body.name, 120);
  const email = sanitizeContactText(body.email, 254);
  const phone = sanitizeContactText(body.phone, 40);
  const website = sanitizeContactText(body.website, 300);
  const platform = sanitizeContactText(body.platform, 80);
  const businessProgram = sanitizeContactText(body.businessProgram, 160);
  const leadSource = formName === "digitalni_cjenik" ? "digitalni-cjenik" : "";
  const subject = sanitizeContactText(body.subject, 240);
  const message = sanitizeContactText(body.message, 4000);
  const image = body.image;
  const imageName = sanitizeContactText(body.imageName, 180);
  const attribution = sanitizeAttribution(body.attribution, formName);

  if (!name || !email || !message || !/^\S+@\S+\.\S+$/.test(email)) {
    return json({ error: "Missing required fields" }, 400, origin);
  }

  if (!env.RESEND_API_KEY) return json({ error: "Email delivery is not configured" }, 503, origin);

  const attachments = image
    ? [{ filename: imageName || "prilog.jpg", content: image }]
    : [];

  const subjectLine = subject || "Upit s web stranice";
  const attributionLines = Object.entries(attribution).map(([key, value]) => `${key}: ${value}`);
  const textBody = [
    `Ime: ${name}`,
    `E-mail: ${email}`,
    ...(phone ? [`Telefon: ${phone}`] : []),
    ...(website ? [`Web stranica: ${website}`] : []),
    ...(platform ? [`Platforma: ${platform}`] : []),
    ...(businessProgram ? [`Poslovni program: ${businessProgram}`] : []),
    ...(leadSource ? [`lead_source: ${leadSource}`] : []),
    `Tema: ${subjectLine}`,
    "",
    "Poruka:",
    message,
    ...(attributionLines.length ? ["", "Atribucija:", ...attributionLines] : []),
  ].join("\n");
  const attributionHtml = Object.entries(attribution)
    .map(([key, value]) => `<li><strong>${escapeHtml(key)}:</strong> ${escapeHtml(value)}</li>`)
    .join("");
  const htmlBody = `
    <p><strong>Ime:</strong> ${escapeHtml(name)}</p>
    <p><strong>E-mail:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
    ${phone ? `<p><strong>Telefon:</strong> ${escapeHtml(phone)}</p>` : ""}
    ${website ? `<p><strong>Web stranica:</strong> ${escapeHtml(website)}</p>` : ""}
    ${platform ? `<p><strong>Platforma:</strong> ${escapeHtml(platform)}</p>` : ""}
    ${businessProgram ? `<p><strong>Poslovni program:</strong> ${escapeHtml(businessProgram)}</p>` : ""}
    ${leadSource ? `<p><strong>lead_source:</strong> ${leadSource}</p>` : ""}
    <p><strong>Tema:</strong> ${escapeHtml(subjectLine)}</p>
    <hr/>
    <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
    ${attributionHtml ? `<hr/><p><strong>Atribucija:</strong></p><ul>${attributionHtml}</ul>` : ""}
  `.trim();

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Nepar Web Forma <forma@nepar.hr>",
      to: ["nepar@nepar.hr"],
      reply_to: email,
      subject: subjectLine,
      text: textBody,
      html: htmlBody,
      attachments,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return json({ error: err }, 502, origin);
  }

  return json({ ok: true }, 200, origin);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (url.pathname === "/analytics/pageview" && request.method === "POST") {
      return handlePageview(request, env, origin);
    }

    if (url.pathname === "/analytics/summary" && request.method === "GET") {
      return handleAnalyticsSummary(request, env, origin);
    }

    if (url.pathname === "/analytics/reset" && request.method === "POST") {
      return handleAnalyticsReset(request, env, origin);
    }

    if (url.pathname === "/api/digitalni-cjenik/check") {
      return handleDigitalPriceListCheck(request, env, origin);
    }

    if (url.pathname === "/internal/kids/openai" && request.method === "POST") {
      return handleKidsOpenAI(request, env, origin);
    }

    if (url.pathname === "/internal/kids/email" && request.method === "POST") {
      return handleKidsEmail(request, env, origin);
    }

    return handleContact(request, env, origin);
  },
};
