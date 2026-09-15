---
target: src/CjenikPage.jsx and src/CjenikArhivaPage.jsx (/cjenik + /cjenik/arhiva)
total_score: 26
max_score: 36
na_heuristics: 9
p0_count: 1
p1_count: 2
target_identity: "file:C:\\Nepar\\src\\CjenikPage.jsx"
target_fingerprint: "sha256:5c5df732234974f6186cb30ce1a4d88b8574202fcd598e7aec771d2f9b20dd24"
target_path: "C:\\Nepar\\src\\CjenikPage.jsx"
timestamp: 2026-09-15T21-43-01Z
slug: src-cjenikpage-jsx
---
Method: dual-agent (A: design-review sub-agent · B: detector/browser-evidence sub-agent)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Clear "as-of" timestamp/storage number on /cjenik; undercut by a raw ISO string as the archive item's label |
| 2 | Match System / Real World | 3 | Correct Croatian regulatory vocabulary, translated in footnotes; `nepar_cijena_od` (a machine field name) leaks into consumer copy |
| 3 | User Control and Freedom | 3 | Clear back-link on the archive page; no dead ends, but no cross-link back to the sibling `/digitalni-cjenik` explainer |
| 4 | Consistency and Standards | 2 | The real, legally load-bearing 24-row table has less mobile/responsive care than the 2-row illustrative example table on the sibling marketing page |
| 5 | Error Prevention | 3 | Null-safe rendering throughout; no guard against a malformed/missing `supersededAt` in archive snapshots |
| 6 | Recognition Rather Than Recall | 4 | Everything needed is inline; no prior-screen memory required |
| 7 | Flexibility and Efficiency | 3 | Genuinely applicable here: the page serves both a human reader (table) and a machine/regulator (CSV/XML) well |
| 8 | Aesthetic and Minimalist Design | 2 | Section-level styling matches the design system; the 24-row flat table gives every row identical visual weight |
| 9 | Error Recovery | n/a | No user-triggered error states exist on a static reference page |
| 10 | Help and Documentation | 3 | Point-of-need footnotes explain "sidrena cijena"/"cijena od" jargon; the asterisk that triggers the footnote isn't linked to it for assistive tech |
| **Total** | | **26/36** | **Good** |

## Design Specificity Verdict

**LLM assessment:** Partially authored, partially generic. The data/copy layer is genuinely specific to this exact legal artifact — `cjenikMeta.js`/`cjenikRender.js` carry real thought about what happens when the regulation is silent (the `nepar_`-prefixed extension fields, the code comment explaining that "cijena od" semantics must never be silently lost by converting to a plain number), and the footnotes explain jargon exactly where suspicion would arise. But the visual/interaction layer is a stock Tailwind data table — one flat `<thead>`/`<tbody>`, no grouping, no responsive fallback, no caption — indistinguishable from a generic pricing-table generator. Tellingly, the sibling *marketing* page's 2-row illustrative example table already has a stacked-mobile pattern that the real, legally load-bearing 24-row table lacks. The compliance page under-invests in craft exactly where the brief says mobile scannability matters most.

**Deterministic scan:** Clean at the source level — `impeccable detect --json` returned exit 0 / `[]` for both files, no static anti-patterns. The browser-injected detector found 9 issues on `/cjenik` and 3 on `/cjenik/arhiva`, but most are false positives once traced to source: `em-dash-overuse` (31) is 24 "—" no-value placeholders in the price/anchor-price columns plus 5 "— (nova usluga)" cells, not prose style; `gpt-thin-border-wide-shadow` traces to the site-wide cookie-consent panel (`src/styles.css`), unrelated to these two files; `cramped-padding` on the table wrapper misses that the actual `<td>`/`<th>` cells carry `px-5 py-4`; `hero-eyebrow-chip` is a mandatory Official Gazette citation, not a decorative template flourish. The **`line-length` findings are real**, though: `odNote` and `newServiceNote` render at ~146–171 characters per line with no `max-w-*` constraint, unlike the page's own `lead` paragraph (`max-w-3xl`) — an actual, confirmed readability regression on exactly the two paragraphs carrying the legal disclaimers.

**Visual evidence:** Automated headless screenshots (Chromium, 1280×900 and 390×844) were captured for both routes and confirm the light-canvas, one-accent-per-component system renders correctly, with visible `*` markers on "od"-priced rows and a working CSV/XML/archive link row. These were captured for this critique's evidence trail, not injected into your own open browser tab — I can hand you the image files directly if useful.

## Overall Impression

The compliance backbone is unusually well thought-through for something this "boring" — the anchor-price null-handling, the `nepar_` extension-field convention, and the point-of-need footnotes all show someone actually read the regulation rather than shipping a generic pricing table. But the actual table — the one artifact both a comparison-shopping SME owner and a regulator will stare at — is currently the least-designed part of the whole feature, and the archive page has one real bug (a raw ISO timestamp as a version's headline label) sitting right next to the one piece of information (the human-readable date) it's supposed to convey.

## What's Working

1. **Legal-null handling in `cjenikRender.js`/`cjenikMeta.js`** — the explicit code comment that "cijena od" semantics must never be silently lost by converting to a plain number, backed by real `nepar_cijena_od`/`nepar_napomena` extension fields, is specific engineering-for-the-brief, not boilerplate.
2. **Point-of-need footnotes** — `odNote` and `newServiceNote` explain "sidrena cijena"/"cijena od" directly under the table, right where a reader's confusion would actually occur, instead of a separate buried FAQ.
3. **Structured data and language sync** — `seoConfig.js`'s `cjenikOffers()` builds a real `OfferCatalog` from the live `nepaUsluge` array (not a hand-copied duplicate), and `usePageMeta.js` correctly syncs `<html lang>` on every toggle.

## Priority Issues

**[P0] Archive version label renders as a raw ISO timestamp**
Why it matters: `CjenikArhivaPage.jsx:93` passes `snapshot.meta.publishedAt` straight through as the bold headline label for a past version (`2026-08-01T10:00:00`), while the very next line correctly formats the same kind of value with `.replace("T"," ")`. A visitor checking "when did this price change" is handed the one unformatted date on the page, in the one place designed to answer exactly that question.
Fix: Apply the same `.replace("T"," ")` (or a proper `Intl.DateTimeFormat`) to the value before it's used as `label` in `VersionRow`.
Suggested command: /impeccable polish

**[P1] Billing frequency ("naplata") is modeled but never shown**
Why it matters: `cjenikData.js` gives every service a `naplata` field ("jednokratno"/"godišnje"/"mjesečno"/"po satu"), but `formatCjenikDisplayPrice` only appends a suffix for two addon rows that happen to have a manually-set `displaySuffix*`. So `Web Basic` (one-time) and `Održavanje Basic` (recurring annual) both render as a bare price with no cadence — on a page whose entire legal purpose is disclosing the real retail price, a reader can't tell a one-time fee from a recurring one.
Fix: Derive the suffix from `naplata` for every row (or add a "Naplata" column), not just the two rows with a manually-set override.
Suggested command: /impeccable clarify

**[P1] 24-row table has no grouping and no mobile-responsive fallback**
Why it matters: `CjenikPage.jsx` renders all 24 services in one flat `<tbody>` with `overflow-x-auto` and `min-w-[720px]`, forcing horizontal scroll on a ~390px viewport — for a site whose own product context names mobile SME owners as the primary user. The categories already exist as comments in `cjenikData.js` (web, redesign, maintenance, social, add-ons, new cjenik services) but never reach the rendered table, and the sibling marketing page's 2-row demo table already has the stacked mobile pattern this real table lacks.
Fix: Port the `dl`-based responsive pattern from `DigitalPriceListPage.jsx`'s example table, and add category subheadings using the grouping already implicit in the data file.
Suggested command: /impeccable adapt

**[P2] Table has no accessible caption; the "od" asterisk isn't linked to its footnote**
Why it matters: The `<table>` has no `<caption>`, so a screen-reader user jumping to it via table navigation gets bare column headers with no statement of what the table is. Separately, the `*` marker on "od"-priced rows has no `aria-describedby` pointing at `odNote` — a screen-reader hears "star" with no route to its meaning.
Fix: Add a visually-hidden `<caption>{copy.title}</caption>`, and wrap the asterisk in `<sup aria-describedby="cjenik-od-note">` linked to the note's `id`.
Suggested command: /impeccable audit

**[P2] Legal footnote paragraphs exceed comfortable line length**
Why it matters: The detector independently confirmed this — `odNote` and `newServiceNote` render at ~146–171 characters/line with no width constraint, while the page's own `lead` paragraph is capped at `max-w-3xl`. These two paragraphs carry the legal clarification text (what "cijena od" and "no sidrena cijena" mean) — exactly the copy that most needs to be easy to read, not the least.
Fix: Add a matching `max-w-*` to the two footnote `<p>` elements.
Suggested command: /impeccable typeset

## Persona Red Flags

**Jordan (First-Timer, comparing offers on mobile):** The five new "digitalni cjenik" meta-services (NEPAR selling this same compliance feature to *other* businesses) sit visually identical to Jordan's actual candidates (Web Basic, Redizajn Business, etc.) with nothing distinguishing the two product lines. The "sidrena cijena" column header has no inline definition — Jordan must scroll to a small footnote to learn what it means, likely after already misreading the column. On mobile, Jordan hits a horizontally-scrolling 720px-wide table immediately.

**Sam (Accessibility-Dependent User):** Real positives — semantic `<table>`/`<th>`, `aria-hidden` on decorative icons, visible focus rings, `<html lang>` synced to the toggle. Red flags: no `<caption>` (P2 above), the asterisk-to-footnote link is visual-only (P2 above), and the `overflow-x-auto` wrapper around the table has no `tabIndex="0"`, so a keyboard-only user with no touch/trackpad may not be able to scroll it horizontally at all to reach columns cut off at narrow widths.

**Riley (Stress-Tester):** `retainedSnapshots()` computes `now - new Date(snapshot.meta.supersededAt).getTime()` with no guard for a malformed or missing `supersededAt` — currently safe only because the archive script always sets it correctly, a process guarantee rather than a code one. Riley would also flag that `publishedAt`/`brojPohrane` are, by the code's own comment, "ISKLJUČIVO ručno" (manual-only) — nothing in the build enforces that `npm run cjenik:archive` actually ran before a price edit, which is a real risk for a feature whose whole purpose is 30-day legal retention.

## Minor Observations

- The €0 "Provjera digitalnog cjenika" row renders as `"0,00 €"` in the same visual weight as paid rows — a "Besplatno" label would read more clearly than a formatted zero.
- The canonical filename (e.g. `mrezna-stranica_koprivnicka-ulica-52-10000-zagreb_WEB-NEPAR-01_01_2026-09-15_22-45-00.csv`) renders as unstyled inline link text inside a paragraph and will wrap awkwardly at narrow widths; consider `<code>`-style treatment.
- The relationship between `/cjenik` and the sibling `/digitalni-cjenik` explainer is currently one-directional (footer links to `/digitalni-cjenik`, nothing on `/cjenik` links back), even though the two are conceptually one product.
- No motion is used on either page, which trivially satisfies `prefers-reduced-motion` — a fine, if unambitious, choice for a Read-mode page.

## Questions to Consider

1. What if the primary "user" of this page is genuinely a non-JS regulator's crawler? Does the prerendered static snapshot (`renderCjenikHtmlBody`) carry the same missing grouping/caption as the React version, or worse?
2. What if a developer forgets the manual `npm run cjenik:archive` step before editing a price? Is there anything — a build check, a git hook — that would actually catch a `cjenikData.js` edit landing without a matching archive snapshot, or does 30-day legal retention rest entirely on human memory?
3. What if this table's whole point is letting a visitor catch a price increase — should it be the one place on the site that proactively flags `cijena !== sidrenaCijena` rows, rather than asking every reader to manually diff two numbers across 24 rows themselves?
