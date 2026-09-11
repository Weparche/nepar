# AP Jump

Satirična endless-runner browser igra za `https://apjump.nepar.hr`.

## Kontrole

- `Space`, `↑` ili `W` — skok
- Tap/klik po canvasu — skok
- Lokalni rekord sprema se u `localStorage`
- Globalni Top 10 sprema se u Cloudflare D1
- Zvuk se može uključiti/isključiti

## V3 gameplay

Igra više nema lagani fiksni tempo. Težina progresivno raste kroz šest tierova:

- veća brzina do približno `1120 px/s`
- sve kraći spawn prozori
- dodatne vrste prepreka otključavaju se s višim scoreom
- od srednjih tierova kreću double-combo prepreke
- milestone feedback svakih 100 bodova

## V3 vizuali

- 7 pixel-art frameova lika: 4 run, jump, fall i hit
- parallax Lika/Velebit pozadina
- selo, crkva, stupovi, ograda, vrane i roadside detalji
- dust particles, hit flash i screen shake
- prošireni otpad: perilica, madrac, radioaktivni, medicinski i elektronički otpad, azbest i kontejner

## Share

Na podržanim mobilnim browserima share pokušava poslati generiranu PNG score karticu zajedno s linkom na `https://apjump.nepar.hr/`. Inače koristi standardni Web Share ili clipboard fallback.

## Stack

Čisti HTML + CSS + JavaScript + Canvas + Cloudflare Pages Functions + D1. Nema frontend build koraka ni vanjskih dependencyja.

Runtime je podijeljen na:

- `game-prelude.js`
- `game-core.js`
- `game-render.js`
- `game-ui.js`

## Cloudflare Pages

- Repository: `Weparche/nepar`
- Production branch: `main`
- Root directory: `apps/ap-jump`
- Framework preset: `None`
- Build command: `exit 0`
- Build output directory: `/`
- Custom domain: `apjump.nepar.hr`

## Globalni scoreboard / D1

1. Kreirati D1 bazu, npr. `ap-jump-scoreboard`.
2. Na Pages projektu `apjump` dodati D1 binding.
3. Variable name mora biti točno `DB`.
4. Odabrati bazu i redeployati.

`functions/api/leaderboard.js` automatski kreira potrebnu tablicu i indeks pri prvom GET/POST pozivu.

Scoreboard čuva samo username, najbolji score i timestamp. Jedan username ima jedan najbolji rezultat. Ovo je lagani viralni MVP i nije cheat-proof kompetitivni sustav.

## Napomena

Satirična igra. Nije povezana ni s jednom političkom strankom niti sa stvarnom osobom.
