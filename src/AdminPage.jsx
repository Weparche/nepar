import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  Laptop,
  Lock,
  LogOut,
  Monitor,
  RefreshCw,
  Smartphone,
  Tablet,
  Trash2,
  Users,
} from "lucide-react";
import {
  fetchAnalyticsSummary,
  hasAnalyticsApi,
  isOwnerDevice,
  resetAnalytics,
  setOwnerDevice,
} from "./analytics.js";
import { usePageMeta } from "./usePageMeta.js";

const AUTH_KEY = "nepar-admin-auth";

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
  if (!value) return "-";
  return new Intl.DateTimeFormat("hr-HR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function visitorTotal(row) {
  return row.visitorTotal ?? Math.max(0, (row.total || 0) - (row.ownerTotal || 0));
}

function percent(value, total) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

function deviceLabel(name) {
  if (name === "mobile") return "Mobile";
  if (name === "tablet") return "Tablet";
  if (name === "desktop") return "Desktop";
  return "Nepoznato";
}

function DeviceIcon({ name }) {
  if (name === "mobile") return <Smartphone size={16} />;
  if (name === "tablet") return <Tablet size={16} />;
  return <Monitor size={16} />;
}

function AdminLogin({ onLogin, error, loading }) {
  const [username, setUsername] = useState("nepar");
  const [password, setPassword] = useState("");

  function submit(e) {
    e.preventDefault();
    onLogin({ username, password });
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-4 py-10 text-slate-100">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900/92 p-6 shadow-2xl shadow-blue-950/30"
      >
        <div className="mb-6 flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-blue-500/15 text-blue-300 ring-1 ring-blue-400/20">
            <Lock size={20} />
          </span>
          <div>
            <h1 className="text-xl font-semibold text-white">Nepar admin</h1>
            <p className="text-sm text-slate-400">Pregled posjeta po stranicama</p>
          </div>
        </div>

        <div className="grid gap-4">
          <label className="grid gap-1.5 text-sm">
            <span className="font-medium text-slate-300">Korisnik</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-3 text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
              autoComplete="username"
              required
            />
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="font-medium text-slate-300">Lozinka</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-3 text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
              autoComplete="current-password"
              required
            />
          </label>
        </div>

        {error && (
          <p className="mt-4 rounded-xl border border-red-400/25 bg-red-500/10 px-3.5 py-3 text-sm text-red-200">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-wait disabled:opacity-65"
        >
          {loading ? "Provjeravam..." : "Prijava"}
        </button>
      </form>
    </main>
  );
}

export default function AdminPage() {
  const [auth, setAuth] = useState(readStoredAuth);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [ownerDeviceEnabled, setOwnerDeviceEnabled] = useState(isOwnerDevice);

  usePageMeta({
    title: "Admin | Nepar",
    description: "Privatna Nepar administracija.",
    path: "/admin",
  });

  const topPages = summary?.pages || [];
  const sources = summary?.sources || [];
  const devices = summary?.devices || [];
  const recent = summary?.recent || [];
  const trend7 = summary?.trend7 || [];
  const trend30 = summary?.trend30 || [];
  const recentDays = useMemo(() => {
    const rows = summary?.daily || [];
    return rows.slice(0, 30);
  }, [summary]);
  const maxTrend7 = Math.max(...trend7.map((row) => row.total || 0), 1);
  const maxTrend30 = Math.max(...trend30.map((row) => row.total || 0), 1);

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

  useEffect(() => {
    if (auth && hasAnalyticsApi()) {
      load(auth);
    }
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
    const confirmed = window.confirm(
      "Resetirati sve zabiljezene posjete? Ovo se ne moze vratiti.",
    );
    if (!confirmed) return;

    setResetting(true);
    setError("");
    setNotice("");
    try {
      const result = await resetAnalytics(auth);
      await load(auth);
      setNotice(`Reset gotovo. Obrisano zapisa: ${result.deleted || 0}.`);
    } catch (err) {
      setError(err.message || "Reset nije uspio.");
    } finally {
      setResetting(false);
    }
  }

  if (!auth || !summary) {
    return <AdminLogin onLogin={load} error={error} loading={loading} />;
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-blue-950/20 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-xl bg-blue-500/15 text-blue-300 ring-1 ring-blue-400/20">
              <BarChart3 size={22} />
            </span>
            <div>
              <h1 className="text-2xl font-semibold text-white">Nepar analytics</h1>
              <p className="text-sm text-slate-400">
                Zadnje osvjezeno: {formatDate(summary.generatedAt)}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => load()}
              disabled={loading || resetting}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-blue-400 hover:text-white disabled:cursor-wait disabled:opacity-60"
            >
              <RefreshCw size={16} />
              Osvjezi
            </button>
            <button
              type="button"
              onClick={resetAllVisits}
              disabled={loading || resetting}
              className="inline-flex items-center gap-2 rounded-xl border border-red-400/35 bg-red-500/10 px-3.5 py-2.5 text-sm font-semibold text-red-100 transition hover:border-red-300 hover:bg-red-500/20 disabled:cursor-wait disabled:opacity-60"
            >
              <Trash2 size={16} />
              {resetting ? "Resetiram..." : "Reset"}
            </button>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-red-400 hover:text-white"
            >
              <LogOut size={16} />
              Odjava
            </button>
          </div>
        </header>

        <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <p className="text-sm text-slate-400">Ukupno posjeta</p>
            <p className="mt-2 text-3xl font-semibold tabular-nums text-white">
              {summary.totals.visits}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <p className="text-sm text-slate-400">Jedinstveni</p>
            <p className="mt-2 text-3xl font-semibold tabular-nums text-violet-200">
              {summary.totals.uniqueVisitors ?? 0}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <p className="text-sm text-slate-400">Ostali posjeti</p>
            <p className="mt-2 text-3xl font-semibold tabular-nums text-emerald-200">
              {summary.totals.visitorVisits ?? 0}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <p className="text-sm text-slate-400">Moji posjeti</p>
            <p className="mt-2 text-3xl font-semibold tabular-nums text-blue-200">
              {summary.totals.ownerVisits ?? 0}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <p className="text-sm text-slate-400">Najposjecenija</p>
            <p className="mt-2 truncate text-2xl font-semibold text-white">
              {topPages[0]?.path || "-"}
            </p>
          </div>
        </section>

        <section className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/20">
              <Laptop size={20} />
            </span>
            <div>
              <h2 className="font-semibold text-white">Moji posjeti</h2>
              <p className="mt-1 text-sm text-slate-400">
                Tvoja trenutna IP adresa:{" "}
                <span className="font-medium text-slate-200">{summary.requesterIp || "-"}</span>
              </p>
              <p className="mt-1 max-w-2xl text-sm text-slate-500">
                Computer name se ne moze citati iz browsera, a IP nije dobar ako se mijenja.
                Zato ovaj browser mozes oznaciti kao svoj i tvoji posjeti idu pod Moji.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleOwnerDevice}
            className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              ownerDeviceEnabled
                ? "bg-emerald-400 text-slate-950 hover:bg-emerald-300"
                : "border border-slate-700 bg-slate-950 text-slate-200 hover:border-emerald-400 hover:text-white"
            }`}
          >
            {ownerDeviceEnabled ? "Ovaj browser je moj" : "Oznaci ovaj browser kao moj"}
          </button>
        </section>

        {notice && (
          <p className="mb-6 rounded-xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
            {notice}
          </p>
        )}

        {error && (
          <p className="mb-6 rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        )}

        <section className="mb-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">Trend posjeta</h2>
                <p className="text-sm text-slate-500">7 dana i 30 dana</p>
              </div>
              <Activity className="text-blue-200" size={22} />
            </div>

            <div className="grid gap-5">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-300">Zadnjih 7 dana</span>
                  <span className="tabular-nums text-slate-500">
                    {trend7.reduce((sum, row) => sum + (row.total || 0), 0)}
                  </span>
                </div>
                <div className="flex h-32 items-end gap-2">
                  {trend7.length > 0 ? trend7.map((row) => (
                    <div key={row.date} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                      <div
                        className="w-full rounded-t bg-blue-400/80"
                        style={{ height: `${Math.max(6, percent(row.total || 0, maxTrend7))}%` }}
                        title={`${row.date}: ${row.total || 0}`}
                      />
                      <span className="w-full truncate text-center text-[10px] text-slate-500">
                        {row.date.slice(5)}
                      </span>
                    </div>
                  )) : (
                    <p className="w-full self-center text-center text-sm text-slate-500">
                      Jos nema trenda.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-300">Zadnjih 30 dana</span>
                  <span className="tabular-nums text-slate-500">
                    {trend30.reduce((sum, row) => sum + (row.total || 0), 0)}
                  </span>
                </div>
                <div className="flex h-20 items-end gap-1">
                  {trend30.length > 0 ? trend30.map((row) => (
                    <div
                      key={row.date}
                      className="min-w-[3px] flex-1 rounded-t bg-emerald-300/75"
                      style={{ height: `${Math.max(5, percent(row.total || 0, maxTrend30))}%` }}
                      title={`${row.date}: ${row.total || 0}`}
                    />
                  )) : (
                    <p className="w-full self-center text-center text-sm text-slate-500">
                      Jos nema 30-dnevnog pregleda.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Odakle dolaze</h2>
                <Users className="text-violet-200" size={20} />
              </div>
              <div className="grid gap-3">
                {sources.slice(0, 6).map((source) => (
                  <div key={source.name}>
                    <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                      <span className="truncate text-slate-300">{source.name}</span>
                      <span className="tabular-nums text-slate-500">{source.total}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-violet-300"
                        style={{ width: `${percent(source.total, summary.totals.visits)}%` }}
                      />
                    </div>
                  </div>
                ))}
                {sources.length === 0 && (
                  <p className="text-sm text-slate-500">Izvori ce se pojaviti nakon novih posjeta.</p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
              <h2 className="mb-4 text-lg font-semibold text-white">Uredaji</h2>
              <div className="grid gap-3">
                {devices.map((device) => (
                  <div key={device.name} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2.5">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-200">
                      <DeviceIcon name={device.name} />
                      {deviceLabel(device.name)}
                    </span>
                    <span className="tabular-nums text-slate-400">{device.total}</span>
                  </div>
                ))}
                {devices.length === 0 && (
                  <p className="text-sm text-slate-500">Uredaji ce se pojaviti nakon novih posjeta.</p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mb-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80">
          <div className="border-b border-slate-800 px-5 py-4">
            <h2 className="text-lg font-semibold text-white">Zadnji posjeti</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead className="bg-slate-950/60 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3">Vrijeme</th>
                  <th className="px-5 py-3">Stranica</th>
                  <th className="px-5 py-3">Tip</th>
                  <th className="px-5 py-3">Uredaj</th>
                  <th className="px-5 py-3">Izvor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {recent.slice(0, 25).map((event, index) => (
                  <tr key={`${event.at}-${event.path}-${index}`} className="text-slate-300">
                    <td className="px-5 py-3 text-slate-400">{formatDate(event.at)}</td>
                    <td className="px-5 py-3 font-medium text-white">{event.path}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        event.owner ? "bg-blue-400/15 text-blue-200" : "bg-emerald-400/15 text-emerald-200"
                      }`}
                      >
                        {event.owner ? "Moje" : "Ostali"}
                      </span>
                    </td>
                    <td className="px-5 py-3">{deviceLabel(event.device)}</td>
                    <td className="max-w-[16rem] truncate px-5 py-3 text-slate-400">
                      {event.source || "Direct"}
                    </td>
                  </tr>
                ))}
                {recent.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-slate-500">
                      Zadnji posjeti ce se pojaviti nakon novih posjeta.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80">
            <div className="border-b border-slate-800 px-5 py-4">
              <h2 className="text-lg font-semibold text-white">Posjete po stranici</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-slate-950/60 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Stranica</th>
                    <th className="px-5 py-3">Naslov</th>
                    <th className="px-5 py-3 text-right">Posjete</th>
                    <th className="px-5 py-3 text-right">Moje</th>
                    <th className="px-5 py-3 text-right">Ostali</th>
                    <th className="px-5 py-3">Zadnji posjet</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {topPages.map((page) => (
                    <tr key={page.path} className="text-slate-300">
                      <td className="px-5 py-3 font-medium text-white">{page.path}</td>
                      <td className="max-w-[18rem] truncate px-5 py-3">{page.title || "-"}</td>
                      <td className="px-5 py-3 text-right font-semibold tabular-nums text-white">
                        {page.total}
                      </td>
                      <td className="px-5 py-3 text-right font-semibold tabular-nums text-blue-200">
                        {page.ownerTotal || 0}
                      </td>
                      <td className="px-5 py-3 text-right font-semibold tabular-nums text-emerald-200">
                        {visitorTotal(page)}
                      </td>
                      <td className="px-5 py-3 text-slate-400">{formatDate(page.lastSeen)}</td>
                    </tr>
                  ))}
                  {topPages.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                        Jos nema zabiljezenih posjeta.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80">
            <div className="border-b border-slate-800 px-5 py-4">
              <h2 className="text-lg font-semibold text-white">Dnevni pregled</h2>
            </div>
            <div className="divide-y divide-slate-800">
              {recentDays.map((row) => (
                <div key={`${row.date}-${row.path}`} className="px-5 py-3">
                  <div className="flex items-center justify-between gap-4">
                    <p className="truncate font-medium text-white">{row.path}</p>
                    <span className="rounded-full bg-blue-500/15 px-2.5 py-1 text-xs font-semibold tabular-nums text-blue-200">
                      {row.total}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {row.date} · moje {row.ownerTotal || 0} · ostali {visitorTotal(row)}
                  </p>
                </div>
              ))}
              {recentDays.length === 0 && (
                <p className="px-5 py-8 text-center text-sm text-slate-500">
                  Dnevni podaci ce se pojaviti nakon prvih posjeta.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
