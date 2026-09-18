import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  getSeoPage,
  getStructuredData,
  SITE_URL,
  SITEMAP_PATHS,
  STATIC_HTML_PATHS,
} from "./src/seoConfig.js";
import {
  DIGITAL_PRICE_LIST_GUIDE_PATHS,
  getDigitalPriceListGuideSeoPage,
  getDigitalPriceListGuideStructuredData,
} from "./src/digitalPriceListGuides.js";
import { routeOutputPath } from "./src/seoRoutes.js";
import { nepaUsluge } from "./src/cjenikData.js";
import { cjenikMeta, canonicalCjenikFilename } from "./src/cjenikMeta.js";
import { renderCjenikCsv, renderCjenikXml } from "./src/cjenikRender.js";
import { retainedSnapshots } from "./scripts/cjenikArchive.js";

/** Static HTML sites copied from public/ and served from a subdirectory. */
const PUBLIC_STATIC_SITES = ["fabela"];

function escapeAttr(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function absoluteUrl(siteUrl, path) {
  if (/^https?:\/\//i.test(path)) return path;
  if (path === "/") return `${siteUrl}/`;
  return `${siteUrl}${path}`;
}

function safeJson(value) {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}

function renderSeoHead(page, siteUrl) {
  const canonical = page.canonicalPath ? absoluteUrl(siteUrl, page.canonicalPath) : "";
  const image = absoluteUrl(siteUrl, page.image);
  const schema = getDigitalPriceListGuideStructuredData(page.path) || getStructuredData(page.path);

  return `<!-- seo-meta:start -->
    <meta name="robots" content="${escapeAttr(page.robots)}" />
    ${canonical ? `<link rel="canonical" href="${escapeAttr(canonical)}" />` : ""}
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Nepar Solutions" />
    <meta property="og:url" content="${escapeAttr(canonical || absoluteUrl(siteUrl, page.path))}" />
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
    ${schema ? `<script type="application/ld+json" data-nepar-schema>${safeJson(schema)}</script>` : ""}
    <!-- seo-meta:end -->`.replace(/[ \t]+$/gm, "");
}

function applyTemplateMeta(html, page, siteUrl) {
  return html
    .replaceAll("%PAGE_TITLE%", escapeAttr(page.title))
    .replaceAll("%PAGE_DESCRIPTION%", escapeAttr(page.description))
    .replace("%SOCIAL_META%", renderSeoHead(page, siteUrl));
}

function replaceBuiltMeta(html, page, siteUrl) {
  return html
    .replace(/<html\s+lang="[^"]*"/, `<html lang="${page.lang}"`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(page.title)}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
      `<meta name="description" content="${escapeAttr(page.description)}" />`,
    )
    .replace(
      /<!-- seo-meta:start -->[\s\S]*?<!-- seo-meta:end -->/,
      renderSeoHead(page, siteUrl),
    );
}

function sitemapLastmod(path) {
  const page = getDigitalPriceListGuideSeoPage(path) || getSeoPage(path, "hr");
  return page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : "";
}

function renderSitemap(siteUrl) {
  const sitemapPaths = [...new Set([...SITEMAP_PATHS, ...DIGITAL_PRICE_LIST_GUIDE_PATHS])];
  const urls = sitemapPaths.map((path) => {
    return `  <url><loc>${escapeAttr(absoluteUrl(siteUrl, path))}</loc>${sitemapLastmod(path)}</url>`;
  }).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function publicStaticSitesPlugin() {
  return {
    name: "public-static-sites",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const rawUrl = req.url ?? "";
        const pathname = rawUrl.split("?")[0]?.split("#")[0] ?? "";
        const search = rawUrl.includes("?") ? `?${rawUrl.split("?")[1].split("#")[0]}` : "";

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

function routeSeoPlugin(siteUrl) {
  return {
    name: "route-seo",
    transformIndexHtml(html) {
      return applyTemplateMeta(html, getSeoPage("/", "hr"), siteUrl);
    },
    writeBundle(outputOptions) {
      const outDir = outputOptions.dir ?? "dist";
      const indexPath = resolve(outDir, "index.html");
      const indexHtml = readFileSync(indexPath, "utf8");
      const archiveDir = resolve(process.cwd(), "cjenik-archive");

      for (const routePath of STATIC_HTML_PATHS) {
        const page = getSeoPage(routePath, "hr");
        const outputPath = routeOutputPath(outDir, routePath);
        mkdirSync(dirname(outputPath), { recursive: true });
        writeFileSync(outputPath, replaceBuiltMeta(indexHtml, page, siteUrl), "utf8");
      }

      for (const routePath of DIGITAL_PRICE_LIST_GUIDE_PATHS) {
        const page = getDigitalPriceListGuideSeoPage(routePath);
        const outputPath = routeOutputPath(outDir, routePath);
        mkdirSync(dirname(outputPath), { recursive: true });
        writeFileSync(outputPath, replaceBuiltMeta(indexHtml, page, siteUrl), "utf8");
      }

      writeFileSync(resolve(outDir, "sitemap.xml"), renderSitemap(siteUrl), "utf8");
      writeFileSync(
        resolve(outDir, "robots.txt"),
        `User-agent: *\nAllow: /\n\nUser-agent: OAI-SearchBot\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
        "utf8",
      );

      const cjeniciDir = resolve(outDir, "cjenici");
      mkdirSync(cjeniciDir, { recursive: true });

      const currentCsv = renderCjenikCsv(nepaUsluge);
      const currentXml = renderCjenikXml(nepaUsluge, cjenikMeta);
      writeFileSync(resolve(cjeniciDir, canonicalCjenikFilename(cjenikMeta, "csv")), currentCsv, "utf8");
      writeFileSync(resolve(cjeniciDir, canonicalCjenikFilename(cjenikMeta, "xml")), currentXml, "utf8");
      // /cjenik.csv i /cjenik.xml su praktični "trenutni" alias na kanonske datoteke iznad.
      writeFileSync(resolve(outDir, "cjenik.csv"), currentCsv, "utf8");
      writeFileSync(resolve(outDir, "cjenik.xml"), currentXml, "utf8");

      for (const snapshot of retainedSnapshots(archiveDir)) {
        writeFileSync(resolve(cjeniciDir, canonicalCjenikFilename(snapshot.meta, "csv")), renderCjenikCsv(snapshot.usluge), "utf8");
        writeFileSync(resolve(cjeniciDir, canonicalCjenikFilename(snapshot.meta, "xml")), renderCjenikXml(snapshot.usluge, snapshot.meta), "utf8");
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const siteUrl = (env.VITE_SITE_URL || SITE_URL).replace(/\/$/, "");

  return {
    plugins: [
      react(),
      tailwindcss(),
      publicStaticSitesPlugin(),
      routeSeoPlugin(siteUrl),
    ],
  };
});