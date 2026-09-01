import { existsSync, lstatSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const distDir = resolve(process.cwd(), "dist");
const failures = [];

function read(relativePath) {
  const filePath = resolve(distDir, relativePath);
  if (!existsSync(filePath)) {
    failures.push(`Missing dist/${relativePath}`);
    return "";
  }
  return readFileSync(filePath, "utf8");
}

function expect(relativePath, pattern, message) {
  const contents = read(relativePath);
  if (typeof pattern === "string" ? !contents.includes(pattern) : !pattern.test(contents)) {
    failures.push(`${relativePath}: ${message}`);
  }
}

const mozgalicaDir = resolve(distDir, "mozgalica");
if (existsSync(mozgalicaDir) && lstatSync(mozgalicaDir).isDirectory()) {
  failures.push("dist/mozgalica/ must not be a directory; it causes clean-URL redirect loops.");
}

for (const file of [
  "index.html",
  "kontakt.html",
  "privatnost.html",
  "usluge/izrada-web-stranica.html",
  "mozgalica.html",
  "njamko.html",
  "admin.html",
  "404.html",
]) read(file);

expect(
  "usluge/izrada-web-stranica.html",
  "<title>Izrada web-stranica za obrte i tvrtke | Nepar</title>",
  "route-specific title is missing from raw HTML",
);
expect(
  "usluge/izrada-web-stranica.html",
  /<meta name="description" content="Izrada modernih,[^"]+" \/>/,
  "route-specific description is missing from raw HTML",
);
expect(
  "usluge/izrada-web-stranica.html",
  '<link rel="canonical" href="https://nepar.hr/usluge/izrada-web-stranica" />',
  "canonical is missing from raw HTML",
);
expect(
  "usluge/izrada-web-stranica.html",
  /<script type="application\/ld\+json" data-nepar-schema>/,
  "service JSON-LD is missing",
);
expect("usluge/izrada-web-stranica.html", "OfferCatalog", "service offer schema is missing");
expect("usluge/izrada-web-stranica.html", "FAQPage", "FAQPage schema is missing");
expect("usluge/izrada-web-stranica.html", "BreadcrumbList", "breadcrumb schema is missing");
expect("kontakt.html", "ContactPage", "ContactPage schema is missing");
expect("mozgalica.html", "SoftwareApplication", "SoftwareApplication schema is missing");
expect("njamko.html", "SoftwareApplication", "SoftwareApplication schema is missing");
expect("admin.html", '<meta name="robots" content="noindex,nofollow" />', "admin must be noindex,nofollow");
expect("404.html", '<meta name="robots" content="noindex,nofollow" />', "404 must be noindex,nofollow");

const expectedSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://nepar.hr/</loc></url>
  <url><loc>https://nepar.hr/usluge/izrada-web-stranica</loc></url>
  <url><loc>https://nepar.hr/kontakt</loc></url>
  <url><loc>https://nepar.hr/privatnost</loc></url>
  <url><loc>https://nepar.hr/mozgalica</loc></url>
  <url><loc>https://nepar.hr/njamko</loc></url>
</urlset>
`;
if (read("sitemap.xml") !== expectedSitemap) failures.push("sitemap.xml must contain exactly the six canonical URLs.");

const expectedRobots = `User-agent: *
Allow: /

Sitemap: https://nepar.hr/sitemap.xml
`;
if (read("robots.txt") !== expectedRobots) failures.push("robots.txt does not match the locked specification.");

const redirects = read("_redirects");
for (const rule of [
  "/kontakt/ /kontakt 301",
  "/privatnost/ /privatnost 301",
  "/usluge/izrada-web-stranica/ /usluge/izrada-web-stranica 301",
  "/mozgalica/ /mozgalica 301",
  "/njamko/ /njamko 301",
]) {
  if (!redirects.includes(rule)) failures.push(`_redirects: missing ${rule}`);
}
if (redirects.includes("/* /index.html 200")) failures.push("_redirects: catch-all SPA rewrite would hide real 404 responses.");

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log("Verified route HTML, schema, sitemap, robots, canonical redirects, and 404 artifact.");
