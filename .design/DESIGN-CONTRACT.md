# Design Contract

## Art direction
„Tehnički dokaz”: svijetla, precizna i proof-first prodajna površina u kojoj stvarni Auto Gubić web nosi prvi viewport, a cijena i vlasništvo djeluju kao racionalno osiguranje. Kompozicija je editorial split, ne generički centrirani agency hero.

## Typography
- Display character: Inter Variable, 650–720, zbijen i samouvjeren
- Body/UI character: Inter Variable, miran i vrlo čitljiv
- Desktop hierarchy: hero 64–72 px; sekcijski naslovi 40–52 px; title 20–26 px; body 16–18 px
- Mobile hierarchy: hero 44–48 px; sekcijski naslovi 30–36 px; body najmanje 16 px
- Line-length/line-height notes: hero 10–13 riječi po retku; body najviše 65 znakova; display 0.98–1.04, body 1.6–1.7

## Color
- Background: `#ffffff`, prijelazne tonalne površine `#f8fafc` i `#eff6ff`
- Text: `#0f172a` naslovi, `#334155` body, `#64748b` sekundarno samo uz AA kontrast
- Primary accent/action: `#2563eb`, hover `#1d4ed8`
- Secondary/semantic colors: cijan samo kao tehnički signal; tamni ink `#07111f` za fokusirane proof blokove
- Contrast rules: WCAG 2.2 AA; bez gradijentnog teksta i boje kao jedinog signala

## Layout
- Max content width: 1220 px
- Desktop grid/alignment: hero 48/52; portfolio asimetrično s vodećim Auto Gubić dokazom
- Mobile padding/alignment: 20 px, jedna kolona i sadržaj poredan prema konverzijskoj važnosti
- Section rhythm: 72–112 px desktop; 56–76 px mobile

## Surfaces and geometry
- Surface hierarchy: dominantno ravne bijele/tonalne plohe; projektne slike nose dubinu
- Card usage: samo za samostalne projekte, pakete i formu; razlozi/proces nisu šest jednakih feature kartica
- Border/shadow language: puni neutralni obrub; mali hover lift; bez difuznih dekorativnih sjena
- Radius language: 12 px kontrole, maksimalno 16 px veće površine

## Navigation
- Desktop: sticky bijeli header, logo lijevo; Reference, Cijene i plavi CTA desno
- Mobile: logo i CTA bez hamburgera
- Active/interaction states: jasni hover, pressed i 2 px fokusni prsten; CTA anchor vodi na `#upit`

## Main-screen composition
Prvi viewport prikazuje minimalni header, zaključani hero copy i stvarni Auto Gubić projekt u velikom cropu. Odmah ispod počinje portfolio redoslijedom Auto Gubić → BezStruje.hr → VremenskaPrognoza.hr. Nakon dokaza slijede tri poslovna razloga, kompaktne cijene, proces, inline upit, FAQ i završni CTA.

## Primary action
- Label: `Zatraži ponudu`
- Visual treatment: puna akcijska plava, bijeli tekst, 12 px radius, najmanje 48 px visine
- Placement: header, hero, paketi i završni CTA; svi anchori vode na `#upit`
- Secondary-action relationship: nema ravnopravne sekundarne akcije; mailto je fallback tek kad API nije dostupan

## Imagery and iconography
- Imagery role/crop/style: postojeći stvarni projektni asseti, ravni browser-canvas cropovi bez laptop/phone frameova
- Icon language: Lucide outline ikone samo za trust, razloge, proces i status; nikad kao dekorativna zamjena za dokaz

## Components
Semantički anchor CTA-ovi; pravi submit button; portfolio s vodećim projektom; tri kratke package kartice; numerirani proces; labelirani inputi; native `details` FAQ; minimalni footer; postojeći consent state s kompaktnom `/web` klasom.

## Responsive transformations
Desktop split postaje mobile redoslijed copy → CTA/trust → Auto Gubić proof → portfolio. Header gubi tekstualne linkove. Portfolio prelazi iz vodećeg/asimetričnog grida u horizontalne proof retke, paketi i proces u jednu kolonu, a forma ostaje iznad supporting trust sadržaja.

## Interaction states
Button/link hover i pressed, vidljiv `:focus-visible`, disabled submit tijekom requesta, `aria-live` za fallback/error/success, očuvana polja na grešci, jednom deduplicirani analytics eventi.

## Motion
Samo kratki opacity/translate reveal i interaktivni lift; nema kontinuiranog kretanja. CSS smooth scroll postoji samo uz `prefers-reduced-motion: no-preference`.

## Reference deviations
Raster referenca određuje kompoziciju i ritam, ali finalni UI koristi stvarni semantički tekst i slike. Mobile logo/CTA i projektne oznake prilagođavaju se stvarnim 44 px metama. Consent može prekriti dio ekrana samo koliko je nužno za zakonski izbor i koristi postojeći privacy subsystem.
