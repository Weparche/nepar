# Architecture notes

## 1. Jedan Worker, mnogo exact hostnameova

Worker razrješava `slug.nepar.hr` u D1 slug i nikad ne deploya zaseban Worker po prospectu. Custom Domain API koristi exact hostname. Attach ide tek nakon reserved/domain/DNS/capacity provjera; D1 zapis se briše ako attach ne uspije. Preview bez attachanja ostaje dostupan kroz `workers.dev/?demo=slug` ili localhost.

## 2. Conflict i ownership guard

Prije attachanja engine lista Workers Domains i DNS zapis točnog hostnamea. Bilo koji strani Worker ili postojeći DNS zapis završava stabilnom 409 greškom. Detach prvo dohvaća spremljeni `custom_domain_id` i nastavlja samo ako `service === WORKER_SERVICE` i `zone_name === ZONE_NAME`.

## 3. Rolling domain pool

`ACTIVE_DOMAIN_LIMIT` je 80 prema zadanim postavkama. Broji samo aktivne demo zapise s vlastitim Custom Domain ID-em. Expiry prvo detacha domenu, zatim označava demo `expired`; lead, demo red, događaji i R2 screenshotovi ostaju sačuvani.

## 4. Provenance prije renderiranja

`demoContentSchema` je granica povjerenja. Usluga ili proof point mora navesti `sourceField` koji postoji u `sources`. Renderer radi isključivo nad validiranim strukturiranim tekstom i escapea svaki prikazani string. Nema raw HTML polja, evala ni proxyja udaljenog HTML-a.

## 5. Provider-neutral generation

`CopyProvider` razdvaja generiranje od domene. Trenutačni `DeterministicCopyProvider` je potpuno ponovljiv i ne koristi plaćeni servis. Budući provider može koristiti AI, ali njegov izlaz ne preskače istu validaciju i provenance pravila.

## 6. QA i asset lifecycle

Playwright CLI provjerava dvije obavezne dimenzije, sprema PNG i JSON report lokalno, potom opcionalno u privatni R2 i D1. Dashboard preuzima screenshot kao autorizirani blob; R2 bucket nije javni. Buduća retention politika može brisati R2 objekte bez brisanja povijesnog QA JSON-a.

## 7. Approval je tvrda granica

Demo ne može biti odobren dok `qa_status` nije `passed`. Approval ne šalje poruku nego zapisuje workflow event `demo_approved_for_outreach` s podacima potrebnima za budući draft. `requires_human_action=1` ostaje auditabilan signal za zaseban Gmail integrator.

## 8. Dashboard pristup

Dashboard je statički shell bez osjetljivih podataka. Token se drži samo u `sessionStorage`; svi podaci i R2 asseti idu kroz bearer-zaštićene API pozive. Produkcijski deployment treba staviti cijeli `/__admin*` path iza Cloudflare Accessa, uz WAF/rate-limiting pravilo.

## 9. Observability i privatnost

Worker koristi strukturirane error logove i uključene Workers Logs/Traces. Tracking je ograničen na page view i namjerne CTA/contact click događaje; nema fingerprintinga, cookiesa ni cross-site identifikatora.
