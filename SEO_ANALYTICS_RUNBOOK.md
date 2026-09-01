# NEPAR SEO, GA4 i Search Console — produkcijski runbook

Kod u repozitoriju priprema route-specific HTML, sitemap, robots, consent, GA4 evente i Worker retention. Koraci u Google i Cloudflare računima moraju se dovršiti nakon što su poznati stvarni GA4 Measurement ID i Search Console verification token.

## 1. Produkcijske varijable i deploy

U Cloudflare Pages production environment postaviti:

```text
VITE_SITE_URL=https://nepar.hr
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_WORKER_URL=https://<nepar-worker-host>
```

Zatim napraviti novi production build/deploy weba i deploy postojećeg Workera. Ne mijenjati `_redirects`: fizički route HTML ima prednost, trailing-slash pravila vraćaju 301, a nepostojanje SPA catch-all pravila omogućuje Cloudflare Pagesu vratiti `404.html` sa statusom 404.

## 2. Provjera nakon deploya

```bash
curl -sS https://nepar.hr/usluge/izrada-web-stranica
curl -I https://nepar.hr/usluge/izrada-web-stranica/
curl -I https://nepar.hr/nepostojeca-ruta
curl -sS https://nepar.hr/sitemap.xml
curl -sS https://nepar.hr/robots.txt
```

Očekivano:

- servisni raw HTML sadrži vlastiti title, description, canonical i JSON-LD bez izvršavanja JavaScripta;
- trailing slash vraća `301` na canonical URL;
- nepoznata ruta vraća `404`, ne homepage sa statusom 200;
- `/admin` je dohvatljiv, ali raw HTML sadrži `noindex,nofollow`;
- sitemap sadrži točno šest canonical URL-ova.

## 3. GA4 property

U Google Analyticsu:

1. Izraditi property za NEPAR.
2. Time zone: `Europe/Zagreb`; currency: `EUR`.
3. Web stream: `https://nepar.hr`.
4. Dobiveni Measurement ID postaviti kao `VITE_GA_MEASUREMENT_ID` i redeployati web.
5. Admin → Data collection and modification → Data retention: event data `14 months`; reset on new activity prema poslovnoj odluci (preporuka: uključeno).
6. Google Signals ostaviti isključen.
7. Oglasnu personalizaciju ostaviti isključenu.
8. Enhanced Measurement → Page views → isključiti `Page changes based on browser history events`. Ručni router tracker je jedini izvor SPA `page_view` eventa.
9. Registrirati event-scoped custom dimensions za `form_name`, `offer_kind`, `offer_name` i `link_location` (po potrebi i `section_name`).
10. Event `generate_lead` označiti kao key event.

U DebugViewu provjeriti redoslijed `page_view → view_packages → start_lead → generate_lead`, samo jedan `page_view` po loadu/navigaciji i da event parametri ne sadrže ime, e-mail, predmet ili poruku.

## 4. Consent provjera

U čistom browser profilu otvoriti DevTools Network i filtrirati `google`, `gtag` te Worker host.

- prije odluke: nema Google taga ni Worker pageview zahtjeva;
- odbijanje + reload: i dalje nema tih zahtjeva;
- prihvaćanje: učitava se izravni Google tag i šalje jedan GA4 te jedan interni pageview;
- Router navigacija: šalje još točno jedan pageview;
- povlačenje kroz stalni footer link: dostupni `_ga*` kolačići brišu se, slijedi kontrolirani reload i tag se više ne učitava.

## 5. Search Console

1. Izraditi Domain property `nepar.hr`.
2. Verification TXT koji Google prikaže dodati u Cloudflare DNS na apex domeni i završiti verifikaciju.
3. U Search Console submitati `https://nepar.hr/sitemap.xml`.
4. Povezati GA4 property i Search Console property kroz GA4 Admin → Product links → Search Console links.
5. URL Inspection → Request Indexing napraviti samo za:
   - `https://nepar.hr/`
   - `https://nepar.hr/usluge/izrada-web-stranica`
   - `https://nepar.hr/mozgalica`
   - `https://nepar.hr/njamko`

`/kontakt` i `/privatnost` prepustiti sitemapu i internim linkovima.

## 6. Go/no-go za Google Ads

Google Ads setup počinje tek nakon nekoliko dana urednih GA4/Search Console podataka i potvrde da `generate_lead` nastaje isključivo nakon HTTP 2xx odgovora kontakt Workera. GTM, novi landingovi, blog i dodatni funnel eventi nisu dio ove faze.
