const WORKER_URL = import.meta.env.VITE_WORKER_URL || "";

function analyticsUrl(path) {
  if (!WORKER_URL) return "";
  return `${WORKER_URL.replace(/\/$/, "")}${path}`;
}

export function hasAnalyticsApi() {
  return Boolean(WORKER_URL);
}

export function trackPageView({ path, title }) {
  const url = analyticsUrl("/analytics/pageview");
  if (!url || path === "/admin") return;

  const payload = JSON.stringify({
    path,
    title,
    referrer: document.referrer || "",
    language: navigator.language || "",
    screen: `${window.screen?.width || 0}x${window.screen?.height || 0}`,
  });

  if (navigator.sendBeacon) {
    const blob = new Blob([payload], { type: "application/json" });
    navigator.sendBeacon(url, blob);
    return;
  }

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => {});
}

export async function fetchAnalyticsSummary({ username, password }) {
  const url = analyticsUrl("/analytics/summary");
  if (!url) {
    throw new Error("Analytics API nije konfiguriran. Postavi VITE_WORKER_URL.");
  }

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Basic ${btoa(`${username}:${password}`)}`,
    },
  });

  if (res.status === 401) {
    throw new Error("Pogrešno korisničko ime ili lozinka.");
  }

  if (!res.ok) {
    throw new Error("Statistika trenutno nije dostupna.");
  }

  return res.json();
}
