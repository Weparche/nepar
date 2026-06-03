import { useEffect } from "react";

const DEFAULT_TITLE = "Nepar Solutions | Digitalna rješenja po mjeri";
const DEFAULT_DESCRIPTION =
  "Nepar Solutions gradi web aplikacije, AI alate, portale i digitalna rješenja po mjeri.";
const DEFAULT_IMAGE = "/brand/web-app-manifest-512x512.png";
const DEFAULT_IMAGE_ALT = "Nepar Solutions";
const DEFAULT_SITE_URL = "https://nepar.hr";

function upsertMeta(attr, key, value) {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

function absoluteMetaUrl(siteUrl, value) {
  if (!value || /^https?:\/\//i.test(value)) return value;
  return siteUrl ? `${siteUrl}${value}` : value;
}

function upsertSocialImageMeta({
  image,
  imageAlt,
  imageWidth,
  imageHeight,
  siteUrl,
}) {
  const imageUrl = absoluteMetaUrl(siteUrl, image);
  upsertMeta("property", "og:image", imageUrl);
  upsertMeta("property", "og:image:secure_url", imageUrl);
  upsertMeta("property", "og:image:type", "image/png");
  upsertMeta("property", "og:image:alt", imageAlt);
  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:image", imageUrl);
  upsertMeta("name", "twitter:image:alt", imageAlt);

  if (imageWidth) upsertMeta("property", "og:image:width", String(imageWidth));
  if (imageHeight) upsertMeta("property", "og:image:height", String(imageHeight));
}

export function usePageMeta({
  title,
  description,
  path,
  image = DEFAULT_IMAGE,
  imageAlt = DEFAULT_IMAGE_ALT,
  imageWidth = 512,
  imageHeight = 512,
}) {
  useEffect(() => {
    document.title = title;
    upsertMeta("name", "description", description);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);

    const siteUrl =
      import.meta.env.VITE_SITE_URL?.replace(/\/$/, "") ||
      (typeof window !== "undefined" ? window.location.origin : DEFAULT_SITE_URL);
    if (siteUrl && path) {
      upsertMeta("property", "og:url", `${siteUrl}${path}`);
    }
    upsertSocialImageMeta({
      image,
      imageAlt,
      imageWidth,
      imageHeight,
      siteUrl,
    });

    return () => {
      document.title = DEFAULT_TITLE;
      upsertMeta("name", "description", DEFAULT_DESCRIPTION);
      upsertMeta("property", "og:title", DEFAULT_TITLE);
      upsertMeta("property", "og:description", DEFAULT_DESCRIPTION);
      upsertMeta("name", "twitter:title", DEFAULT_TITLE);
      upsertMeta("name", "twitter:description", DEFAULT_DESCRIPTION);
      if (siteUrl) upsertMeta("property", "og:url", `${siteUrl}/`);
      upsertSocialImageMeta({
        image: DEFAULT_IMAGE,
        imageAlt: DEFAULT_IMAGE_ALT,
        imageWidth: 512,
        imageHeight: 512,
        siteUrl,
      });
    };
  }, [description, image, imageAlt, imageHeight, imageWidth, path, title]);
}
