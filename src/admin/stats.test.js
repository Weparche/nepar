import test from "node:test";
import assert from "node:assert/strict";
import {
  cleanRows,
  deltaPercent,
  filterChecks,
  filterEvents,
  pageRows,
  quickTotals,
  recentCount,
  resolveRange,
  seriesFor,
  sum,
} from "./stats.js";

const rows = [
  { date: "2026-10-10", path: "/", total: 4, ownerTotal: 1 },
  { date: "2026-10-12", path: "/kids", total: 6, ownerTotal: 0, visitorTotal: 6 },
  { date: "2026-10-12", path: "/kids/igra", total: 2, ownerTotal: 2 },
  { date: "2026-10-16", path: "/", total: 3, ownerTotal: 0 },
  { date: "2026-10-17", path: "/", total: 5, ownerTotal: 1 },
  { date: "2026-10-17", path: "NEPAR Kids · sve stranice", total: 99, ownerTotal: 0 },
];

test("synthetic rollup rows are removed", () => {
  assert.equal(cleanRows(rows).length, 5);
});

test("7-day range ends today and compares with the 7 days before it", () => {
  const range = resolveRange("7d", "2026-10-17", "2026-10-10");
  assert.deepEqual([range.start, range.end, range.days], ["2026-10-11", "2026-10-17", 7]);
  assert.deepEqual(range.previous, { start: "2026-10-04", end: "2026-10-10" });
});

test("month range starts on the 1st and 'all' has no comparison", () => {
  assert.equal(resolveRange("month", "2026-10-17", null).start, "2026-10-01");
  const all = resolveRange("all", "2026-10-17", "2026-10-10");
  assert.equal(all.start, "2026-10-10");
  assert.equal(all.previous, null);
});

test("series fills missing days with zero and respects property and audience", () => {
  const clean = cleanRows(rows);
  const all = seriesFor(clean, { start: "2026-10-10", end: "2026-10-17" });
  assert.equal(all.length, 8);
  assert.equal(sum(all), 20);
  assert.equal(all.find((point) => point.date === "2026-10-11").value, 0);
  assert.equal(sum(seriesFor(clean, { property: "kids", start: "2026-10-10", end: "2026-10-17" })), 8);
  assert.equal(sum(seriesFor(clean, { audience: "others", start: "2026-10-10", end: "2026-10-17" })), 20 - 1 - 2 - 1);
  assert.equal(sum(seriesFor(clean, { audience: "owner", start: "2026-10-10", end: "2026-10-17" })), 4);
});

test("digitalnicjenik.nepar.hr pages are their own property, nepar.hr guides stay on Nepar", () => {
  const sites = [
    { date: "2026-10-17", path: "/digitalnicjenik/", total: 3, ownerTotal: 0 },
    { date: "2026-10-17", path: "/digitalnicjenik/c/auto-gubic", total: 2, ownerTotal: 0 },
    { date: "2026-10-17", path: "/digitalni-cjenik", total: 5, ownerTotal: 0 },
  ];
  const range = { start: "2026-10-17", end: "2026-10-17" };
  assert.equal(sum(seriesFor(sites, { property: "digitalnicjenik", ...range })), 5);
  assert.equal(sum(seriesFor(sites, { property: "nepar", ...range })), 5);
  assert.equal(sum(seriesFor(sites, { property: "kids", ...range })), 0);
});

test("price-list checks follow the property tab", () => {
  const checks = [
    { at: "2026-10-17T10:00:00Z", site: "primjer.hr", status: "red", source: "nepar" },
    { at: "2026-10-17T09:00:00Z", site: "trgovina.hr/cjenik", status: "green", source: "digitalnicjenik" },
    { at: "2026-10-17T08:00:00Z", status: "red", source: "nepar" },
  ];
  assert.equal(filterChecks(checks, "all").length, 2);
  assert.deepEqual(filterChecks(checks, "digitalnicjenik").map((check) => check.site), ["trgovina.hr/cjenik"]);
  assert.equal(filterChecks(checks, "kids").length, 0);
});

test("delta handles a zero baseline", () => {
  assert.equal(deltaPercent(0, 0), 0);
  assert.equal(deltaPercent(5, 0), null);
  assert.equal(deltaPercent(15, 10), 50);
  assert.equal(deltaPercent(5, 10), -50);
});

test("page rows aggregate per path within the range and compute share", () => {
  const clean = cleanRows(rows);
  const table = pageRows(clean, [{ path: "/", title: "Nepar", lastSeen: "x" }], { start: "2026-10-11", end: "2026-10-17" });
  assert.deepEqual(table.map((row) => [row.path, row.value]), [["/", 8], ["/kids", 6], ["/kids/igra", 2]]);
  assert.ok(Math.abs(table.reduce((total, row) => total + row.share, 0) - 1) < 1e-9);
  assert.equal(table[0].title, "Nepar");
});

test("quick totals use today, Monday-start week and calendar month", () => {
  const clean = cleanRows(rows);
  const totals = quickTotals(clean, "2026-10-17", {});
  assert.equal(totals.today, 5);
  assert.equal(totals.weekStart, "2026-10-12");
  assert.equal(totals.week, 6 + 2 + 3 + 5);
  assert.equal(totals.month, 20);
});

test("events are filtered by property and audience; recent count uses a window", () => {
  const events = [
    { at: "2026-10-17T10:00:00Z", path: "/", owner: false },
    { at: "2026-10-17T10:20:00Z", path: "/kids", owner: true },
    { at: "2026-10-17T08:00:00Z", path: "/kids", owner: false },
  ];
  assert.equal(filterEvents(events, { property: "kids" }).length, 2);
  assert.equal(filterEvents(events, { audience: "owner" }).length, 1);
  assert.equal(recentCount(events, Date.parse("2026-10-17T10:30:00Z"), 30), 2);
});
