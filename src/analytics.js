const WORKER_URL = import.meta.env.VITE_WORKER_URL || "";
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || "";
const OWNER_DEVICE_KEY = "nepar-analytics-owner-device";
const VISITOR_ID_KEY = "nepar-analytics-visitor-id";
const CONSENT_KEY = "nepar-consent-v1";
const CONSENT_VERSION = 1;
const CONSENT_EVENT = "nepar:consent-change";
const GOOGLE_SCRIPT_ID = "nepar-google-analytics";
const EVENT_PARAM_ALLOWLIST = new Set([
  "form_name",
  "offer_kind",
  "offer_name",
  "link_location",
  "section_name",
  "page_path",
]);
const pendingPageViews = new Set();
const trackedPageViews = new Set();
let googleLoadPromise = null;

function analyticsUrl(path) {
  if (!WORKER_URL) return "";
  return `${WORKER_URL.replace(/\/$/, "")}${path}`;
}

function readConsentRecord() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CONSENT_KEY) || "null");
    if (parsed?.version !== CONSENT_VERSION || typeof parsed.analytics !== "boolean") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function getConsentState() {
  const record = readConsentRecord();
  return {
    decided: Boolean(record),
    analytics: record?.analytics === true,
    updatedAt: record?.updatedAt || null,
  };
}

function dispatchConsentChange(state) {
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: state }));
}

function expireCookie(name, domain = "") {
  const domainPart = domain ? `; Domain=${domain}` : "";
  document.cookie = `${name}=; Max-Age=0; Path=/${domainPart}; SameSite=Lax`;
}

export function clearGoogleAnalyticsCookies() {
  const cookieNames = document.cookie
    .split(";")
    .map((entry) => entry.split("=")[0]?.trim())
    .filter((name) => name && (name.startsWith("_ga") || name === "_gid" || name === "_gat"));
  for (const name of cookieNames) {
    expireCookie(name);
    expireCookie(name, window.location.hostname);
    expireCookie(name, `.${window.location.hostname.replace(/^www\./, "")}`);
  }
  try {
    localStorage.removeItem(VISITOR_ID_KEY);
  } catch {
    /* Storage can be unavailable in privacy-focused browsers. */
  }
}

export function setAnalyticsConsent(analytics, { reloadOnRevoke = true } = {}) {
  const previous = getConsentState();
  const record = {
    version: CONSENT_VERSION,
    analytics: Boolean(analytics),
    updatedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
  } catch {
    /* The in-memory event still updates the current page. */
  }

  const next = { decided: true, analytics: record.analytics, updatedAt: record.updatedAt };
  if (!record.analytics) {
    clearGoogleAnalyticsCookies();
    dispatchConsentChange(next);
    if (previous.analytics && reloadOnRevoke) window.location.reload();
    return next;
  }

  dispatchConsentChange(next);
  void ensureGoogleAnalytics();
  return next;
}

export function subscribeConsentChanges(listener) {
  const handler = (event) => listener(event.detail || getConsentState());
  window.addEventListener(CONSENT_EVENT, handler);
  return () => window.removeEventListener(CONSENT_EVENT, handler);
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
    /* Ignore unavailable storage. */
  }
}

function randomVisitorId() {
  if (crypto.randomUUID) return crypto.randomUUID();
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return [...bytes].map((value) => value.toString(16).padStart(2, "0")).join("");
}

function getVisitorId() {
  if (!getConsentState().analytics) return "";
  try {
    let id = localStorage.getItem(VISITOR_ID_KEY);
    if (!id) {
      id = randomVisitorId();
      localStorage.setItem(VISITOR_ID_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

function getDeviceType() {
  const ua = navigator.userAgent || "";
  const width = window.innerWidth || window.screen?.width || 0;
  if (/ipad|tablet|kindle|playbook/i.test(ua) || (width >= 768 && width <= 1024 && /mobile/i.test(ua))) return "tablet";
  if (/mobi|android|iphone|ipod|blackberry|iemobile/i.test(ua) || width < 768) return "mobile";
  return "desktop";
}

export function sanitizeAnalyticsPath(value) {
  try {
    const url = new URL(value || "/", window.location.origin);
    return url.pathname || "/";
  } catch {
    return "/";
  }
}

export function sanitizeReferrer(value) {
  if (!value) return "";
  try {
    const url = new URL(value);
    return `${url.origin}${url.pathname}`.slice(0, 240);
  } catch {
    return "";
  }
}

function gtag(...args) {
  const googleWindow = /** @type {Window & { dataLayer?: Array<IArguments | unknown[]> }} */ (window);
  googleWindow.dataLayer = googleWindow.dataLayer || [];
  googleWindow.dataLayer.push(args.length ? arguments : args);
}

function validMeasurementId() {
  return /^G-[A-Z0-9]+$/i.test(GA_MEASUREMENT_ID);
}

export function ensureGoogleAnalytics() {
  if (!getConsentState().analytics || !validMeasurementId()) return Promise.resolve(false);
  if (googleLoadPromise) return googleLoadPromise;

  const googleWindow = /** @type {Window & { dataLayer?: Array<IArguments | unknown[]> }} */ (window);
  googleWindow.dataLayer = googleWindow.dataLayer || [];
  gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  gtag("consent", "update", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });

  googleLoadPromise = new Promise((resolve) => {
    const existing = document.getElementById(GOOGLE_SCRIPT_ID);
    if (existing) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = GOOGLE_SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
    script.onload = () => resolve(true);
    script.onerror = () => {
      googleLoadPromise = null;
      resolve(false);
    };
    document.head.appendChild(script);
  });

  return googleLoadPromise;
}

function cleanEventParams(params) {
  return Object.fromEntries(
    Object.entries(params || {})
      .filter(([key, value]) => EVENT_PARAM_ALLOWLIST.has(key) && ["string", "number", "boolean"].includes(typeof value))
      .map(([key, value]) => [key, typeof value === "string" ? value.slice(0, 100) : value]),
  );
}

export async function trackEvent(name, params = {}) {
  if (!getConsentState().analytics || !/^[a-z][a-z0-9_]{0,39}$/.test(name)) return false;
  const loaded = await ensureGoogleAnalytics();
  if (!loaded || !getConsentState().analytics) return false;
  gtag("event", name, cleanEventParams(params));
  return true;
}

function sendInternalPageView({ path, title }) {
  const url = analyticsUrl("/analytics/pageview");
  if (!url) return;
  const payload = JSON.stringify({
    path,
    title: String(title || "").slice(0, 160),
    referrer: sanitizeReferrer(document.referrer),
    language: navigator.language || "",
    screen: `${window.screen?.width || 0}x${window.screen?.height || 0}`,
    ownerDevice: isOwnerDevice(),
    visitorId: getVisitorId(),
    device: getDeviceType(),
  });

  if (navigator.sendBeacon) {
    const sent = navigator.sendBeacon(url, new Blob([payload], { type: "text/plain;charset=UTF-8" }));
    if (sent) return;
  }
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => {});
}

export async function trackPageView({ path, title, navigationKey = path }) {
  if (!getConsentState().analytics) return false;
  const cleanPath = sanitizeAnalyticsPath(path);
  if (cleanPath === "/admin") return false;
  const key = String(navigationKey || cleanPath);
  if (trackedPageViews.has(key) || pendingPageViews.has(key)) return false;
  pendingPageViews.add(key);

  const loaded = await ensureGoogleAnalytics();
  if (!getConsentState().analytics) {
    pendingPageViews.delete(key);
    return false;
  }

  if (loaded) {
    gtag("event", "page_view", {
      page_title: String(title || document.title).slice(0, 160),
      page_location: `${window.location.origin}${cleanPath}`,
      page_path: cleanPath,
    });
  }
  sendInternalPageView({ path: cleanPath, title });
  pendingPageViews.delete(key);
  trackedPageViews.add(key);
  return true;
}

export async function fetchAnalyticsSummary({ username, password }) {
  const url = analyticsUrl("/analytics/summary");
  if (!url) throw new Error("Analytics API nije konfiguriran. Postavi VITE_WORKER_URL.");
  const res = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Basic ${btoa(`${username}:${password}`)}` },
  });
  if (res.status === 401) throw new Error("Pogrešno korisničko ime ili lozinka.");
  if (!res.ok) throw new Error("Statistika trenutno nije dostupna.");
  return res.json();
}

export async function resetAnalytics({ username, password }) {
  const url = analyticsUrl("/analytics/reset");
  if (!url) throw new Error("Analytics API nije konfiguriran. Postavi VITE_WORKER_URL.");
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Basic ${btoa(`${username}:${password}`)}` },
  });
  if (res.status === 401) throw new Error("Pogrešno korisničko ime ili lozinka.");
  if (!res.ok) throw new Error("Reset trenutno nije dostupan.");
  return res.json();
}
