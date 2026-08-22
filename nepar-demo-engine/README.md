# NEPAR Demo Engine

Multi-tenant Cloudflare Worker za brzo podizanje personaliziranih prodajnih demo webova na hostnameovima poput `fabela.nepar.hr`.

## MVP koji je već implementiran

- jedan Worker servira više demo stranica prema hostnameu
- D1 sprema demo sadržaj i page-view evente
- admin API kreira, lista i arhivira demo stranice
- novi demo po želji automatski attach-a Cloudflare Worker Custom Domain
- Custom Domain API automatski rješava DNS + TLS na Cloudflare strani
- svaki demo po defaultu istječe nakon 7 dana
- dnevni cron detach-a Custom Domain i označava istekle demo stranice
- svi demo webovi šalju `noindex, nofollow` kako ne bi stvarali SEO duplikate
- postoji `workers.dev/?demo=slug` preview fallback

## Lokalni setup

```bash
cd nepar-demo-engine
npm install
npx wrangler login
npx wrangler d1 create nepar-demo-engine --binding DB --update-config
npm run db:migrate:local
npm run dev
```

Nakon `d1 create --update-config`, Wrangler će u `wrangler.jsonc` dodati D1 binding s pravim `database_id`.

## Produkcijski setup

Prvo postavi obavezni admin token:

```bash
npx wrangler secret put ADMIN_TOKEN
```

Za automatsko stvaranje `firma.nepar.hr` Custom Domaina postavi i:

```bash
npx wrangler secret put CF_API_TOKEN
npx wrangler secret put CF_ACCOUNT_ID
```

Cloudflare API token treba minimalno permission `Workers Scripts Write` za account/zonu koju koristi NEPAR.

Zatim:

```bash
npm run db:migrate:remote
npm run deploy
```

## Kreiranje demo stranice

Primjer payload-a je u `examples/fabela.json`.

```bash
curl -X POST "https://<worker>.workers.dev/__admin/demos" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  --data @examples/fabela.json
```

Ako su Cloudflare secrets ispravno postavljeni i `attachDomain` nije `false`, API će pokušati attachati:

```text
https://fabela.nepar.hr
```

Ako Custom Domain nije dostupan, demo i dalje ostaje dostupan kroz preview URL koji API vrati.

## Admin API

```text
POST   /__admin/demos
GET    /__admin/demos
DELETE /__admin/demos/:slug
GET    /__health
```

Admin endpointi traže:

```text
Authorization: Bearer <ADMIN_TOKEN>
```

## D1 model

`demos` sprema:

- slug
- business name
- template key
- JSON content
- source URL / lead email
- status
- Cloudflare Custom Domain ID
- created / updated / expires timestamps

`demo_events` trenutačno sprema server-side `page_view` evente.

## Važno prije slanja prospectu

Demo payload ne smije sadržavati izmišljene tvrdnje. Godine iskustva, cijene, ocjene, adresa, certifikati, reference i stvarne usluge moraju doći iz provjerljivih javnih izvora ili iz materijala samog klijenta.

`examples/fabela.json` je tehnički fixture i sadrži placeholder sadržaj koji se ne šalje prospectu bez prethodne dorade.

## Sljedeća faza

Sljedeći korak je automatizirati cijeli sales pipeline:

1. lead discovery + scoring
2. scraping javnih poslovnih podataka
3. odabir vertikalnog design systema
4. generiranje copyja i vizuala
5. POST u ovaj engine
6. Playwright desktop/mobile QA
7. screenshotovi
8. approval gate
9. Gmail slanje
10. follow-up i conversion tracking

Detaljan Codex zadatak je u `CODEX_TASK.md`.
