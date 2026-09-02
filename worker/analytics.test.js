import test from "node:test";
import assert from "node:assert/strict";
import {
  addCalendarMonthsExpiration,
  normalizeAnalyticsPath,
  normalizeAnalyticsReferrer,
  sanitizeAttribution,
  sanitizeAttributionValue,
} from "./index.js";
import worker from "./index.js";

function asIso(seconds) {
  return new Date(seconds * 1000).toISOString();
}

test("calendar retention adds 14 real months and clamps invalid days", () => {
  assert.equal(
    asIso(addCalendarMonthsExpiration("2027-12-31T12:34:56.000Z")),
    "2029-02-28T12:34:56.000Z",
  );
  assert.equal(
    asIso(addCalendarMonthsExpiration("2026-01-31T00:00:00.000Z")),
    "2027-03-31T00:00:00.000Z",
  );
  assert.equal(
    asIso(addCalendarMonthsExpiration("2024-12-31T00:00:00.000Z")),
    "2026-02-28T00:00:00.000Z",
  );
});

test("analytics paths and referrers discard query strings and hashes", () => {
  assert.equal(
    normalizeAnalyticsPath("https://nepar.hr/kontakt?email=ana@example.com#forma"),
    "/kontakt",
  );
  assert.equal(
    normalizeAnalyticsReferrer("https://google.com/search?q=private#result"),
    "https://google.com/search",
  );
  assert.equal(normalizeAnalyticsReferrer("mailto:someone@example.com"), "");
});

test("attribution trims controls, truncates known fields, ignores unknown fields, and pins web landing path", () => {
  const longValue = `  chat\u0000gpt-${"x".repeat(200)}  `;
  const sanitized = sanitizeAttributionValue(longValue);
  assert.equal(sanitized.length, 160);
  assert.ok(sanitized.startsWith("chatgpt-"));
  assert.deepEqual(sanitizeAttribution({
    utm_source: longValue,
    utm_medium: " paid ",
    utm_campaign: "web_hr",
    utm_content: "hero-a",
    utm_term: "izrada weba",
    gclid: "must-not-leak",
    landing_path: "/attacker-controlled",
  }, "web_landing"), {
    utm_source: sanitized,
    utm_medium: "paid",
    utm_campaign: "web_hr",
    utm_content: "hero-a",
    utm_term: "izrada weba",
    landing_path: "/web",
  });
});

test("web landing contact email includes escaped phone and authoritative attribution", async () => {
  const originalFetch = globalThis.fetch;
  let resendPayload;
  globalThis.fetch = async (_url, options) => {
    resendPayload = JSON.parse(options.body);
    return new Response('{"id":"email-1"}', { status: 200, headers: { "Content-Type": "application/json" } });
  };

  try {
    const response = await worker.fetch(new Request("https://worker.nepar.test/", {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: "https://nepar.hr" },
      body: JSON.stringify({
        formName: "web_landing",
        name: "Ana <script>",
        email: "ana@example.com",
        phone: "+385 91 123 4567",
        subject: "Upit za novu web-stranicu",
        message: "Trebam <strong>novi web</strong>.",
        attribution: {
          utm_source: " chatgpt ",
          utm_medium: "paid",
          utm_campaign: "web_hr",
          unknown: "ignore-me",
          landing_path: "/not-web",
        },
      }),
    }), { RESEND_API_KEY: "test-key" });

    assert.equal(response.status, 200);
    assert.equal(resendPayload.reply_to, "ana@example.com");
    assert.match(resendPayload.text, /Telefon: \+385 91 123 4567/);
    assert.match(resendPayload.text, /landing_path: \/web/);
    assert.doesNotMatch(resendPayload.text, /unknown:/);
    assert.match(resendPayload.html, /Ana &lt;script&gt;/);
    assert.match(resendPayload.html, /Trebam &lt;strong&gt;novi web&lt;\/strong&gt;\./);
    assert.doesNotMatch(resendPayload.html, /<script>/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("pageview writes pseudonymous and daily KV records with absolute expiration", async () => {
  const values = new Map();
  const writes = [];
  const kv = {
    async get(key, type) {
      const value = values.get(key);
      if (value === undefined) return null;
      return type === "json" ? JSON.parse(value) : value;
    },
    async put(key, value, options) {
      values.set(key, value);
      writes.push({ key, value: JSON.parse(value), options });
    },
    async list() {
      return { keys: [], list_complete: true };
    },
    async delete(key) {
      values.delete(key);
    },
  };
  const expectedBefore = addCalendarMonthsExpiration(new Date());
  const response = await worker.fetch(new Request("https://worker.nepar.test/analytics/pageview", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: "https://nepar.hr" },
    body: JSON.stringify({
      path: "/kontakt?email=private@example.com#forma",
      referrer: "https://google.com/search?q=private#result",
      title: "Kontakt | Nepar Solutions",
      visitorId: "7ff4f64d-36ab-4ab8-a281-e715f23efb63",
      device: "desktop",
    }),
  }), { ANALYTICS: kv });
  const expectedAfter = addCalendarMonthsExpiration(new Date());

  assert.equal(response.status, 200);
  const retainedWrites = writes.filter(({ key }) => (
    key.startsWith("analytics:day:")
      || key.startsWith("analytics:visitor:")
      || key.startsWith("analytics:dayvisitor:")
      || key === "analytics:recent"
  ));
  assert.equal(retainedWrites.length, 4);
  for (const write of retainedWrites) {
    assert.equal(typeof write.options?.expiration, "number");
    assert.ok(write.options.expiration >= expectedBefore && write.options.expiration <= expectedAfter);
    assert.equal(write.options.expirationTtl, undefined);
  }
  const page = writes.find(({ key }) => key === "analytics:page:%2Fkontakt");
  assert.deepEqual(Object.keys(page.value.referrers), ["https://google.com/search"]);
});
