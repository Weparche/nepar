import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const DEFAULT_SOCIAL = {
  title: "Nepar Solutions | Digitalna rješenja po mjeri",
  description:
    "Nepar Solutions gradi web aplikacije, AI alate, portale i digitalna rješenja po mjeri.",
  path: "/",
  imagePath: "/brand/web-app-manifest-512x512.png",
  imageAlt: "Nepar Solutions",
  imageWidth: 512,
  imageHeight: 512,
};

const DEFAULT_SITE_URL = "https://nepar.hr";

const MOZGALICA_SOCIAL = {
  title: "Dnevne Asocijacije | Mozgalica",
  description:
    "Poveži 16 pojmova u 4 skrivene grupe. Odaberi temu, riješi asocijacije i izazovi prijatelja.",
  path: "/mozgalica",
  imagePath: "/brand/og-mozgalica.png",
  imageAlt: "Dnevne Asocijacije - Mozgalica na nepar.hr",
  imageWidth: 1200,
  imageHeight: 630,
};

/** Static HTML sites in public/ (served at /vortex/, /zoyya/, etc.) */
const PUBLIC_STATIC_SITES = ["vortex", "zoyya", "lime", "zgalarm"];

function escapeAttr(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function absoluteUrl(siteUrl, path) {
  if (/^https?:\/\//i.test(path)) return path;
  return siteUrl ? `${siteUrl}${path}` : path;
}

function renderSocialMeta(page, siteUrl) {
  const url = absoluteUrl(siteUrl, page.path);
  const image = absoluteUrl(siteUrl, page.imagePath);

  return `<!-- social-meta:start -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Nepar Solutions" />
    <meta property="og:url" content="${escapeAttr(url)}" />
    <meta property="og:title" content="${escapeAttr(page.title)}" />
    <meta property="og:description" content="${escapeAttr(page.description)}" />
    <meta property="og:image" content="${escapeAttr(image)}" />
    <meta property="og:image:secure_url" content="${escapeAttr(image)}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="${page.imageWidth}" />
    <meta property="og:image:height" content="${page.imageHeight}" />
    <meta property="og:image:alt" content="${escapeAttr(page.imageAlt)}" />
    <meta property="og:locale" content="hr_HR" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeAttr(page.title)}" />
    <meta name="twitter:description" content="${escapeAttr(page.description)}" />
    <meta name="twitter:image" content="${escapeAttr(image)}" />
    <meta name="twitter:image:alt" content="${escapeAttr(page.imageAlt)}" />
    <!-- social-meta:end -->`;
}

function applyTemplateMeta(html, page, siteUrl) {
  return html
    .replaceAll("%PAGE_TITLE%", escapeAttr(page.title))
    .replaceAll("%PAGE_DESCRIPTION%", escapeAttr(page.description))
    .replace("%SOCIAL_META%", renderSocialMeta(page, siteUrl));
}

function replaceBuiltMeta(html, page, siteUrl) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(page.title)}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
      `<meta name="description" content="${escapeAttr(page.description)}" />`,
    )
    .replace(
      /<!-- social-meta:start -->[\s\S]*?<!-- social-meta:end -->/,
      renderSocialMeta(page, siteUrl),
    );
}

function publicStaticSitesPlugin() {
  return {
    name: "public-static-sites",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const rawUrl = req.url ?? "";
        const pathname = rawUrl.split("?")[0]?.split("#")[0] ?? "";
        const search = rawUrl.includes("?") ? "?" + rawUrl.split("?")[1].split("#")[0] : "";

        for (const site of PUBLIC_STATIC_SITES) {
          if (pathname === `/${site}`) {
            res.writeHead(301, { Location: `/${site}/${search}` });
            res.end();
            return;
          }
          if (pathname === `/${site}/`) {
            req.url = `/${site}/index.html${search}`;
            break;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const siteUrl = (env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, "");

  return {
    plugins: [
      react(),
      tailwindcss(),
      publicStaticSitesPlugin(),
      {
        name: "html-social-meta",
        transformIndexHtml(html) {
          return applyTemplateMeta(html, DEFAULT_SOCIAL, siteUrl);
        },
        writeBundle(outputOptions) {
          const outDir = outputOptions.dir ?? "dist";
          const indexPath = resolve(outDir, "index.html");
          const mozgalicaPath = resolve(outDir, "mozgalica.html");
          const indexHtml = readFileSync(indexPath, "utf8");
          writeFileSync(
            mozgalicaPath,
            replaceBuiltMeta(indexHtml, MOZGALICA_SOCIAL, siteUrl),
            "utf8",
          );
          // Windows + some hosts treat dist/mozgalica/ as a static route and loop redirects.
          const mozgalicaDir = resolve(outDir, "mozgalica");
          if (existsSync(mozgalicaDir)) {
            rmSync(mozgalicaDir, { recursive: true, force: true });
          }
        },
      },
    ],
  };
});
