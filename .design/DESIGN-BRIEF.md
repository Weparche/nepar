# Product

## Product
`/web` je izdvojeni hrvatski paid-acquisition landing za Neparovu izradu profesionalnih web-stranica. Pretvara promet iz ChatGPT, Google i budućih Meta oglasa u jedan jasan lead tok bez izlaza prema ostalim uslugama.

## Core user
Vlasnik obrta ili male/srednje tvrtke u Hrvatskoj koji najčešće na mobitelu uspoređuje izvođače i želi brzo vidjeti kvalitetu rada, okvirnu cijenu, vlasništvo i jednostavan sljedeći korak.

## Product goal
U prvom viewportu objasniti što Nepar izrađuje, od koje cijene i zašto je ponuda sigurna, zatim stvarnim projektima izgraditi povjerenje i dovesti korisnika do inline upita.

## Primary action
`Zatraži ponudu` → `#upit` → uspješan HTTP 2xx submit lead forme.

## Required screens / features
- [x] Jedna ruta `/web`, samo hrvatski
- [x] Minimalni sticky header s jednim dominantnim CTA-om
- [x] Hero s zaključanim copyjem, cijenom, vlasništvom i Auto Gubić dokazom
- [x] Portfolio: Auto Gubić, BezStruje.hr, VremenskaPrognoza.hr
- [x] Tri kupcu razumljiva razloga i kratki tehnički trust red
- [x] Kompaktni Start, Business i Pro paketi s tri stavke
- [x] Proces Dogovor → Izrada → Pregled → Objava
- [x] Inline forma ime/e-mail/telefon/opis s jasnim stanjima
- [x] Četiri FAQ pitanja i završni CTA
- [x] Minimalni legal/contact footer i kompaktna prezentacija postojećeg consenta

## Visual personality
- Tehnički samouvjerena
- Profesionalna
- Precizna
- Pristupačna

## Avoid
- Generički agency template i centrirani SaaS hero
- Stock fotografije, izmišljene metrike ili neprovjerljive SEO tvrdnje
- Glassmorphism, veliki gradijenti, glow i dekorativni 3D
- Mreža brojnih jednakih kartica i mini-cjenik s dugim feature listama
- Navigacijski izlazi prema drugim uslugama

## Brand
Poštovati postojeći Nepar logo, Inter tipografiju, svijetli canvas, action blue `#2563eb`, ink `#0f172a`, disciplinirani cijan signal i maksimalno 16 px radius. Brand north star je „Tehnički dokaz”: stvarni projekti, cijene i vlasništvo prije apstraktnih tvrdnji.

## References
Postojeći `PRODUCT.md`, `DESIGN.md`, homepage hero ritam i stvarni projektni asseti. Nova kompozicija ne kopira postojeći service page.

## Content / assets
- Hero naslov: „Profesionalna web stranica za vaš posao. Od 300 €.”
- Hero podnaslov: „Brza, moderna i optimizirana za Google. Bez mjesečne pretplate — stranica je vaša.”
- Trust: „Izrada od 300 € · Potpuno vlasništvo · Za tvrtke i obrte u Hrvatskoj”
- `/public/brand/autogubic.webp`
- `/public/brand/bezstruje.webp`
- `/public/brand/vremenskaprognoza.webp`
- `/public/brand/nepar_logo.png`

## Technical constraints
Postojeći React 19 + Vite + React Router + CSS/Tailwind projekt ostaje netaknut izvan nužnih shared integracija. WCAG 2.2 AA, 44 px mete i reduced motion su release kriteriji. `/web` je `noindex,follow`, bez canonicala i sitemap unosa. Vizualno odobrenje prethodi svakom production-code zahvatu.

## Assumptions
Referentni frameovi su art direction, ne pixel-perfect specifikacija; sav finalni tekst i interakcije implementiraju se kao semantički HTML, ne rasterizirani sadržaj.
