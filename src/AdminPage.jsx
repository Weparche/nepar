import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Laptop,
  Lock,
  LogOut,
  Monitor,
  RefreshCw,
  Search,
  Settings,
  Smartphone,
  Tablet,
  Trash2,
} from "lucide-react";
import {
  fetchAnalyticsSummary,
  hasAnalyticsApi,
  isOwnerDevice,
  resetAnalytics,
  setOwnerDevice,
} from "./analytics.js";
import { usePageMeta } from "./usePageMeta.js";
import {
  AUDIENCES,
  PROPERTIES,
  RANGE_PRESETS,
  cleanRows,
  deltaPercent,
  filterChecks,
  filterEvents,
  firstDate,
  pageRows,
  quickTotals,
  recentCount,
  resolveRange,
  seriesFor,
  sum,
  uniqueSeries,
} from "./admin/stats.js";
import { CHART_CURRENT, CHART_PREVIOUS, Donut, TrendChart, formatNumber, formatShort } from "./admin/charts.jsx";
import { Card, Legend, Scorecard, Segmented, SelectField } from "./admin/ui.jsx";

const AUTH_KEY = "nepar-admin-auth";
const DEVICE_COLORS = { desktop: "#2563eb", mobile: "#0891b2", tablet: "#6d28d9" };
const FALLBACK_COLOR = "#94a3b8";

function readStoredAuth() {
  try {
    const raw = sessionStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function storeAuth(auth) {
  try {
    sessionStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  } catch {
    /* ignore */
  }
}

function clearAuth() {
  try {
    sessionStorage.removeItem(AUTH_KEY);
  } catch {
    /* ignore */
  }
}

function formatDate(value) {
  if (!value) return "–";
  return new Intl.DateTimeFormat("hr-HR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function minutesAgo(value, nowMs) {
  const minutes = Math.max(0, Math.round((nowMs - Date.parse(value)) / 60_000));
  if (minutes < 1) return "upravo sada";
  if (minutes < 60) return `prije ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `prije ${hours} h`;
  return formatDate(value);
}

function formatAverage(value) {
  if (value >= 10) return formatNumber(Math.round(value));
  return new Intl.NumberFormat("hr-HR", { maximumFractionDigits: 1 }).format(value);
}

function deviceLabel(name) {
  if (name === "mobile") return "Mobitel";
  if (name === "tablet") return "Tablet";
  if (name === "desktop") return "Računalo";
  return "Nepoznato";
}

function DeviceIcon({ name, size = 16 }) {
  if (name === "mobile") return <Smartphone size={size} aria-hidden="true" />;
  if (name === "tablet") return <Tablet size={size} aria-hidden="true" />;
  return <Monitor size={size} aria-hidden="true" />;
}

const CHECK_STATUS = {
  green: { label: "CSV/XML pronađen", className: "bg-emerald-50 text-emerald-800" },
  yellow: { label: "Samo stranica s cijenama", className: "bg-amber-50 text-amber-800" },
  red: { label: "Nije pronađen", className: "bg-red-50 text-red-800" },
  unavailable: { label: "Provjera nije uspjela", className: "bg-slate-100 text-slate-700" },
};
const CHECK_SOURCE = { nepar: "Nepar.hr", digitalnicjenik: "Digitalni cjenik" };

function AdminLogin({ onLogin, error, loading }) {
  const [username, setUsername] = useState("nepar");
  const [password, setPassword] = useState("");

  function submit(e) {
    e.preventDefault();
    onLogin({ username, password });
  }

  const inputClass =
    "min-h-11 rounded-lg border border-slate-300 bg-white px-3.5 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20";

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-10 text-slate-900">
      <form onSubmit={submit} className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-lg bg-blue-50 text-blue-700 ring-1 ring-blue-100">
            <Lock size={20} aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Nepar analitika</h1>
            <p className="text-sm text-slate-600">Prijava za pregled posjeta</p>
          </div>
        </div>

        <div className="grid gap-4">
          <label className="grid gap-1.5 text-sm">
            <span className="font-medium text-slate-700">Korisnik</span>
            <input value={username} onChange={(e) => setUsername(e.target.value)} className={inputClass} autoComplete="username" required />
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="font-medium text-slate-700">Lozinka</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} autoComplete="current-password" required />
          </label>
        </div>

        {error && (
          <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-800">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-65"
        >
          {loading ? "Provjeravam…" : "Prijava"}
        </button>
      </form>
    </main>
  );
}

function Th({ children, align = "left", className = "" }) {
  return <th scope="col" className={`px-3 py-3 sm:px-5 text-xs font-semibold uppercase tracking-wide text-slate-500 ${align === "right" ? "text-right" : "text-left"} ${className}`}>{children}</th>;
}

export default function AdminPage() {
  const [auth, setAuth] = useState(readStoredAuth);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(() => Boolean(readStoredAuth() && hasAnalyticsApi()));
  const [resetting, setResetting] = useState(false);
  const [ownerDeviceEnabled, setOwnerDeviceEnabled] = useState(isOwnerDevice);

  const [property, setProperty] = useState("all");
  const [audience, setAudience] = useState("all");
  const [rangeId, setRangeId] = useState("30d");
  const [metric, setMetric] = useState("visits");
  const [pageQuery, setPageQuery] = useState("");
  const [pageSort, setPageSort] = useState("value");
  const [showAllPages, setShowAllPages] = useState(false);

  usePageMeta("/admin", "hr");

  async function load(nextAuth = auth) {
    if (!nextAuth) return;
    setLoading(true);
    setError("");
    try {
      const data = await fetchAnalyticsSummary(nextAuth);
      setSummary(data);
      setAuth(nextAuth);
      storeAuth(nextAuth);
    } catch (err) {
      setSummary(null);
      setError(err.message || "Prijava nije uspjela.");
      clearAuth();
    } finally {
      setLoading(false);
    }
  }

  // Restore a stored session once on mount. State is only set from the promise callbacks.
  useEffect(() => {
    if (!auth || !hasAnalyticsApi()) return undefined;
    let active = true;
    fetchAnalyticsSummary(auth)
      .then((data) => { if (active) setSummary(data); })
      .catch((err) => {
        if (!active) return;
        setError(err.message || "Prijava nije uspjela.");
        clearAuth();
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function logout() {
    clearAuth();
    setAuth(null);
    setSummary(null);
    setError("");
    setNotice("");
  }

  function toggleOwnerDevice() {
    const next = !ownerDeviceEnabled;
    setOwnerDevice(next);
    setOwnerDeviceEnabled(next);
  }

  async function resetAllVisits() {
    if (!auth) return;
    if (!window.confirm("Resetirati sve zabilježene posjete? Ovo se ne može vratiti.")) return;
    setResetting(true);
    setError("");
    setNotice("");
    try {
      const result = await resetAnalytics(auth);
      await load(auth);
      setNotice(`Reset gotov. Obrisano zapisa: ${result.deleted || 0}.`);
    } catch (err) {
      setError(err.message || "Reset nije uspio.");
    } finally {
      setResetting(false);
    }
  }

  const model = useMemo(() => {
    if (!summary) return null;
    const rows = cleanRows(summary.daily);
    const todayKey = String(summary.generatedAt).slice(0, 10);
    const range = resolveRange(rangeId, todayKey, firstDate(rows));
    const base = { property, audience };
    const prevRange = range.previous;
    const effectiveMetric = metric === "unique" && property === "all" ? "unique" : "visits";

    const visits = seriesFor(rows, { ...base, start: range.start, end: range.end });
    const visitsPrev = prevRange ? seriesFor(rows, { ...base, ...prevRange }) : null;
    const owner = seriesFor(rows, { property, audience: "owner", start: range.start, end: range.end });
    const ownerPrev = prevRange ? seriesFor(rows, { property, audience: "owner", ...prevRange }) : null;
    const uniques = uniqueSeries(summary.trend, range);
    const uniquesPrev = prevRange ? uniqueSeries(summary.trend, prevRange) : null;

    const pages = pageRows(rows, summary.pages, { ...base, start: range.start, end: range.end });
    const pagesPrev = prevRange ? pageRows(rows, summary.pages, { ...base, ...prevRange }) : null;

    const events = filterEvents(summary.recent, base);
    const checks = filterChecks(summary.checks, property);
    const nowMs = Date.parse(summary.generatedAt) || 0;

    return {
      range,
      effectiveMetric,
      chart: effectiveMetric === "unique" ? uniques : visits,
      chartPrev: effectiveMetric === "unique" ? uniquesPrev : visitsPrev,
      visits,
      visitsPrev,
      owner,
      ownerPrev,
      uniques,
      uniquesPrev,
      pages,
      pagesPrev,
      quick: quickTotals(rows, todayKey, base),
      events,
      checks,
      nowMs,
      live: recentCount(events, nowMs, 30),
    };
  }, [summary, property, audience, rangeId, metric]);

  const visiblePages = useMemo(() => {
    if (!model) return [];
    const query = pageQuery.trim().toLowerCase();
    const list = model.pages.filter((page) => !query || page.path.toLowerCase().includes(query) || page.title.toLowerCase().includes(query));
    if (pageSort === "recent") list.sort((a, b) => String(b.lastSeen || "").localeCompare(String(a.lastSeen || "")));
    return list;
  }, [model, pageQuery, pageSort]);

  if (!auth || !summary || !model) {
    return <AdminLogin onLogin={load} error={error} loading={loading} />;
  }

  const total = sum(model.visits);
  const totalPrev = model.visitsPrev ? sum(model.visitsPrev) : undefined;
  const ownerTotal = sum(model.owner);
  const ownerPrevTotal = model.ownerPrev ? sum(model.ownerPrev) : undefined;
  const uniqueTotal = sum(model.uniques);
  const uniquePrev = model.uniquesPrev ? sum(model.uniquesPrev) : undefined;
  const avg = model.range.days ? total / model.range.days : 0;
  const avgPrev = model.range.previous && totalPrev !== undefined ? totalPrev / model.range.days : undefined;
  const delta = (current, previous) => (previous === undefined ? undefined : deltaPercent(current, previous));
  const chartTotal = sum(model.chart);
  const chartUnit = model.effectiveMetric === "unique" ? "posjetitelja po danu" : "posjeta";
  const comparisonHint = model.range.previous
    ? `${formatShort(model.range.previous.start)} – ${formatShort(model.range.previous.end)}`
    : null;

  const sources = (summary.sources || []).slice(0, 8);
  const sourcesTotal = (summary.sources || []).reduce((acc, source) => acc + source.total, 0);
  const devices = (summary.devices || []).map((device) => ({
    name: deviceLabel(device.name),
    key: device.name,
    value: device.total,
    color: DEVICE_COLORS[device.name] || FALLBACK_COLOR,
  }));
  const devicesTotal = devices.reduce((acc, device) => acc + device.value, 0);
  const shownPages = showAllPages ? visiblePages : visiblePages.slice(0, 10);
  const audienceNote = AUDIENCES.find((item) => item.id === audience)?.label;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-lg bg-blue-50 text-blue-700 ring-1 ring-blue-100">
              <BarChart3 size={20} aria-hidden="true" />
            </span>
            <div>
              <h1 className="text-xl font-semibold leading-tight text-slate-900">Nepar analitika</h1>
              <p className="text-sm text-slate-600" aria-live="polite">
                {loading ? "Osvježavam…" : `Ažurirano ${formatDate(summary.generatedAt)}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => load()}
              disabled={loading || resetting}
              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 text-sm font-medium text-slate-800 transition hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60"
            >
              <RefreshCw size={16} aria-hidden="true" className={loading ? "animate-spin" : ""} />
              Osvježi
            </button>
            <button
              type="button"
              onClick={logout}
              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
            >
              <LogOut size={16} aria-hidden="true" />
              Odjava
            </button>
          </div>
        </div>
      </header>

      <div className="border-b border-slate-200 bg-white/90">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Segmented label="Svojstvo" options={PROPERTIES} value={property} onChange={(next) => { setProperty(next); setShowAllPages(false); }} />
          <div className="flex flex-wrap items-center gap-2">
            <SelectField label="Posjeti" value={audience} onChange={setAudience} options={AUDIENCES} />
            <SelectField label="Razdoblje" value={rangeId} onChange={setRangeId} options={RANGE_PRESETS} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {notice && <p role="status" className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{notice}</p>}
        {error && <p role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}

        <p className="mb-3 text-sm text-slate-600">
          {formatShort(model.range.start)} – {formatShort(model.range.end)} · {model.range.days} {model.range.days === 1 ? "dan" : "dana"} · {audienceNote.toLowerCase()}
          {comparisonHint && <> · usporedba s {comparisonHint}</>}
        </p>

        <section aria-label="Ključne brojke" className={`mb-6 grid grid-cols-2 gap-3 ${property === "all" ? "xl:grid-cols-5" : "xl:grid-cols-4"}`}>
          <Scorecard label="Posjete" value={total} delta={delta(total, totalPrev)} series={model.visits} />
          <Scorecard label="Prosjek po danu" value={formatAverage(avg)} delta={delta(avg, avgPrev)} />
          <Scorecard label="Aktivne stranice" value={model.pages.length} delta={model.pagesPrev ? deltaPercent(model.pages.length, model.pagesPrev.length) : undefined} hint="s barem 1 posjetom" />
          <Scorecard
            label="Moji posjeti"
            value={ownerTotal}
            delta={delta(ownerTotal, ownerPrevTotal)}
            hint={total && audience === "all" ? `${Math.round((ownerTotal / total) * 100)} % svih` : undefined}
          />
          {property === "all" && (
            <Scorecard label="Posjetitelji po danu" value={uniqueTotal} delta={delta(uniqueTotal, uniquePrev)} hint="zbroj dnevnih jedinstvenih" series={model.uniques} />
          )}
        </section>

        <Card
          className="mb-6"
          title={model.effectiveMetric === "unique" ? "Posjetitelji kroz vrijeme" : "Posjete kroz vrijeme"}
          subtitle={`${formatNumber(chartTotal)} ukupno u odabranom razdoblju`}
          action={
            property === "all" ? (
              <Segmented
                label="Mjera"
                value={model.effectiveMetric}
                onChange={setMetric}
                options={[{ id: "visits", label: "Posjete" }, { id: "unique", label: "Posjetitelji" }]}
              />
            ) : null
          }
        >
          <div className="mb-3">
            <Legend
              items={[
                { label: "Odabrano razdoblje", color: CHART_CURRENT },
                ...(model.chartPrev ? [{ label: "Prethodno razdoblje", color: CHART_PREVIOUS, dashed: true }] : []),
              ]}
            />
          </div>
          <TrendChart series={model.chart} previous={model.chartPrev} unit={chartUnit} />
          {model.effectiveMetric === "unique" && (
            <p className="mt-2 text-xs text-slate-500">Jedinstveni posjetitelji bilježe se po danu za cijelu stranicu; ne mogu se filtrirati po svojstvu ni vrsti posjeta.</p>
          )}
        </Card>

        <section className="mb-6 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <Card title="Brzi pregled" subtitle="Prema filterima iznad">
            <dl className="divide-y divide-slate-100">
              {[
                ["Danas", model.quick.today],
                [`Ovaj tjedan (od ${formatShort(model.quick.weekStart)})`, model.quick.week],
                ["Ovaj mjesec", model.quick.month],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <dt className="text-sm text-slate-600">{label}</dt>
                  <dd className="text-xl font-semibold tabular-nums text-slate-900">{formatNumber(value)}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card
            title="Uživo"
            subtitle={`${formatNumber(model.live)} ${model.live === 1 ? "posjet" : "posjeta"} u zadnjih 30 minuta`}
          >
            {model.events.length === 0 ? (
              <p className="text-sm text-slate-500">Nema nedavnih posjeta za odabrane filtere.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {model.events.slice(0, 5).map((event, index) => (
                  <li key={`${event.at}-${event.path}-${index}`} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                    <span className="min-w-0 truncate text-sm font-medium text-slate-900">{event.path}</span>
                    <span className="shrink-0 text-xs text-slate-500">{event.owner ? "moj posjet · " : ""}{minutesAgo(event.at, model.nowMs)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </section>

        <section className="mb-6 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
          <Card
            padded={false}
            title="Stranice"
            subtitle={`${formatNumber(visiblePages.length)} s posjetima u odabranom razdoblju`}
            action={
              <label className="relative inline-flex items-center">
                <span className="sr-only">Pretraži stranice</span>
                <Search size={15} aria-hidden="true" className="pointer-events-none absolute left-3 text-slate-400" />
                <input
                  type="search"
                  value={pageQuery}
                  onChange={(e) => setPageQuery(e.target.value)}
                  placeholder="Pretraži"
                  className="min-h-10 w-44 rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                />
              </label>
            }
          >
            <div className="mt-4 overflow-x-auto border-t border-slate-200">
              <table className="w-full min-w-0 text-left text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <Th>Stranica</Th>
                    <Th align="right">
                      <button type="button" onClick={() => setPageSort("value")} aria-pressed={pageSort === "value"} className={`inline-flex min-h-9 items-center font-semibold uppercase tracking-wide ${pageSort === "value" ? "text-blue-700" : ""}`}>Posjete {pageSort === "value" ? "↓" : ""}</button>
                    </Th>
                    <Th className="hidden w-44 sm:table-cell">Udio</Th>
                    <Th align="right" className="hidden sm:table-cell">
                      <button type="button" onClick={() => setPageSort("recent")} aria-pressed={pageSort === "recent"} className={`inline-flex min-h-9 items-center font-semibold uppercase tracking-wide ${pageSort === "recent" ? "text-blue-700" : ""}`}>Zadnji posjet {pageSort === "recent" ? "↓" : ""}</button>
                    </Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {shownPages.map((page) => (
                    <tr key={page.path}>
                      <td className="max-w-[22rem] px-3 py-3 sm:px-5">
                        <p className="truncate font-medium text-slate-900">{page.path}</p>
                        {page.title && <p className="truncate text-xs text-slate-500">{page.title}</p>}
                      </td>
                      <td className="px-3 py-3 text-right font-semibold tabular-nums text-slate-900 sm:px-5">{formatNumber(page.value)}<span className="block text-xs font-normal text-slate-500 sm:hidden">{Math.round(page.share * 100)} %</span></td>
                      <td className="hidden px-3 py-3 sm:px-5 sm:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                            <div className="h-full rounded-full bg-blue-600" style={{ width: `${Math.max(2, Math.round(page.share * 100))}%` }} />
                          </div>
                          <span className="w-10 text-right text-xs tabular-nums text-slate-600">{Math.round(page.share * 100)} %</span>
                        </div>
                      </td>
                      <td className="hidden px-3 py-3 sm:px-5 text-right text-slate-600 sm:table-cell">{page.lastSeen ? formatDate(page.lastSeen) : "–"}</td>
                    </tr>
                  ))}
                  {shownPages.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-3 py-10 sm:px-5 text-center text-slate-500">
                        {pageQuery ? "Nijedna stranica ne odgovara pretrazi." : "Nema posjeta u odabranom razdoblju."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {visiblePages.length > 10 && (
              <div className="border-t border-slate-200 px-3 py-3 sm:px-5">
                <button type="button" onClick={() => setShowAllPages((value) => !value)} className="min-h-10 text-sm font-medium text-blue-700 hover:text-blue-800">
                  {showAllPages ? "Prikaži manje" : `Prikaži svih ${visiblePages.length}`}
                </button>
              </div>
            )}
          </Card>

          <div className="grid min-w-0 content-start gap-6">
            <Card title="Izvori posjeta" subtitle="Cijelo razdoblje, sve stranice">
              {sources.length === 0 ? (
                <p className="text-sm text-slate-500">Izvori će se pojaviti nakon novih posjeta.</p>
              ) : (
                <ul className="grid gap-3">
                  {sources.map((source) => {
                    const share = sourcesTotal ? Math.round((source.total / sourcesTotal) * 100) : 0;
                    return (
                      <li key={source.name}>
                        <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                          <span className="truncate text-slate-800">{source.name}</span>
                          <span className="shrink-0 tabular-nums text-slate-600">{formatNumber(source.total)} · {share} %</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full rounded-full bg-cyan-600" style={{ width: `${Math.max(2, share)}%` }} />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Card>

            <Card title="Uređaji" subtitle="Cijelo razdoblje, sve stranice">
              {devices.length === 0 ? (
                <p className="text-sm text-slate-500">Uređaji će se pojaviti nakon novih posjeta.</p>
              ) : (
                <div className="flex flex-wrap items-center gap-5">
                  <Donut items={devices} centerLabel="posjeta" />
                  <ul className="grid min-w-40 flex-1 gap-2.5">
                    {devices.map((device) => (
                      <li key={device.key} className="flex items-center justify-between gap-3 text-sm">
                        <span className="inline-flex items-center gap-2 text-slate-800">
                          <i className="inline-block size-3 rounded-sm" style={{ background: device.color }} aria-hidden="true" />
                          <DeviceIcon name={device.key} />
                          {device.name}
                        </span>
                        <span className="tabular-nums text-slate-600">{devicesTotal ? Math.round((device.value / devicesTotal) * 100) : 0} %</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          </div>
        </section>

        <Card padded={false} className="mb-6" title="Zadnji posjeti" subtitle="Najnovijih 25 događaja za odabrane filtere">
          <div className="mt-4 overflow-x-auto border-t border-slate-200">
            <table className="w-full min-w-0 text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <Th>Vrijeme</Th>
                  <Th>Stranica</Th>
                  <Th>Posjetitelj</Th>
                  <Th className="hidden md:table-cell">Uređaj</Th>
                  <Th className="hidden md:table-cell">Izvor</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {model.events.slice(0, 25).map((event, index) => (
                  <tr key={`${event.at}-${event.path}-${index}`}>
                    <td className="whitespace-nowrap px-3 py-3 sm:px-5 text-slate-600">{formatDate(event.at)}</td>
                    <td className="px-3 py-3 sm:px-5 font-medium text-slate-900">{event.path}</td>
                    <td className="px-3 py-3 sm:px-5">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${event.owner ? "bg-blue-50 text-blue-800" : "bg-slate-100 text-slate-700"}`}>
                        {event.owner ? "Moj" : "Ostali"}
                      </span>
                    </td>
                    <td className="hidden px-3 py-3 sm:px-5 text-slate-700 md:table-cell">
                      <span className="inline-flex items-center gap-1.5"><DeviceIcon name={event.device} size={15} />{deviceLabel(event.device)}</span>
                    </td>
                    <td className="hidden max-w-[16rem] truncate px-3 py-3 sm:px-5 text-slate-600 md:table-cell">{event.source || "Izravno"}</td>
                  </tr>
                ))}
                {model.events.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-3 py-10 sm:px-5 text-center text-slate-500">Nema posjeta za odabrane filtere.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {property !== "kids" && (
          <Card padded={false} className="mb-6" title="Provjere cjenika" subtitle="Koje web stranice ljudi provjeravaju, najnovije prvo">
            <div className="mt-4 overflow-x-auto border-t border-slate-200">
              <table className="w-full min-w-0 text-left text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <Th>Vrijeme</Th>
                    <Th>Web stranica</Th>
                    <Th>Rezultat</Th>
                    <Th className="hidden md:table-cell">Gdje</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {model.checks.slice(0, 50).map((check, index) => {
                    const status = CHECK_STATUS[check.status] || CHECK_STATUS.unavailable;
                    return (
                      <tr key={`${check.at}-${check.site}-${index}`}>
                        <td className="whitespace-nowrap px-3 py-3 sm:px-5 text-slate-600">{minutesAgo(check.at, model.nowMs)}</td>
                        <td className="max-w-[18rem] truncate px-3 py-3 sm:px-5 font-medium">
                          <a href={`https://${check.site}`} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline-offset-2 hover:underline">
                            {check.site}
                          </a>
                        </td>
                        <td className="px-3 py-3 sm:px-5">
                          <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}>{status.label}</span>
                        </td>
                        <td className="hidden px-3 py-3 sm:px-5 text-slate-600 md:table-cell">{CHECK_SOURCE[check.source] || check.source}</td>
                      </tr>
                    );
                  })}
                  {model.checks.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-3 py-10 sm:px-5 text-center text-slate-500">Još nema provjera.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        <details className="group rounded-xl border border-slate-200 bg-white shadow-sm">
          <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 px-5 text-sm font-semibold text-slate-800 marker:hidden">
            <Settings size={16} aria-hidden="true" />
            Postavke i održavanje
          </summary>
          <div className="grid gap-6 border-t border-slate-200 p-5 md:grid-cols-2">
            <div className="flex gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-700">
                <Laptop size={18} aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-semibold text-slate-900">Moji posjeti</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Tvoja IP adresa: <span className="font-medium text-slate-900">{summary.requesterIp || "–"}</span>
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  IP se mijenja, a naziv računala preglednik ne otkriva, pa se vlastiti posjeti prepoznaju oznakom na ovom pregledniku.
                </p>
                <button
                  type="button"
                  onClick={toggleOwnerDevice}
                  aria-pressed={ownerDeviceEnabled}
                  className={`mt-3 inline-flex min-h-10 items-center rounded-lg px-4 text-sm font-semibold transition ${
                    ownerDeviceEnabled ? "bg-blue-600 text-white hover:bg-blue-700" : "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  {ownerDeviceEnabled ? "Ovaj preglednik je označen kao moj" : "Označi ovaj preglednik kao moj"}
                </button>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-red-50 text-red-700">
                <Trash2 size={18} aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-semibold text-slate-900">Brisanje podataka</h2>
                <p className="mt-1 text-sm text-slate-600">Briše sve zabilježene posjete i ne može se poništiti.</p>
                <button
                  type="button"
                  onClick={resetAllVisits}
                  disabled={loading || resetting}
                  className="mt-3 inline-flex min-h-10 items-center rounded-lg border border-red-300 bg-white px-4 text-sm font-semibold text-red-800 transition hover:bg-red-50 disabled:cursor-wait disabled:opacity-60"
                >
                  {resetting ? "Brišem…" : "Resetiraj sve posjete"}
                </button>
              </div>
            </div>
          </div>
        </details>
      </div>
    </main>
  );
}
