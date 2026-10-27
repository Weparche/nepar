// Pure helpers for the admin analytics dashboard. All dates are UTC day keys (YYYY-MM-DD),
// matching how the worker stores `analytics:day:*` rows.

const DAY_MS = 86_400_000;

export const RANGE_PRESETS = [
  { id: "7d", label: "Zadnjih 7 dana", days: 7 },
  { id: "30d", label: "Zadnjih 30 dana", days: 30 },
  { id: "90d", label: "Zadnjih 90 dana", days: 90 },
  { id: "month", label: "Ovaj mjesec" },
  { id: "all", label: "Cijelo razdoblje" },
];

export const PROPERTIES = [
  { id: "all", label: "Sve stranice" },
  { id: "nepar", label: "Nepar.hr" },
  { id: "kids", label: "NEPAR Kids" },
  { id: "digitalnicjenik", label: "Digitalni cjenik" },
];

// Other sites forward their pageviews to the Nepar worker with a path prefix (kids.nepar.hr → /kids,
// digitalnicjenik.nepar.hr → /digitalnicjenik). Everything else is nepar.hr itself.
const PROPERTY_PREFIXES = [
  ["kids", "/kids"],
  ["digitalnicjenik", "/digitalnicjenik"],
];

export const AUDIENCES = [
  { id: "all", label: "Svi posjeti" },
  { id: "others", label: "Bez mojih posjeta" },
  { id: "owner", label: "Samo moji posjeti" },
];

export function toKey(date) {
  return date.toISOString().slice(0, 10);
}

export function parseKey(key) {
  return new Date(`${key}T00:00:00Z`);
}

export function shiftKey(key, days) {
  const date = parseKey(key);
  date.setUTCDate(date.getUTCDate() + days);
  return toKey(date);
}

export function diffDays(from, to) {
  return Math.round((parseKey(to) - parseKey(from)) / DAY_MS);
}

export function mondayKey(key) {
  const date = parseKey(key);
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() - day + 1);
  return toKey(date);
}

// analytics.js adds synthetic "NEPAR Kids · …" rollup rows to the summary; they are not real paths.
export function isSyntheticPath(path) {
  return typeof path === "string" && path.startsWith("NEPAR Kids ·");
}

export function propertyOf(path) {
  if (typeof path !== "string") return "nepar";
  const match = PROPERTY_PREFIXES.find(([, prefix]) => path === prefix || path.startsWith(`${prefix}/`));
  return match ? match[0] : "nepar";
}

export function matchesProperty(path, property) {
  return property === "all" || propertyOf(path) === property;
}

export function cleanRows(rows) {
  return (Array.isArray(rows) ? rows : []).filter(
    (row) => row && typeof row.date === "string" && typeof row.path === "string" && !isSyntheticPath(row.path),
  );
}

export function measure(row, audience) {
  const total = row.total || 0;
  const owner = row.ownerTotal || 0;
  if (audience === "owner") return owner;
  if (audience === "others") return row.visitorTotal ?? Math.max(0, total - owner);
  return total;
}

export function resolveRange(presetId, todayKey, firstKey) {
  const preset = RANGE_PRESETS.find((item) => item.id === presetId) || RANGE_PRESETS[1];
  let start;
  if (preset.id === "month") start = `${todayKey.slice(0, 8)}01`;
  else if (preset.id === "all") start = firstKey && firstKey <= todayKey ? firstKey : todayKey;
  else start = shiftKey(todayKey, -(preset.days - 1));

  const days = diffDays(start, todayKey) + 1;
  if (preset.id === "all") return { preset, start, end: todayKey, days, previous: null };

  const prevEnd = shiftKey(start, -1);
  return { preset, start, end: todayKey, days, previous: { start: shiftKey(prevEnd, -(days - 1)), end: prevEnd } };
}

export function seriesFor(rows, { property = "all", audience = "all", start, end }) {
  const byDate = new Map();
  for (const row of rows) {
    if (row.date < start || row.date > end || !matchesProperty(row.path, property)) continue;
    byDate.set(row.date, (byDate.get(row.date) || 0) + measure(row, audience));
  }
  const length = diffDays(start, end) + 1;
  return Array.from({ length }, (_, index) => {
    const date = shiftKey(start, index);
    return { date, value: byDate.get(date) || 0 };
  });
}

export function uniqueSeries(trend, { start, end }) {
  const byDate = new Map((Array.isArray(trend) ? trend : []).map((row) => [row.date, row.uniqueVisitors || 0]));
  const length = diffDays(start, end) + 1;
  return Array.from({ length }, (_, index) => {
    const date = shiftKey(start, index);
    return { date, value: byDate.get(date) || 0 };
  });
}

export function sum(series) {
  return series.reduce((total, point) => total + point.value, 0);
}

// Percentage change vs the previous period. `null` means "no baseline" (previous was 0, current is not).
export function deltaPercent(current, previous) {
  if (previous === 0) return current === 0 ? 0 : null;
  return Math.round(((current - previous) / previous) * 100);
}

export function pageRows(rows, pages, { property = "all", audience = "all", start, end }) {
  const meta = new Map((Array.isArray(pages) ? pages : []).filter((page) => page && !isSyntheticPath(page.path)).map((page) => [page.path, page]));
  const totals = new Map();
  for (const row of rows) {
    if (row.date < start || row.date > end || !matchesProperty(row.path, property)) continue;
    totals.set(row.path, (totals.get(row.path) || 0) + measure(row, audience));
  }
  const grand = [...totals.values()].reduce((a, b) => a + b, 0);
  return [...totals.entries()]
    .filter(([, value]) => value > 0)
    .map(([path, value]) => ({
      path,
      value,
      share: grand ? value / grand : 0,
      title: meta.get(path)?.title || "",
      lastSeen: meta.get(path)?.lastSeen || null,
    }))
    .sort((a, b) => b.value - a.value || a.path.localeCompare(b.path));
}

export function quickTotals(rows, todayKey, { property = "all", audience = "all" }) {
  const week = mondayKey(todayKey);
  const month = `${todayKey.slice(0, 8)}01`;
  const pick = (start) => sum(seriesFor(rows, { property, audience, start, end: todayKey }));
  return { today: pick(todayKey), week: pick(week), month: pick(month), weekStart: week };
}

export function filterEvents(events, { property = "all", audience = "all" }) {
  return (Array.isArray(events) ? events : []).filter((event) => {
    if (!event || isSyntheticPath(event.path) || !matchesProperty(event.path, property)) return false;
    if (audience === "owner") return Boolean(event.owner);
    if (audience === "others") return !event.owner;
    return true;
  });
}

export function recentCount(events, nowMs, minutes = 30) {
  const since = nowMs - minutes * 60_000;
  return events.filter((event) => Date.parse(event.at) >= since).length;
}

export function firstDate(rows) {
  let first = null;
  for (const row of rows) if (!first || row.date < first) first = row.date;
  return first;
}
