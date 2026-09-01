import { useEffect } from "react";
import {
  DEFAULT_SOCIAL_IMAGE,
  getSeoPage,
  getStructuredData,
  SITE_URL,
} from "./seoConfig.js";

function upsertMeta(attr, key, value) {
  let element = document.querySelector(`meta[${attr}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", value);
}

function upsertLink(rel, href) {
  let element = document.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
}

function removeLink(rel) {
  document.querySelector(`link[rel="${rel}"]`)?.remove();
}

function absoluteUrl(siteUrl, value) {
  if (!value || /^https?:\/\//i.test(value)) return value;
  if (value === "/") return `${siteUrl}/`;
  return `${siteUrl}${value}`;
}

function updateStructuredData(schema) {
  document.querySelectorAll("script[data-nepar-schema]").forEach((element) => element.remove());
  if (!schema) return;
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.dataset.neparSchema = "true";
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

function applyPageMeta(page, siteUrl) {
  const canonical = page.canonicalPath ? absoluteUrl(siteUrl, page.canonicalPath) : "";
  const image = absoluteUrl(siteUrl, page.image || DEFAULT_SOCIAL_IMAGE);

  document.title = page.title;
  document.documentElement.lang = page.lang;
  upsertMeta("name", "description", page.description);
  upsertMeta("name", "robots", page.robots);
  upsertMeta("property", "og:title", page.title);
  upsertMeta("property", "og:description", page.description);
  upsertMeta("property", "og:url", canonical || absoluteUrl(siteUrl, page.path));
  upsertMeta("property", "og:image", image);
  upsertMeta("property", "og:image:secure_url", image);
  upsertMeta("property", "og:image:type", "image/png");
  upsertMeta("property", "og:image:width", String(page.imageWidth));
  upsertMeta("property", "og:image:height", String(page.imageHeight));
  upsertMeta("property", "og:image:alt", page.imageAlt);
  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:title", page.title);
  upsertMeta("name", "twitter:description", page.description);
  upsertMeta("name", "twitter:image", image);
  upsertMeta("name", "twitter:image:alt", page.imageAlt);

  if (canonical) upsertLink("canonical", canonical);
  else removeLink("canonical");

  updateStructuredData(getStructuredData(page.path));
}

/** Apply localized metadata from the central SEO route registry. */
export function usePageMeta(pathOrOptions, lang = "hr") {
  const path = typeof pathOrOptions === "string" ? pathOrOptions : pathOrOptions?.path || "/";
  const locale = typeof pathOrOptions === "string" ? lang : pathOrOptions?.lang || lang;

  useEffect(() => {
    const siteUrl = (import.meta.env.VITE_SITE_URL || SITE_URL).replace(/\/$/, "");
    applyPageMeta(getSeoPage(path, locale), siteUrl);

    return () => {
      applyPageMeta(getSeoPage("/", "hr"), siteUrl);
    };
  }, [locale, path]);
}
