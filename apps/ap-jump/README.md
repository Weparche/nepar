# AP Jump

Minimalistička satirična endless-runner browser igra za `https://lika.nepar.hr`.

## Kontrole

- `Space`, `↑` ili `W` — skok
- Tap/klik po canvasu — skok
- Lokalni rekord sprema se u `localStorage`
- Globalni Top 10 sprema se u Cloudflare D1

## Stack

Čisti HTML + CSS + JavaScript + Canvas + Cloudflare Pages Functions + D1. Nema frontend build koraka ni vanjskih dependencyja.

## Cloudflare Pages

Za zasebni Pages projekt iz monorepa postaviti:

- Repository: `Weparche/nepar`
- Production branch: `main`
- Root directory: `apps/ap-jump`
- Framework preset: `None`
- Build command: `exit 0`
- Build output directory: `/`
- Custom domain: `lika.nepar.hr`

## Globalni scoreboard / D1

1. U Cloudflare dashboardu kreirati D1 bazu, npr. `ap-jump-scoreboard`.
2. Otvoriti Pages projekt `apjump`.
3. `Settings` → `Bindings` → `Add` → `D1 database`.
4. Variable name mora biti točno `DB`.
5. Odabrati bazu `ap-jump-scoreboard` i spremiti.
6. Ponovno deployati projekt.

`functions/api/leaderboard.js` automatski kreira potrebnu tablicu i indeks pri prvom GET/POST pozivu, pa nije potrebno ručno izvršavati SQL migraciju.

Scoreboard čuva samo username, najbolji score i timestamp. Jedan username ima jedan najbolji rezultat. Ovo je lagani viralni MVP i nije zamišljen kao cheat-proof kompetitivni sustav.

## Prepreke

Vreće smeća, stara guma, frižider, kauč, radioaktivni otpad, medicinski otpad, elektronički otpad i bačva otpada.

## Napomena

Satirična igra. Nije povezana ni s jednom političkom strankom niti sa stvarnom osobom.
