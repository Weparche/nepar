---
name: Nepar Solutions
description: Tehnički samouvjeren web-studio s jasnom ponudom i dokazivim rezultatima
colors:
  action-blue: "#2563eb"
  signal-cyan: "#0891b2"
  depth-violet: "#6d28d9"
  ink: "#0f172a"
  body: "#334155"
  muted: "#64748b"
  border: "#e2e8f0"
  canvas: "#f8fafc"
  surface: "#ffffff"
typography:
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 6vw, 5.5rem)"
    fontWeight: 650
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4vw, 3.75rem)"
    fontWeight: 650
    lineHeight: 1.08
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.4
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  section: "clamp(64px, 8vw, 112px)"
components:
  button-primary:
    backgroundColor: "{colors.action-blue}"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "14px 22px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "14px 22px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.body}"
    rounded: "{rounded.lg}"
    padding: "24px"
---

# Design System: Nepar Solutions

## 1. Overview

**Creative North Star: "Tehnički dokaz"**

Nepar izgleda kao precizan digitalni alat koji istodobno djeluje ljudski i pristupačno. Čiste svijetle površine, snažna plava akcijska boja i disciplinirana tipografija nose sadržaj; cijan i ljubičasta ostaju identitetski akcenti, ne dekoracija na svakoj površini.

Sustav odbacuje generičke agency predloške, anonimne stock vizuale, pretjerani glassmorphism, beskrajne jednake kartice i neprovjerljiva marketinška obećanja.

**Key Characteristics:**

- Dokaz rada prije apstraktnih tvrdnji.
- Jasan ritam velikih naslova i kratkih odlomaka.
- Ravne, mirne površine s kontroliranim akcentima.
- Mobilni prikaz je primarni test čitljivosti i usporedbe.

## 2. Colors

Paleta zadržava prepoznatljivu Nepar plavu, cijan i ljubičastu, ali koristi jednu dominantnu akcijsku boju po komponenti.

### Primary

- **Akcijska plava** (`#2563eb`): primarni CTA, linkovi i aktivna stanja.

### Secondary

- **Signalni cijan** (`#0891b2`): mali tehnički naglasci i oznake infrastrukture.
- **Dubinski ljubičasti** (`#6d28d9`): rijetke kategorijske i projektne oznake.

### Neutral

- **Ink** (`#0f172a`): naslovi.
- **Body** (`#334155`): osnovni tekst.
- **Muted** (`#64748b`): sekundarni tekst samo kada prolazi AA kontrast.
- **Canvas** (`#f8fafc`), **Surface** (`#ffffff`) i **Border** (`#e2e8f0`): osnovna dubina bez dekorativnog stakla.

### Named Rules

**Pravilo jedne akcijske boje.** Jedna komponenta ne kombinira plavu, cijan i ljubičastu bez stvarnog semantičkog razloga.

## 3. Typography

**Display Font:** Inter, ui-sans-serif, system-ui, sans-serif  
**Body Font:** Inter, ui-sans-serif, system-ui, sans-serif

**Character:** Jedna postojeća obitelj koristi snažan kontrast veličine i težine. Naslovi su precizni i zbijeni, tekst je miran i čitljiv.

### Hierarchy

- **Display** (650, `clamp(2.5rem, 6vw, 5.5rem)`, 1.02): samo glavni hero.
- **Headline** (650, `clamp(2rem, 4vw, 3.75rem)`, 1.08): naslovi glavnih sekcija.
- **Title** (600, 1.25–1.5rem, 1.25): paketi, projekti i podsekcije.
- **Body** (400, 1rem, 1.7): najviše 70 znakova po retku.
- **Label** (600, 0.875rem, normalan razmak): cijene, oznake i kratki CTA tekst.

### Named Rules

**Pravilo čitljivog naslova.** Letter-spacing display teksta nikad nije manji od `-0.04em`.

## 4. Elevation

Sustav je ravan prema zadanim postavkama. Dubina se dobiva tonalnim razlikama, punim obrubom ili malom sjenom, nikad istodobno širokim sjenama i dekorativnim obrubom.

### Shadow Vocabulary

- **Interaktivni lift** (`0 6px 8px rgba(15, 23, 42, 0.08)`): samo hover ili aktivni dijalog.

### Named Rules

**Ravno prema zadanim postavkama.** Kartice u mirovanju koriste obrub ili tonalnu podlogu; velika difuzna sjena nije dekoracija.

## 5. Components

### Buttons

- **Shape:** 12 px radius, najmanje 44 px visine.
- **Primary:** puna akcijska plava, bijeli tekst, 14 × 22 px padding.
- **Hover / Focus:** blago tamnija boja; jasan 2 px fokusni prsten.
- **Secondary:** bijela površina, ink tekst i puni neutralni obrub.

### Chips

- **Style:** koriste se samo za stvarne statuse poput „Najpopularniji”; puna čitljiva pozadina bez gradijentnog teksta.

### Cards / Containers

- **Corner Style:** najviše 16 px.
- **Background:** bijela ili vrlo blaga plava tonalna površina.
- **Shadow Strategy:** obrub u mirovanju, mali lift samo na interakciji.
- **Internal Padding:** 20–32 px ovisno o gustoći sadržaja.

### Inputs / Fields

- **Style:** bijela površina, 12 px radius, puni neutralni obrub i najmanje 44 px visine.
- **Focus:** plavi obrub i vidljiv fokusni prsten.
- **Error / Disabled:** stanje se prenosi bojom i tekstom, nikad samo bojom.

### Navigation

Svijetla fiksna navigacija koristi jasne tekstualne linkove i jednu plavu aktivnu oznaku. Mobilni izbornik ima velike dodirne mete i ne prekriva sadržaj nakon odabira.

### Package Card

Cijena i način plaćanja čine prvu vizualnu skupinu. Business je istaknut punom oznakom i jačim obrubom, bez skaliranja kartice.

## 6. Do's and Don'ts

### Do:

- **Do** zadržati logo i plavo–cijan–ljubičasti identitet uz discipliniranu raspodjelu uloga.
- **Do** koristiti stvarne projekte, jasne cijene i precizne opise opsega kao glavni vizualni dokaz.
- **Do** provjeriti WCAG 2.2 AA, tipkovnicu, fokus, reduced motion i mobilni prikaz.

### Don't:

- **Don't** stvarati generički agency predložak ili anonimni stock mockup.
- **Don't** koristiti pretjerane gradijente, glassmorphism ili beskrajne mreže jednakih kartica.
- **Don't** koristiti gradijentni tekst, obojene bočne trake ili kartice s obrubom i širokom sjenom.
- **Don't** koristiti formulacije koje web-stranicu predstavljaju kao najam ili obaveznu pretplatu.
- **Don't** obećavati prvo mjesto na Googleu, garantirani rast, off-page SEO ili kontinuirane SEO kampanje.
