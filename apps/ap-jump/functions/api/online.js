const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

function getDb(context) {
  return context.env?.DB ?? null;
}

function validateSessionId(value) {
  const id = String(value ?? '').trim();
  if (!/^[A-Za-z0-9_-]{12,80}$/.test(id)) return null;
  return id;
}

async function ensureSchema(db) {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS active_players (
      session_id TEXT PRIMARY KEY,
      last_seen INTEGER NOT NULL
    )
  `).run();
  await db.prepare(`CREATE INDEX IF NOT EXISTS idx_active_players_last_seen ON active_players(last_seen)`).run();
}

async function countOnline(db, now) {
  const cutoff = now - 45;
  await db.prepare('DELETE FROM active_players WHERE last_seen < ?').bind(cutoff).run();
  const row = await db.prepare('SELECT COUNT(*) AS count FROM active_players WHERE last_seen >= ?').bind(cutoff).first();
  return Number(row?.count ?? 0);
}

export async function onRequestGet(context) {
  const db = getDb(context);
  if (!db) return json({ error: 'D1 binding DB nije konfiguriran.' }, 503);
  try {
    await ensureSchema(db);
    const now = Math.floor(Date.now() / 1000);
    return json({ online: await countOnline(db, now) });
  } catch (error) {
    console.error('Online GET failed', error);
    return json({ error: 'Online brojač nije dostupan.' }, 500);
  }
}

export async function onRequestPost(context) {
  const db = getDb(context);
  if (!db) return json({ error: 'D1 binding DB nije konfiguriran.' }, 503);

  let body;
  try {
    body = await context.request.json();
  } catch {
    return json({ error: 'Neispravan zahtjev.' }, 400);
  }

  const sessionId = validateSessionId(body?.sessionId);
  if (!sessionId) return json({ error: 'Neispravna sesija.' }, 400);

  try {
    await ensureSchema(db);
    const now = Math.floor(Date.now() / 1000);
    await db.prepare(`
      INSERT INTO active_players (session_id, last_seen)
      VALUES (?, ?)
      ON CONFLICT(session_id) DO UPDATE SET last_seen = excluded.last_seen
    `).bind(sessionId, now).run();
    return json({ online: await countOnline(db, now) });
  } catch (error) {
    console.error('Online POST failed', error);
    return json({ error: 'Online brojač nije dostupan.' }, 500);
  }
}
