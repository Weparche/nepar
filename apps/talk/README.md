# NEPAR Talk — preview

Neovisan Cloudflare Pages projekt unutar repozitorija Weparche/nepar na grani preview/talk. Izvorni kod: apps/talk. Main je netaknut.

## Funkcionalnosti

- Tri specijalizirana trenera: intervju, povišica, teški razgovori.
- Landing, mobilni prikaz, priprema scenarija, WebRTC s GPT-Live-1.1, prijepis, kontrola mikrofona i izvještaj preko modela GPT-5.6 Luna.
- Jasno označeni sintetički primjeri izvještaja. Stvarni izvještaj samo nakon stvarnog govora.
- Potvrda punoljetnosti i transparentna obavijest o obradi govora.
- Zvuk se ne snima u pregledniku. Izvještaj se sprema samo uz korisnikov klik, u lokalnu pohranu.
- Plaćanje i korisnički računi nisu aktivni.

## Deployment

Cloudflare Pages: GitHub Weparche/nepar, produkcijska grana za ovaj IZOLIRANI preview projekt preview/talk, root_dir apps/talk, build_command exit 0, destination_dir . (trenutačni direktorij).

U Pages environment secrets potrebno je postaviti OPENAI_API_KEY i TALK_PREVIEW_CODE (najmanje 10 znakova), i u produkcijsku i u preview konfiguraciju ako se koristi. Bez obaju API je namjerno zaključan i ne naplaćuje AI minute.

Samo internom testeru dijeliti pristupni kod. Pristupni kod NE zamjenjuje korisničke račune, kvote ni rate limiting. Prije javnog lansiranja obavezno dodati autentikaciju, serverske limite minuta, zaštitu od abuse, Stripe integraciju, pravila privatnosti i funkciju brisanja povijesti.

## QA

1. Provjeriti 390 px i 1440 px prikaz.
2. Tab, Shift+Tab, Esc i dijaloški fokus; jasno označen primjer.
3. Testirati tri različita scenarija i mobilni mikrofon.
4. Bez koda nema pokretanja WebRTC veze.
5. Server odgovara 503 bez OpenAI ključa, 401 s pogrešnim kodom.
6. Nema izmišljene analize bez valjanog prijepisa.
7. Testirati 5-minutni limit, otkazivanje i gašenje mikrofona.
8. Testirati GDPR i sigurnosne evaluacije prije javnog prometa.

## Hrvatski glasovni demo

Svaki od tri scenarija ima unaprijed definirano uvodno pitanje koje `/api/demo-audio?mode=...` sintetizira govorom `gpt-4o-mini-tts`, glas `marin`, pri prvom zahtjevu. Zvučni zapis sprema se u zasebni, privatni Cloudflare R2 bucket `nepar-talk-audio` preko production bindinga `TALK_DEMO_AUDIO` i nakon toga se služi iz R2 bez novih TTS poziva. Iznos TTS računa jednokratan je po scenariju, osim u slučaju paralelnih prvih zahtjeva prije uspješnog spremanja. Nema teksta korisnika, nema prijave i nema obrade mikrofona u demonstraciji. Ovo nije snimka GPT-Live sesije, to je primjer istog ugrađenog glasa u TTS modelu.
