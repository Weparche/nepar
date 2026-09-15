import test from "node:test";
import assert from "node:assert/strict";
import worker, {
  isForbiddenIp,
  normalizeDigitalPriceListUrl,
  resolvePublicHostname,
} from "./index.js";

const origin = "https://nepar.hr";

function publicResolver(records = {}) {
  return {
    async resolve4(host) { return records[host]?.v4 ?? ["93.184.216.34"]; },
    async resolve6(host) { return records[host]?.v6 ?? []; },
  };
}

async function check(url, fetchImpl, resolver = publicResolver()) {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = fetchImpl;
  try {
    const response = await worker.fetch(new Request("https://worker.nepar.test/api/digitalni-cjenik/check", {
      method: "POST",
      headers: { Origin: origin, "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    }), { DIGITAL_PRICE_LIST_DNS_RESOLVER: resolver });
    return { response, body: await response.json() };
  } finally {
    globalThis.fetch = originalFetch;
  }
}

function routeFetch(routes) {
  return async (url) => {
    const parsed = new URL(url);
    const response = routes[`${parsed.pathname}${parsed.search}`] ?? routes[parsed.pathname];
    return response instanceof Function ? response() : response || new Response("Not found", { status: 404 });
  };
}

test("normalizes bare domains and blocks private URL literals", () => {
  assert.equal(normalizeDigitalPriceListUrl("primjer.hr").href, "https://primjer.hr/");
  assert.throws(() => normalizeDigitalPriceListUrl("ftp://primjer.hr"), /invalid_url/);
  assert.throws(() => normalizeDigitalPriceListUrl("http://127.0.0.1"), /invalid_url/);
  assert.equal(isForbiddenIp("10.0.0.1"), true);
  assert.equal(isForbiddenIp("fd00::1"), true);
});

test("DNS resolution rejects a hostname that resolves to a private destination", async () => {
  await assert.rejects(
    resolvePublicHostname("evil.example", publicResolver({ "evil.example": { v4: ["127.0.0.1"], v6: [] } })),
    /blocked_destination/,
  );
  let called = 0;
  const result = await check("https://evil.example", async () => { called += 1; return new Response("unexpected"); }, publicResolver({ "evil.example": { v4: ["127.0.0.1"], v6: [] } }));
  assert.equal(result.response.status, 400);
  assert.equal(called, 0);
});

test("redirect destinations are DNS-checked before a second outbound fetch", async () => {
  let called = 0;
  const result = await check("https://public.example", async () => {
    called += 1;
    return new Response(null, { status: 302, headers: { Location: "https://private.example/" } });
  }, publicResolver({ "public.example": { v4: ["93.184.216.34"], v6: [] }, "private.example": { v4: ["192.168.1.10"], v6: [] } }));
  assert.equal(result.response.status, 400);
  assert.equal(called, 1);
});

test("a reachable site with no price-list signal is red", async () => {
  const result = await check("https://example.com", routeFetch({ "/": () => new Response("<html><body>Welcome</body></html>", { status: 200 }) }));
  assert.equal(result.body.status, "red");
  assert.equal(result.body.details.reachable, true);
});

test("a PDF price-list link is yellow with the discovered URL", async () => {
  const result = await check("https://example.com", routeFetch({
    "/": () => new Response('<a href="/cjenik.pdf">Cjenik u PDF-u</a>', { status: 200 }),
    "/cjenik.pdf": () => new Response("pdf", { status: 200 }),
  }));
  assert.equal(result.body.status, "yellow");
  assert.equal(result.body.details.pricePageFound, true);
  assert.equal(result.body.details.pricePageUrl, "https://example.com/cjenik.pdf");
  assert.equal(result.body.details.csvFound, false);
});

test("a non-empty publicly reachable CSV is green", async () => {
  const result = await check("https://example.com", routeFetch({
    "/": () => new Response('<a href="/cjenik.csv">Preuzmi cjenik</a>', { status: 200 }),
    "/cjenik.csv": () => new Response("usluga,cijena\nŠišanje,15", { status: 200, headers: { "Content-Type": "text/csv" } }),
  }));
  assert.equal(result.body.status, "green");
  assert.equal(result.body.details.csvUrl, "https://example.com/cjenik.csv");
});

test("a public XML document is green while empty or malformed documents are not", async () => {
  const xml = await check("https://example.com", routeFetch({
    "/": () => new Response('<a href="/cjenik.xml">XML cjenik</a>', { status: 200 }),
    "/cjenik.xml": () => new Response("<?xml version=\"1.0\"?><cjenik></cjenik>", { status: 200, headers: { "Content-Type": "application/xml" } }),
  }));
  assert.equal(xml.body.status, "green");
  assert.equal(xml.body.details.xmlUrl, "https://example.com/cjenik.xml");

  const empty = await check("https://example.com", routeFetch({
    "/": () => new Response('<a href="/cjenik.csv">CSV</a>', { status: 200 }),
    "/cjenik.csv": () => new Response("", { status: 200 }),
  }));
  assert.notEqual(empty.body.status, "green");
});

test("discovers CSV and XML links on a secondary price-list page and falls back after an XML failure", async () => {
  const result = await check("https://klinci.example", routeFetch({
    "/": () => new Response('<a href="/cjenici/">Cjenici</a>', { status: 200 }),
    "/cjenici/": () => new Response([
      '<a href="/izvoz/trenutni?vrsta=proizvodi&#038;format=csv">Trenutni CSV</a>',
      '<a href="/izvoz/trenutni?vrsta=proizvodi&#038;format=xml">Trenutni XML</a>',
      '<a href="/arhiva/cjenik.csv">Arhivirani CSV</a>',
      '<a href="/arhiva/cjenik.xml">Arhivirani XML</a>',
    ].join(""), { status: 200, headers: { "Content-Type": "text/html" } }),
    "/izvoz/trenutni?vrsta=proizvodi&format=csv": () => new Response("usluga,cijena\nŠišanje,15", { status: 200 }),
    "/izvoz/trenutni?vrsta=proizvodi&format=xml": () => { throw new DOMException("Timed out", "AbortError"); },
    "/arhiva/cjenik.csv": () => new Response("usluga,cijena\nŠišanje,15", { status: 200 }),
    "/arhiva/cjenik.xml": () => new Response("<?xml version=\"1.0\"?><cjenik></cjenik>", { status: 200 }),
  }));
  assert.equal(result.body.status, "green");
  assert.equal(result.body.details.pricePageFound, true);
  assert.equal(result.body.details.pricePageUrl, "https://klinci.example/cjenici/");
  assert.equal(result.body.details.csvFound, true);
  assert.equal(result.body.details.xmlFound, true);
  assert.equal(result.body.details.csvUrl, "https://klinci.example/izvoz/trenutni?vrsta=proizvodi&format=csv");
  assert.equal(result.body.details.xmlUrl, "https://klinci.example/arhiva/cjenik.xml");
});

test("keeps an unconfirmed XML link distinct from a missing XML link when CSV is confirmed", async () => {
  const result = await check("https://example.com", routeFetch({
    "/": () => new Response('<a href="/cjenici/">Cjenici</a>', { status: 200 }),
    "/cjenici/": () => new Response('<a href="/cjenik.csv">CSV</a><a href="/izvoz?format=xml">XML</a>', { status: 200 }),
    "/cjenik.csv": () => new Response("usluga,cijena\nŠišanje,15", { status: 200 }),
    "/izvoz": () => new Response("unavailable", { status: 503 }),
  }));
  assert.equal(result.body.status, "green");
  assert.equal(result.body.details.csvFound, true);
  assert.equal(result.body.details.xmlFound, false);
  assert.equal(result.body.details.xmlLinkDiscovered, true);
});

test("a secondary price-list page with only a PDF remains yellow", async () => {
  const result = await check("https://example.com", routeFetch({
    "/": () => new Response('<a href="/cjenici/">Cjenici</a>', { status: 200 }),
    "/cjenici/": () => new Response('<a href="/dokumenti/cjenik.pdf">PDF cjenik</a>', { status: 200 }),
    "/dokumenti/cjenik.pdf": () => new Response("pdf", { status: 200 }),
  }));
  assert.equal(result.body.status, "yellow");
  assert.equal(result.body.details.pricePageFound, true);
  assert.equal(result.body.details.pricePageUrl, "https://example.com/cjenici/");
  assert.equal(result.body.details.csvFound, false);
  assert.equal(result.body.details.xmlFound, false);
});

test("a homepage timeout returns a graceful red result", async () => {
  const result = await check("https://example.com", async () => { throw new DOMException("Timed out", "AbortError"); });
  assert.equal(result.response.status, 200);
  assert.equal(result.body.status, "red");
  assert.equal(result.body.message, "Nismo uspjeli dohvatiti web stranicu.");
});
