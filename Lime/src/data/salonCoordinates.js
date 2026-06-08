/** WGS84 koordinate salona (približne lokacije po adresama / kvartovima) */
export const SALON_COORDINATES = {
  'studio-bella': { lat: 45.7939, lng: 15.958 },
  'salon-elegance-varazdin': { lat: 45.775, lng: 15.935 },
  'barber-kut': { lat: 45.8128, lng: 15.9775 },
  'riva-barber': { lat: 45.801, lng: 15.975 },
  'nail-art-zg': { lat: 45.825, lng: 16.005 },
  'nails-by-sea': { lat: 45.828, lng: 16.012 },
  'glow-kozmetika': { lat: 45.783, lng: 15.928 },
  'osijek-beauty': { lat: 45.79, lng: 15.955 },
  'lash-brow-studio': { lat: 45.808, lng: 15.972 },
  'lash-zadar': { lat: 45.805, lng: 15.965 },
  'zen-masaza': { lat: 45.818, lng: 15.945 },
  'masaza-adriatic': { lat: 45.812, lng: 15.988 },
  'wellness-oaza': { lat: 45.768, lng: 15.982 },
  'zadar-sun-spa': { lat: 45.785, lng: 16.01 },
  'smooth-depilacija': { lat: 45.798, lng: 16.02 },
  'depilacija-korzo': { lat: 45.822, lng: 15.972 },
  'makeup-by-sara': { lat: 45.8145, lng: 15.978 },
  'makeup-art-split': { lat: 45.808, lng: 15.988 },
  'fizio-centar-zg': { lat: 45.842, lng: 15.968 },
  'fizio-slavonija': { lat: 45.838, lng: 15.958 },
  'estetika-rijeka': { lat: 45.799, lng: 15.972 },
  'estetika-centar-zg': { lat: 45.81, lng: 15.968 },
  'solar-varazdin': { lat: 45.788, lng: 15.948 },
  'solar-studio-zg': { lat: 45.802, lng: 15.99 },
  'ink-rijeka': { lat: 45.817, lng: 15.962 },
  'ink-lab-zagreb': { lat: 45.796, lng: 15.955 },
  'piercing-pula': { lat: 45.806, lng: 15.952 },
  'piercing-studio-zg': { lat: 45.816, lng: 15.975 },
  'pula-pets': { lat: 45.778, lng: 15.942 },
  'pet-groom-zagreb': { lat: 45.79, lng: 15.94 },
}

export const CITY_CENTERS = {
  zagreb: { lat: 45.815, lng: 15.9819, zoom: 12 },
  split: { lat: 43.5081, lng: 16.4402, zoom: 13 },
  rijeka: { lat: 45.3271, lng: 14.4422, zoom: 13 },
  osijek: { lat: 45.555, lng: 18.6955, zoom: 13 },
  zadar: { lat: 44.1194, lng: 15.2314, zoom: 13 },
  varazdin: { lat: 46.3057, lng: 16.3366, zoom: 13 },
  pula: { lat: 44.8666, lng: 13.8496, zoom: 13 },
}

export function getCityCenter(citySlug) {
  return CITY_CENTERS[citySlug] || CITY_CENTERS.zagreb
}
