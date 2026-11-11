import test from "node:test";
import assert from "node:assert/strict";
import worker, { kidsIdempotencyKey } from "./index.js";

const env = { KIDS_SERVICE_TOKEN: "local-kids-token", RESEND_API_KEY: "local-resend-key" };
const email = { to: ["parent@example.test"], subject: "NEPAR Kids", html: "<p>Hi</p>" };
const request = (headers = {}, body = email) => new Request("https://nepar-core/internal/kids/email", {
  method: "POST",
  headers: { "content-type": "application/json", "x-nepar-internal-token": env.KIDS_SERVICE_TOKEN, ...headers },
  body: JSON.stringify(body),
});

async function send(req) {
  const calls = [];
  const saved = globalThis.fetch;
  globalThis.fetch = async (url, init) => { calls.push({ url: String(url), headers: new Headers(init.headers) }); return Response.json({ id: "email_local_1" }); };
  try { return { response: await worker.fetch(req, env, { waitUntil() {} }), calls }; } finally { globalThis.fetch = saved; }
}

test("the Kids outbox idempotency key reaches Resend unchanged", async () => {
  const { response, calls } = await send(request({ "idempotency-key": "NK-0123456789ABCDEF01234567:paid-delivered:2" }));
  assert.equal(response.status, 200);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "https://api.resend.com/emails");
  assert.equal(calls[0].headers.get("idempotency-key"), "NK-0123456789ABCDEF01234567:paid-delivered:2");
});

test("a retry after a crash sends the same key, so Resend can drop the duplicate", async () => {
  const key = "NK-0123456789ABCDEF01234567:paid-confirmed";
  const first = await send(request({ "idempotency-key": key }));
  const retry = await send(request({ "idempotency-key": key }));
  assert.equal(first.calls[0].headers.get("idempotency-key"), retry.calls[0].headers.get("idempotency-key"));
});

test("the body key is used when the header is missing; invalid keys are never forwarded", async () => {
  const fromBody = await send(request({}, { ...email, idempotencyKey: "NK-ABC:paid-admin" }));
  assert.equal(fromBody.calls[0].headers.get("idempotency-key"), "NK-ABC:paid-admin");
  const none = await send(request({}));
  assert.equal(none.calls[0].headers.get("idempotency-key"), null);
  assert.equal(kidsIdempotencyKey("x".repeat(257)), "");
  assert.equal(kidsIdempotencyKey("has space"), "");
  assert.equal(kidsIdempotencyKey(42), "");
});

test("without the internal token nothing is sent", async () => {
  const { response, calls } = await send(new Request("https://nepar-core/internal/kids/email", { method: "POST", body: JSON.stringify(email) }));
  assert.equal(response.status, 401);
  assert.equal(calls.length, 0);
});
