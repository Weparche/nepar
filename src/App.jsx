import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./HomePage.jsx";
import { trackPageView } from "./analytics.js";

const ContactPage = lazy(() => import("./ContactPage.jsx"));
const AdminPage = lazy(() => import("./AdminPage.jsx"));
const WebStartPage = lazy(() => import("./WebStartPage.jsx"));
const MozgalicaPage = lazy(() => import("./mozgalica/MozgalicaPage.jsx"));
const NjamkoPage = lazy(() => import("./njamko/NjamkoPage.jsx"));

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const timer = window.setTimeout(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView({ block: "start" });
      }, 80);
      return () => window.clearTimeout(timer);
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    return undefined;
  }, [pathname, hash]);

  return null;
}

function PageViewTracker() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      trackPageView({ path: `${pathname}${search}`, title: document.title });
    }, 250);
    return () => window.clearTimeout(timer);
  }, [pathname, search]);

  return null;
}

function LegacyWebRedirect() {
  const { hash } = useLocation();
  return <Navigate to={`/usluge/izrada-web-stranica${hash || ""}`} replace />;
}

function RouteFallback() {
  return <div className="route-fallback" role="status" aria-live="polite">Učitavanje…</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <PageViewTracker />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/kontakt" element={<ContactPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/usluge/izrada-web-stranica" element={<WebStartPage />} />
          <Route path="/usluge/web-stranica-bez-pocetnog-troska" element={<LegacyWebRedirect />} />
          <Route path="/mozgalica" element={<MozgalicaPage />} />
          <Route path="/njamko" element={<NjamkoPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
