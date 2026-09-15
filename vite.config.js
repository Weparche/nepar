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
  const schema = getStructuredData(page.path);

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

function routeOutputPath(outDir, routePath) {
  if (routePath === "/") return resolve(outDir, "index.html");
  if (routePath === "/404") return resolve(outDir, "404.html");
  return resolve(outDir, `${routePath.slice(1)}.html`);
}

function renderDigitalPriceListStaticBody() {
  return `<main class="site-main" data-nepar-static-content>
    <article class="section-shell" lang="hr">
      <h1>Digitalni cjenik XML/CSV od 1. listopada 2026.</h1>
      <p>Nova pravila od 1. listopada ne odnose se samo na webshopove. Trgovci i pružatelji usluga s vlastitom web stranicom moraju objaviti strojno čitljivi XML ili CSV cjenik, a zasebna Odluka uvodi i obvezu isticanja dodatne odnosno sidrene cijene.</p>
      <p>Od 1. listopada 2026. u Hrvatskoj se primjenjuju dvije povezane obveze vezane uz cijene. Odluka NN 101/2026-1212 uređuje isticanje dodatne odnosno sidrene cijene, dok Odluka NN 101/2026-1213 propisuje objavu digitalnih XML/CSV cjenika za trgovce i pružatelje usluga koji imaju uspostavljene mrežne stranice.</p>
      <p>Objavljeno: 15.09.2026. · Zadnje provjereno prema službenim izvorima: 15.09.2026.</p>
      <h2>Dvije povezane, ali odvojene obveze</h2>
      <h3>Sidrena / dodatna cijena</h3>
      <p>Uz aktualnu cijenu proizvoda ili usluge potrebno je isticati i propisanu dodatnu cijenu. Ako se cijena oglašava na webu, dodatna cijena također se mora odgovarajuće istaknuti.</p>
      <p><a href="https://narodne-novine.nn.hr/clanci/sluzbeni/2026_09_101_1212.html">NN 101/2026-1212</a></p>
      <h3>Digitalni XML/CSV cjenik</h3>
      <p>Ako trgovac ili pružatelj usluge ima vlastitu mrežnu stranicu, Odluka propisuje objavu cjenika u XML ili CSV formatu pogodnom za automatsku obradu. Cjenik mora ostati dostupan 30 dana, a mora biti omogućen i automatizirani dohvat podataka.</p>
      <p><a href="https://narodne-novine.nn.hr/clanci/sluzbeni/2026_09_101_1213.html">NN 101/2026-1213</a></p>
      <h2>Ukratko — dvije povezane obveze</h2>
      <h3>Ako imate web stranicu</h3>
      <dl>
        <dt>Format</dt><dd>XML ili CSV, pogodan za automatsku obradu.</dd>
        <dt>Arhiva</dt><dd>Objavljene verzije moraju ostati dostupne 30 dana.</dd>
        <dt>Automatski dohvat</dt><dd>Podaci moraju biti dostupni softverskim alatima i automatiziranim programima.</dd>
        <dt>Dodatna cijena</dt><dd>Primjenjuje se gdje je propisano zasebnom Odlukom.</dd>
      </dl>
      <h3>Ako nemate web stranicu</h3>
      <p>Obveza objave digitalnog XML/CSV cjenika iz Odluke 1213 vezana je uz trgovce i pružatelje usluga koji imaju uspostavljene mrežne stranice. Zasebna pravila o dodatnoj cijeni mogu se primjenjivati neovisno o tome imate li web.</p>
      <h2>Digitalni cjenik nije obveza samo za webshopove</h2>
      <p>Odluka ne uvjetuje obvezu online prodajom. Obveza objave XML/CSV cjenika vezana je uz postojanje mrežne stranice trgovca odnosno pružatelja usluge.</p>
      <p>Primjeri uključuju restoran ili kafić s webom, salon, autoservis, obrtničke usluge, ordinaciju, veterinarsku praksu, wellness, telekomunikacijske i osiguravajuće usluge te trgovinu. Primjenjivost treba procijeniti prema stvarnoj djelatnosti i službenim pojašnjenjima.</p>
      <h2>Jednom promijenite cijenu. Web se ažurira automatski.</h2>
      <p>Ako cijene već vodite u poslovnom programu, ERP-u, blagajni ili strukturiranom CSV/XML izvoru, NEPAR integracija može koristiti taj sustav kao izvor podataka i automatski objavljivati cjenik na vašoj web stranici.</p>
      <p>Poslovni program / ERP / CSV / XML → NEPAR integracija → vaša web stranica → cjenik za posjetitelje + XML/CSV + arhiva + automatizirani dohvat.</p>
      <h2>Jasne opcije implementacije</h2>
      <ul><li>Provjera web stranice: 0 €</li><li>NEPAR implementacija na postojećem webu: od 129 €; Wix, React / Next / Vite i custom webovi: od 149 €</li><li>WordPress opcija: plugin 79,90 € — u pripremi; plugin + instalacija: 139,80 €</li><li>Tehničko održavanje nakon prve uključene godine: 19,90 € / godišnje</li></ul>
      <h2>Što još nije definirano</h2>
      <p>Odluka navodi obvezne podatke, ali ne propisuje točan CSV delimiter, redoslijed stupaca ni službenu XML/XSD shemu. Hrvatska obrtnička komora najavila je traženje službenih pojašnjenja o obuhvatu, pojedinim djelatnostima i mogućim izuzećima. Ovaj vodič ne zamjenjuje pravno tumačenje.</p>
      <h2>Primjer digitalnog cjenika usluga</h2>
      <p>Struktura je NEPAR-ov tehnički primjer prema obveznim poljima iz NN 101/2026; Odluka ne propisuje službenu CSV/XML shemu.</p>
      <ul><li><a href="/digitalni-cjenik/primjer-usluge.csv">Preuzmite primjer-usluge.csv</a></li><li><a href="/digitalni-cjenik/primjer-usluge.xml">Preuzmite primjer-usluge.xml</a></li></ul>
      <h2>Primjeri po platformama</h2>
      <h3>Kako implementirati digitalni cjenik na WordPress?</h3><p>Strukturirani izvor cijena može generirati javni prikaz, CSV/XML datoteke i arhivu; WooCommerce nije uvjet ako cijene postoje u drugom sustavu.</p>
      <h3>Treba li WooCommerce?</h3><p>Ne. WooCommerce je samo jedna moguća integracija, a rješenje može koristiti poslovni program ili drugi strukturirani izvor.</p>
      <h3>Kako na Wixu?</h3><p>Wix implementacija može povezati javno dostupne CSV/XML datoteke i vidljivi cjenik; tehnički način ovisi o postojećoj strukturi stranice.</p>
      <h3>Kako na React/Vite stranici?</h3><p>Rješenje obično koristi server-side ili API rutu za javni CSV/XML dohvat, prikaz cjenika i arhivu prethodnih verzija.</p>
      <h2>Česta pitanja</h2>
      <h3>Odnosi li se nova obveza samo na webshopove?</h3><p>Ne. Odluka 1213 obvezu objave digitalnog cjenika veže uz trgovca odnosno pružatelja usluge koji ima uspostavljenu mrežnu stranicu, a ne uz samu mogućnost online kupnje.</p>
      <h3>Koja je razlika između sidrene cijene i digitalnog cjenika?</h3><p>Odluka 1212 uređuje isticanje dodatne odnosno sidrene cijene, dok Odluka 1213 uređuje objavu strojno čitljivih XML/CSV cjenika na mrežnim stranicama.</p>
      <h3>Imam samo Facebook ili Instagram?</h3><p>Za poslovanje koje nema vlastitu web stranicu, a koristi samo društvene mreže, konačnu primjenjivost XML/CSV obveze treba provjeriti prema službenim pojašnjenjima. To ne znači da se pravila o dodatnoj cijeni mogu ignorirati pri oglašavanju cijena.</p>
      <h2>Provjereno prema službenim izvorima</h2>
      <ul><li><a href="https://narodne-novine.nn.hr/clanci/sluzbeni/2026_09_101_1212.html">NN 101/2026-1212</a></li><li><a href="https://narodne-novine.nn.hr/clanci/sluzbeni/2026_09_101_1213.html">NN 101/2026-1213</a></li><li><a href="https://hgk.hr/webinar-mjere-izravne-kontrole-cijena-isticanje-dodatne-cijene-i-objava-cjenika-proizvoda-i-usluga-najava">Hrvatska gospodarska komora</a></li><li><a href="https://mingo.gov.hr/vijesti/vlada-rh-usvojila-11-paket-mjera-energetske-mjere-vrijedne-170-14-milijuna-eura-sidrena-cijena-prosiruje-se-na-sve-proizvode-i-usluge/10430">Ministarstvo gospodarstva</a></li><li><a href="https://www.hok.hr/aktualno/danasnja-cijena-svih-proizvoda-i-usluga-postaje-sidrena-cijena-vazna-obavijest">Hrvatska obrtnička komora</a></li></ul>
    </article>
  </main>`;
}

function replaceRouteBody(html, routePath) {
  if (routePath !== "/digitalni-cjenik") return html;
  return html.replace('<div id="root"></div>', `<div id="root">${renderDigitalPriceListStaticBody()}</div>`);
}

function renderSitemap(siteUrl) {
  const urls = SITEMAP_PATHS.map((path) => {
    const lastmod = path === "/digitalni-cjenik" ? "<lastmod>2026-09-15</lastmod>" : "";
    return `  <url><loc>${escapeAttr(absoluteUrl(siteUrl, path))}</loc>${lastmod}</url>`;
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

      for (const routePath of STATIC_HTML_PATHS) {
        const page = getSeoPage(routePath, "hr");
        const outputPath = routeOutputPath(outDir, routePath);
        mkdirSync(dirname(outputPath), { recursive: true });
        writeFileSync(outputPath, replaceRouteBody(replaceBuiltMeta(indexHtml, page, siteUrl), routePath), "utf8");
      }

      writeFileSync(resolve(outDir, "sitemap.xml"), renderSitemap(siteUrl), "utf8");
      writeFileSync(
        resolve(outDir, "robots.txt"),
        `User-agent: *\nAllow: /\n\nUser-agent: OAI-SearchBot\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
        "utf8",
      );
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
