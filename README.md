# Nepar Solutions

Vite + React SPA. Build: `npm run build` (uključuje `scripts/verify-dist.js`). Testovi: `npm run test:e2e` (Playwright), `npm run test:worker` (Cloudflare Worker).

## Digitalni cjenik — ažuriranje cijena (NN 101/2026-1213)

`src/cjenikData.js` je **jedini** izvor istine za cijene NEPAR usluga. `src/webOfferContent.js` (marketinški sadržaj na `/usluge/izrada-web-stranica` i drugdje) uvozi te brojeve — cijena se nikad ne smije ručno upisati na dva mjesta.

Odluka NN 101/2026-1213 traži da objavljene verzije cjenika ostanu dostupne 30 dana i da bude omogućen automatizirani dohvat podataka. Kod NEPAR-a (statični build) to znači: **promjena cijene mora odmah završiti u produkciji**, ne smije čekati sljedeći nepovezani deploy.

Postupak kad se cijena neke usluge stvarno promijeni:

1. `npm run cjenik:archive` — snima trenutnu (uskoro zamijenjenu) verziju u `cjenik-archive/`, s vremenskom oznakom zamjene (`supersededAt`). Pokreni ovo **prije** uređivanja podataka.
2. Uredi `src/cjenikData.js` — promijeni cijenu/cijene u `nepaUsluge`.
3. Uredi `src/cjenikMeta.js` — postavi `publishedAt` na trenutni datum/vrijeme i inkrementiraj `brojPohrane`. Ove vrijednosti se **ne** mijenjaju automatski po buildu — to je namjerno, da ponovni deploy iste verzije ne generira lažnu "novu objavu".
4. `npm run build` i odmah deploy.

Build iz tih podataka generira:
- `/cjenik` — čitljiv prikaz (HTML)
- `/cjenici/<oblik>_<adresa>_<oznaka>_<broj-pohrane>_<datum>_<vrijeme>.csv|xml` — kanonske datoteke, naziv sukladan Odluci
- `/cjenik.csv`, `/cjenik.xml` — praktični alias na najnoviju kanonsku datoteku (koristi ih i NEPAR-ov vlastiti checker na `/digitalni-cjenik`)
- `/cjenik/arhiva` — popis trenutne i zadržanih arhiviranih verzija (do 30 dana od `supersededAt`)

Nikad ne mijenjaj prikazanu cijenu neke od pokrivenih usluga izravno u `webOfferContent.js` ili u JSX-u — jedini way in je `src/cjenikData.js`.
