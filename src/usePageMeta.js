import { useEffect } from "react";

const DEFAULT_TITLE = "Nepar Solutions | Digitalna rješenja po mjeri";
const DEFAULT_DESCRIPTION =
  "Nepar Solutions gradi web aplikacije, AI alate, portale i digitalna rješenja po mjeri.";

function upsertMeta(attr, key, value) {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

export function usePageMeta({ title, description, path }) {
  useEffect(() => {
    document.title = title;
    upsertMeta("name", "description", description);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);

    const siteUrl = import.meta.env.VITE_SITE_URL?.replace(/\/$/, "");
    if (siteUrl && path) {
      upsertMeta("property", "og:url", `${siteUrl}${path}`);
    }

    return () => {
      document.title = DEFAULT_TITLE;
      upsertMeta("name", "description", DEFAULT_DESCRIPTION);
      upsertMeta("property", "og:title", DEFAULT_TITLE);
      upsertMeta("property", "og:description", DEFAULT_DESCRIPTION);
      upsertMeta("name", "twitter:title", DEFAULT_TITLE);
      upsertMeta("name", "twitter:description", DEFAULT_DESCRIPTION);
      if (siteUrl) upsertMeta("property", "og:url", `${siteUrl}/`);
    };
  }, [title, description, path]);
}
