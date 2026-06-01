# Nepar Solutions

## Njamko — zvukovi životinja

Level **Pogodi zvuk** može koristiti prave audio datoteke umjesto Web Audio beep fallbacka.

### API ključevi

Dodaj u `.env` u korijenu projekta:

```env
PIXABAY_API_KEY=your_pixabay_key
FREESOUND_API_KEY=your_freesound_key
```

- **PIXABAY_API_KEY** (obavezno za skriptu) — [Pixabay API docs](https://pixabay.com/api/docs/)
- **FREESOUND_API_KEY** (opcionalno) — CC0 fallback ako Pixabay ne vrati rezultat — [Freesound API apply](https://freesound.org/apiv2/apply/)

### Preuzimanje zvukova

```bash
npm run fetch:njamko-sounds
```

Skripta:

1. Kreira `public/njamko/assets/sounds/`
2. Traži legalne zvukove preko Pixabay API-ja (primarni izvor)
3. Ako Pixabay ne uspije, pokušava Freesound API (**samo CC0** licenca)
4. Sprema `*.mp3` datoteke i generira `licenses.json` + `LICENSES.md`

### Ponašanje u igri

- Zvuk se **nikad ne autoplaya** — pušta se samo na klik **Poslušaj zvuk**
- Ako datoteka ne postoji ili se ne može učitati, igra koristi postojeći Web Audio beep fallback
- Greške se hvataju — aplikacija ne puca

### Testiranje

```bash
npm run build
npx playwright test e2e/njamko.spec.js
```
