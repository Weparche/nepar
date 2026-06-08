import { useEffect, useMemo, useState } from "react";
import { BarChart3, Laptop, Lock, LogOut, RefreshCw } from "lucide-react";
import {
  fetchAnalyticsSummary,
  hasAnalyticsApi,
  isOwnerDevice,
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
  const [loading, setLoading] = useState(false);
  const [ownerDeviceEnabled, setOwnerDeviceEnabled] = useState(isOwnerDevice);

  usePageMeta({
    title: "Admin | Nepar",
    description: "Privatna Nepar administracija.",
    path: "/admin",
  });

  const topPages = summary?.pages || [];
  const recentDays = useMemo(() => {
    const rows = summary?.daily || [];
    return rows.slice(0, 30);
  }, [summary]);

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
  }

  function toggleOwnerDevice() {
    const next = !ownerDeviceEnabled;
    setOwnerDevice(next);
    setOwnerDeviceEnabled(next);
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
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => load()}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-blue-400 hover:text-white disabled:cursor-wait disabled:opacity-60"
            >
              <RefreshCw size={16} />
              Osvjezi
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

        <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <p className="text-sm text-slate-400">Ukupno posjeta</p>
            <p className="mt-2 text-3xl font-semibold tabular-nums text-white">
              {summary.totals.visits}
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
                Computer name se ne moze citati iz browsera. IP se moze usporediti preko
                Worker varijable OWNER_IPS, a ovaj browser mozes oznaciti kao svoj.
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

        {error && (
          <p className="mb-6 rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        )}

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
