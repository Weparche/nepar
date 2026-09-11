const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

function normalizeUsername(value) {
  return String(value ?? '').trim().replace(/\s+/g, ' ');
}

function validateUsername(value) {
  const username = normalizeUsername(value);
  const length = Array.from(username).length;
  if (length < 2 || length > 20) return null;
  if (!/^[\p{L}\p{N} _.-]+$/u.test(username)) return null;
  return username;
}

function validateScore(value) {
  const score = Number(value);
  if (!Number.isInteger(score) || score < 0 || score > 100000) return null;
  return score;
}

function zagrebDay() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Zagreb',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

async function ensureSchema(db) {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS leaderboard (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL COLLATE NOCASE UNIQUE,
      score INTEGER NOT NULL DEFAULT 0 CHECK(score >= 0 AND score <= 100000),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  await db.prepare(`
    CREATE INDEX IF NOT EXISTS idx_leaderboard_score
    ON leaderboard(score DESC, updated_at ASC)
  `).run();

  await db.prepare(`
    CREATE TABLE IF NOT EXISTS daily_leaderboard (
      day TEXT NOT NULL,
      username TEXT NOT NULL COLLATE NOCASE,
      score INTEGER NOT NULL DEFAULT 0 CHECK(score >= 0 AND score <= 100000),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY(day, username)
    )
  `).run();

  await db.prepare(`
    CREATE INDEX IF NOT EXISTS idx_daily_leaderboard_day_score
    ON daily_leaderboard(day, score DESC, updated_at ASC)
  `).run();
}

async function topAllTime(db) {
  const { results } = await db.prepare(`
    SELECT username, score
    FROM leaderboard
    ORDER BY score DESC, updated_at ASC
    LIMIT 10
  `).all();
  return results ?? [];
}

async function topToday(db, day) {
  const { results } = await db.prepare(`
    SELECT username, score
    FROM daily_leaderboard
    WHERE day = ?
    ORDER BY score DESC, updated_at ASC
    LIMIT 5
  `).bind(day).all();
  return results ?? [];
}

function getDb(context) {
  return context.env?.DB ?? null;
}

async function payload(db) {
  const day = zagrebDay();
  const [today, allTime] = await Promise.all([
    topToday(db, day),
    topAllTime(db),
  ]);
  return { day, today, allTime, scores: allTime };
}

export async function onRequestGet(context) {
  const db = getDb(context);
  if (!db) return json({ error: 'D1 binding DB nije konfiguriran.' }, 503);

  try {
    await ensureSchema(db);
    return json(await payload(db));
  } catch (error) {
    console.error('Leaderboard GET failed', error);
    return json({ error: 'Scoreboard trenutačno nije dostupan.' }, 500);
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

  const username = validateUsername(body?.username);
  const score = validateScore(body?.score);
  if (!username) return json({ error: 'Ime mora imati 2–20 dopuštenih znakova.' }, 400);
  if (score === null) return json({ error: 'Neispravan rezultat.' }, 400);

  try {
    await ensureSchema(db);
    const day = zagrebDay();

    const [existingAllTime, existingToday] = await Promise.all([
      db.prepare('SELECT score FROM leaderboard WHERE username = ? COLLATE NOCASE LIMIT 1').bind(username).first(),
      db.prepare('SELECT score FROM daily_leaderboard WHERE day = ? AND username = ? COLLATE NOCASE LIMIT 1').bind(day, username).first(),
    ]);

    const updatedAllTime = score > (existingAllTime ? Number(existingAllTime.score) : -1);
    const updatedToday = score > (existingToday ? Number(existingToday.score) : -1);

    if (updatedAllTime) {
      await db.prepare(`
        INSERT INTO leaderboard (username, score)
        VALUES (?, ?)
        ON CONFLICT(username) DO UPDATE SET
          username = excluded.username,
          score = excluded.score,
          updated_at = CURRENT_TIMESTAMP
      `).bind(username, score).run();
    }

    if (updatedToday) {
      await db.prepare(`
        INSERT INTO daily_leaderboard (day, username, score)
        VALUES (?, ?, ?)
        ON CONFLICT(day, username) DO UPDATE SET
          username = excluded.username,
          score = excluded.score,
          updated_at = CURRENT_TIMESTAMP
      `).bind(day, username, score).run();
    }

    return json({
      ok: true,
      updated: updatedAllTime,
      updatedAllTime,
      updatedToday,
      ...(await payload(db)),
    });
  } catch (error) {
    console.error('Leaderboard POST failed', error);
    return json({ error: 'Rezultat nije spremljen.' }, 500);
  }
}
