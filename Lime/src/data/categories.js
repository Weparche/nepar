export const CATEGORIES = [
  { name: 'Frizeri', slug: 'frizeri', full: 'Frizerski saloni' },
  { name: 'Barberi', slug: 'barberi', full: 'Barberi' },
  { name: 'Nokti', slug: 'nokti', full: 'Nokti' },
  { name: 'Kozmetika', slug: 'kozmetika', full: 'Kozmetički saloni' },
  { name: 'Obrve i trepavice', slug: 'obrve', full: 'Obrve i trepavice' },
  { name: 'Masaža', slug: 'masaza', full: 'Masaže' },
  { name: 'Wellness', slug: 'wellness', full: 'Wellness i spa' },
  { name: 'Depilacija', slug: 'depilacija', full: 'Depilacija' },
  { name: 'Make-up', slug: 'makeup', full: 'Make-up' },
  { name: 'Fizioterapija', slug: 'fizioterapija', full: 'Fizioterapija' },
  { name: 'Estetski tretmani', slug: 'estetski', full: 'Estetski tretmani' },
  { name: 'Solariji', slug: 'solariji', full: 'Solariji' },
  { name: 'Tetoviranje', slug: 'tetoviranje', full: 'Tetoviranje' },
  { name: 'Piercing', slug: 'piercing', full: 'Piercing' },
  { name: 'Pet grooming', slug: 'pet-grooming', full: 'Pet grooming' },
]

export const CITIES = [
  { name: 'Zagreb', slug: 'zagreb', count: 30 },
  { name: 'Split', slug: 'split', count: 0 },
  { name: 'Rijeka', slug: 'rijeka', count: 0 },
  { name: 'Osijek', slug: 'osijek', count: 0 },
  { name: 'Zadar', slug: 'zadar', count: 0 },
  { name: 'Varaždin', slug: 'varazdin', count: 0 },
  { name: 'Pula', slug: 'pula', count: 0 },
]

export const CATEGORY_SLUG_TO_FULL = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c.full]),
)

export const FULL_TO_SLUG = Object.fromEntries(
  CATEGORIES.map((c) => [c.full, c.slug]),
)
