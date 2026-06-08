const ALLOWED_ORIGINS = [
  "https://nepar.hr",
  "https://www.nepar.hr",
  "http://localhost:5173",
  "http://localhost:4173",
];

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

function normalizePath(value) {
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

function analyticsKey(path) {
  return `analytics:page:${encodeURIComponent(path)}`;
}

function analyticsDayKey(date, path) {
  return `analytics:day:${date}:${encodeURIComponent(path)}`;
}

function getClientIp(request) {
  return (
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ||
    ""
  );
}

function isOwnerIp(request, env) {
  const clientIp = getClientIp(request);
  const ownerIps = String(env.OWNER_IPS || "")
    .split(",")
    .map((ip) => ip.trim())
    .filter(Boolean);
  return Boolean(clientIp && ownerIps.includes(clientIp));
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

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

async function incrementStoredJson(kv, key, update) {
  const current = await kv.get(key, "json");
  const next = update(current);
  await kv.put(key, JSON.stringify(next));
  return next;
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

  const path = normalizePath(body.path || body.url);
  if (path === "/admin") {
    return json({ ok: true, skipped: true }, 200, origin);
  }

  const now = new Date().toISOString();
  const date = todayIso();
  const pageKey = analyticsKey(path);
  const dayKey = analyticsDayKey(date, path);
  const referrer = typeof body.referrer === "string" ? body.referrer.slice(0, 240) : "";
  const title = typeof body.title === "string" ? body.title.slice(0, 160) : "";
  const isOwner = body.ownerDevice === true || isOwnerIp(request, env);
  const ownerIncrement = isOwner ? 1 : 0;
  const visitorIncrement = isOwner ? 0 : 1;

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
  }));
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

  return json({
    generatedAt: new Date().toISOString(),
    requesterIp: getClientIp(request),
    totals: {
      pages: pages.length,
      visits: pages.reduce((sum, page) => sum + (page.total || 0), 0),
      ownerVisits: pages.reduce((sum, page) => sum + (page.ownerTotal || 0), 0),
      visitorVisits: pages.reduce((sum, page) => sum + (
        page.visitorTotal ?? Math.max(0, (page.total || 0) - (page.ownerTotal || 0))
      ), 0),
    },
    pages,
    daily,
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

  const { name, email, subject, message, image, imageName } = body;

  if (!name || !email || !message) {
    return json({ error: "Missing required fields" }, 400, origin);
  }

  const attachments = image
    ? [{ filename: imageName || "prilog.jpg", content: image }]
    : [];

  const subjectLine = subject || "Upit s web stranice";
  const textBody = `Ime: ${name}\nE-mail: ${email}\nTema: ${subjectLine}\n\nPoruka:\n${message}`;
  const htmlBody = `
    <p><strong>Ime:</strong> ${name}</p>
    <p><strong>E-mail:</strong> <a href="mailto:${email}">${email}</a></p>
    <p><strong>Tema:</strong> ${subjectLine}</p>
    <hr/>
    <p style="white-space:pre-wrap">${message}</p>
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

    return handleContact(request, env, origin);
  },
};
