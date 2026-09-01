import test from "node:test";
import assert from "node:assert/strict";
import {
  addCalendarMonthsExpiration,
  normalizeAnalyticsPath,
  normalizeAnalyticsReferrer,
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
