# NEPAR Demo Engine

Cloudflare-native interni alat za pripremu, QA i ljudsko odobravanje personaliziranih prodajnih demo webova na hostnameovima poput `fabela.nepar.hr`.

Jedan Worker servira sve demo hostnameove. D1 čuva leadove, demo sadržaj, workflow i nenametljive događaje; R2 čuva desktop/mobile screenshotove. Sustav namjerno staje na događaju `demo_approved_for_outreach` — u ovoj fazi ništa ne šalje e-mailom.

## Što je uključeno

- strogo validirani lead i demo payloadovi s provenance zapisom za svaku uslugu i proof point
- šest različitih vertikalnih design systema
- idempotentan create, rollback kod neuspjelog Custom Domain attachanja i zaštita reserved hostova
- provjera Workers Custom Domains i DNS konflikata prije attachanja
- operativni ceiling od 80 aktivnih domena, konfigurabilan kroz `ACTIVE_DOMAIN_LIMIT`
- sedmodnevni expiry, konfigurabilan po demu; cleanup odvaja samo domene čiji je spremljeni ID potvrđeno vezan uz ovaj Worker
- page-view i CTA/telefon/e-mail click događaji bez fingerprintinga
- deterministički generator CLI iza provider sučelja
- Playwright QA na 1440×1000 i 390×844, PNG screenshotovi i JSON izvještaj
- interni approval dashboard na `/__admin`
- Workers-runtime Vitest testovi s lokalnim D1 migracijama

## Brzi lokalni setup

Zahtjevi: Node.js 22+, npm i Chromium za Playwright.

```bash
cd nepar-demo-engine
npm install
npm run types
npx playwright install chromium
```

Kopiraj `.dev.vars.example` u `.dev.vars` i postavi barem lokalni token:

```dotenv
ADMIN_TOKEN=dug-random-lokalni-token
```

Zatim:

```bash
npm run db:migrate:local
npm run dev
```

U drugom terminalu pokreni cijeli Fabela fixture flow bez stvarnog Cloudflare attachanja:

```bash
npm run generate -- --lead ./fixtures/fabela-research.json \
  --api http://127.0.0.1:8787 \
  --token dug-random-lokalni-token \
  --no-attach

npm run qa -- \
  --url "http://127.0.0.1:8787/?demo=fabela" \
  --slug fabela \
  --lead ./fixtures/fabela-research.json \
  --api http://127.0.0.1:8787 \
  --token dug-random-lokalni-token
```

Rezultati su u `qa-output/`; QA skripta dodatno sprema screenshotove u lokalni R2 simulator i zapisuje report u D1. Dashboard je na `http://127.0.0.1:8787/__admin`.

## Cloudflare produkcijski setup

### 1. D1

Kreiraj bazu i zamijeni placeholder `database_id` u `wrangler.jsonc` vrijednošću koju vrati Wrangler:

```bash
npx wrangler d1 create nepar-demo-engine
npm run types
npm run db:migrate:remote
```

Migracije su aditivne. `0002_production_pipeline.sql` ne briše postojeće `demos` ni `demo_events` podatke.

### 2. R2

```bash
npx wrangler r2 bucket create nepar-demo-assets
```

Naziv bucketa mora odgovarati `r2_buckets[].bucket_name` u `wrangler.jsonc`.

### 3. Secrets

```bash
npx wrangler secret put ADMIN_TOKEN
npx wrangler secret put WORKERS_DOMAINS_API_TOKEN
npx wrangler secret put CF_ACCOUNT_ID
npx wrangler secret put CF_ZONE_ID
```

Cloudflare token mora imati minimalna prava potrebna za Workers Domains attach/detach te čitanje zone i DNS zapisa radi conflict guarda. Token i account/zone ID nikad se ne vraćaju kroz javni ili admin API.

### 4. Deploy

```bash
npm run verify
npm run deploy
```

`wrangler.jsonc` već uključuje `nodejs_compat`, Workers Logs/Traces, dnevni cron, D1 i R2 bindinge. Prije deploya obavezno provjeri da `database_id` više nije placeholder UUID.

## Generator

```bash
DEMO_ENGINE_URL=https://nepar-demo-engine.<subdomain>.workers.dev \
DEMO_ENGINE_ADMIN_TOKEN=<secret> \
npm run generate -- --lead ./fixtures/fabela-research.json
```

Generator:

1. validira research lead
2. bira jedan od šest design systema prema industriji
3. gradi neutralan copy samo iz dostavljenih podataka
4. provjerava URL-ove, kontakte i provenance
5. idempotentno kreira lead i demo
6. vraća custom-domain ili workers.dev preview URL

`DeterministicCopyProvider` je zamjenjivo sučelje. Budući AI provider može implementirati isto sučelje, ali njegov rezultat i dalje mora proći strogu shemu prije POST-a.

## Design systemi

| Ključ | Primjene | Kompozicija |
|---|---|---|
| `automotive-performance` | servis, detailing, gume, vuča | grafitni tehnički zapis i dijagnostički vizual |
| `health-trust` | veterina, dental, klinike | mirna tipografija i vertikalni trust rail |
| `beauty-editorial` | salon, kozmetika, wellness | asimetrična editorial naslovnica |
| `hospitality-immersive` | smještaj, hotel, restoran | full-bleed fotografija i booking-first copy |
| `trade-local` | instalateri, građevina, majstori | radni nalog, dokaz i izravan kontakt |
| `professional-authority` | računovodstvo, pravo, B2B | dokumentarna tipografija i rubne bilješke |

Mobile nije smanjeni desktop: svaki hero mijenja redoslijed, stupce i proporcije ispod 800 px.

## Approval workflow

1. lead je `researched`
2. čovjek ga odobrava u dashboardu (`approved_for_demo`)
3. generator kreira demo (`demo_ready`)
4. Playwright sprema QA i screenshotove
5. samo `qa_status=passed` demo može dobiti `approved_at`
6. approval zapisuje `demo_approved_for_outreach` s recipientom, URL-om, provjerenim opažanjima i service angleom
7. budući Gmail integrator i dalje mora tražiti eksplicitni send korak

## Admin API

Svi JSON/asset endpointi traže `Authorization: Bearer <ADMIN_TOKEN>`.

```text
GET    /__admin                         dashboard shell (bez osjetljivih podataka)
GET    /__admin/leads
POST   /__admin/leads
POST   /__admin/leads/:id/approve
POST   /__admin/leads/:id/reject
GET    /__admin/demos
POST   /__admin/demos                   podržava Idempotency-Key
PATCH  /__admin/demos/:slug/qa
PUT    /__admin/demos/:slug/screenshots/:desktop|mobile
POST   /__admin/demos/:slug/approve
POST   /__admin/demos/:slug/regenerate
DELETE /__admin/demos/:slug
GET    /__admin/assets/:key
GET    /__health
```

Greške imaju stabilan oblik:

```json
{
  "ok": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Payload nije prošao validaciju.",
    "requestId": "..."
  }
}
```

## Sigurnost i rate limiting

- admin token uspoređuje se timing-safe nakon SHA-256 digestiranja
- JSON tijela su ograničena na 96 KiB; screenshot na 8 MiB
- renderer ne prima raw HTML/JS i dopušta samo validirane linkove/slike/boje
- demo odgovori uvijek imaju meta robots i `X-Robots-Tag: noindex, nofollow, noarchive`
- CSP zabranjuje skripte na demo stranicama; klikovi se bilježe server-side redirectom
- dashboard shell ne sadrži podatke; API i privatni R2 asseti zahtijevaju bearer auth
- produkcijski `/__admin*` treba dodatno staviti iza Cloudflare Accessa
- postavi Cloudflare Rate Limiting/WAF pravilo za `/__admin/*` (preporuka 120 zahtjeva/min/IP uz block/challenge), a generator koristi `Idempotency-Key` za sigurne retryje
- expiry/archive brišu samo spremljeni Custom Domain ID nakon provjere `service` i `zone_name`; ostali Cloudflare resursi se ne diraju

## Provjere

```bash
npm run check:types
npm run typecheck
npm test
npm run deploy -- --dry-run
npm run verify
```

Arhitekturne odluke su u [ARCHITECTURE.md](./ARCHITECTURE.md), a reproducibilni završni rezultati u [VERIFICATION.md](./VERIFICATION.md).
