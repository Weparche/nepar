import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShieldCheck, X } from "lucide-react";
import {
  getConsentState,
  setAnalyticsConsent,
  subscribeConsentChanges,
  trackEvent,
} from "./analytics.js";

const OPEN_SETTINGS_EVENT = "nepar:open-consent-settings";

const consentCopy = {
  hr: {
    title: "Vi birate analitiku",
    text: "Nužne postavke održavaju stranicu funkcionalnom. Uz vaše dopuštenje koristimo GA4 i vlastitu analitiku kako bismo razumjeli koje stranice i upiti stvarno pomažu.",
    necessary: "Nužno",
    necessaryText: "Uvijek aktivno — sprema samo vaš izbor privatnosti i funkcionalne postavke.",
    analytics: "Analitika",
    analyticsOn: "Dopuštena — anonimniji podaci o korištenju pomažu nam poboljšati ponudu.",
    analyticsOff: "Isključena — Google tag i interna pageview analitika ostaju blokirani.",
    accept: "Prihvati analitiku",
    reject: "Odbij analitiku",
    close: "Zatvori postavke privatnosti",
    settingsTitle: "Postavke privatnosti",
    policy: "Politika privatnosti",
    settings: "Postavke privatnosti",
  },
  en: {
    title: "You choose analytics",
    text: "Necessary settings keep the website functional. With your permission, we use GA4 and our own analytics to understand which pages and inquiries are genuinely useful.",
    necessary: "Necessary",
    necessaryText: "Always active — stores only your privacy choice and functional preferences.",
    analytics: "Analytics",
    analyticsOn: "Allowed — privacy-conscious usage data helps us improve the offer.",
    analyticsOff: "Off — the Google tag and internal page-view analytics remain blocked.",
    accept: "Accept analytics",
    reject: "Reject analytics",
    close: "Close privacy settings",
    settingsTitle: "Privacy settings",
    policy: "Privacy policy",
    settings: "Privacy settings",
  },
};

function currentDocumentLanguage() {
  return document.documentElement.lang === "en" ? "en" : "hr";
}

export function openConsentSettings() {
  window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
}

export function ConsentSettingsLink({ lang, className = "" }) {
  const locale = lang || (typeof document !== "undefined" ? currentDocumentLanguage() : "hr");
  return (
    <button type="button" className={`consent-settings-link ${className}`.trim()} onClick={openConsentSettings}>
      {consentCopy[locale].settings}
    </button>
  );
}

function linkLocation(element) {
  if (element.closest("footer")) return "footer";
  if (element.closest("header, nav")) return "navigation";
  if (element.closest("form")) return "form";
  return "content";
}

export default function ConsentManager() {
  const location = useLocation();
  const [consent, setConsent] = useState(getConsentState);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [lang, setLang] = useState(currentDocumentLanguage);
  const panelRef = useRef(null);
  const visible = !consent.decided || settingsOpen;
  const text = consentCopy[lang];

  useEffect(() => subscribeConsentChanges(setConsent), []);

  useEffect(() => {
    const observer = new MutationObserver(() => setLang(currentDocumentLanguage()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const open = () => setSettingsOpen(true);
    window.addEventListener(OPEN_SETTINGS_EVENT, open);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, open);
  }, []);

  useEffect(() => {
    const onClick = (event) => {
      const link = event.target.closest?.('a[href^="mailto:"]');
      if (!link) return;
      void trackEvent("click_email", {
        link_location: linkLocation(link),
        page_path: location.pathname,
      });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [location.pathname]);

  useEffect(() => {
    if (!visible) return undefined;
    if (settingsOpen) {
      const firstButton = panelRef.current?.querySelector("button");
      window.requestAnimationFrame(() => firstButton?.focus({ preventScroll: true }));
    }
    const onKeyDown = (event) => {
      if (event.key === "Escape" && consent.decided) setSettingsOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [consent.decided, settingsOpen, visible]);

  function choose(analytics) {
    setAnalyticsConsent(analytics);
    setSettingsOpen(false);
  }

  if (!visible) return null;

  return (
    <aside
      ref={panelRef}
      className={`consent-panel ${location.pathname === "/web" ? "consent-panel--web" : ""}`.trim()}
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-title"
      aria-describedby="consent-description"
      data-testid="consent-panel"
    >
      <div className="consent-panel-heading">
        <span className="consent-panel-icon" aria-hidden="true"><ShieldCheck size={22} /></span>
        <div>
          <h2 id="consent-title">{settingsOpen ? text.settingsTitle : text.title}</h2>
          <p id="consent-description">{text.text}</p>
        </div>
        {consent.decided && (
          <button type="button" className="consent-close" aria-label={text.close} onClick={() => setSettingsOpen(false)}>
            <X aria-hidden="true" size={20} />
          </button>
        )}
      </div>

      {settingsOpen && (
        <div className="consent-categories">
          <div><strong>{text.necessary}</strong><span>{text.necessaryText}</span></div>
          <div>
            <strong>{text.analytics}</strong>
            <span>{consent.analytics ? text.analyticsOn : text.analyticsOff}</span>
          </div>
        </div>
      )}

      <div className="consent-actions">
        <button type="button" className="button button-primary" onClick={() => choose(true)}>{text.accept}</button>
        <button type="button" className="button button-secondary" onClick={() => choose(false)}>{text.reject}</button>
        <Link to="/privatnost" className="consent-policy-link">{text.policy}</Link>
      </div>
    </aside>
  );
}
