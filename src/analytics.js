const WORKER_URL = import.meta.env.VITE_WORKER_URL || "";
const OWNER_DEVICE_KEY = "nepar-analytics-owner-device";

function analyticsUrl(path) {
  if (!WORKER_URL) return "";
  return `${WORKER_URL.replace(/\/$/, "")}${path}`;
}

export function hasAnalyticsApi() {
  return Boolean(WORKER_URL);
}

export function isOwnerDevice() {
  try {
    return localStorage.getItem(OWNER_DEVICE_KEY) === "1";
  } catch {
    return false;
  }
}

export function setOwnerDevice(enabled) {
  try {
    if (enabled) localStorage.setItem(OWNER_DEVICE_KEY, "1");
    else localStorage.removeItem(OWNER_DEVICE_KEY);
  } catch {
    /* ignore */
  }
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
    ownerDevice: isOwnerDevice(),
  });

  if (navigator.sendBeacon) {
    const blob = new Blob([payload], { type: "text/plain;charset=UTF-8" });
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
