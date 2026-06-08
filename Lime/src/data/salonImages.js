import { CATEGORY_IMAGES } from './categoryImages'

const Q = 'auto=format&fit=crop&w=800&q=80'

function u(photoId) {
  return `https://images.unsplash.com/${photoId}?${Q}`
}

/** Jedinstvena mockup slika po salonu (Unsplash) */
export const SALON_IMAGES = {
  'studio-bella': u('photo-1560066984-138d7174f035'),
  'salon-elegance-varazdin': u('photo-1521590832699-f322a9d0e7c2'),
  'barber-kut': u('photo-1503951914875-452162b0f3f1'),
  'riva-barber': u('photo-1622286342621-4bd786c24470'),
  'nail-art-zg': u('photo-1604654898464-97f7a604e4f8'),
  'nails-by-sea': u('photo-1632345031431-437cddb4e6b0'),
  'glow-kozmetika': u('photo-1570172619644-dfd955edae1d'),
  'osijek-beauty': u('photo-1512290903904-17d2520a52c1'),
  'lash-brow-studio': u('photo-1516975080664-ed2fc6a32937'),
  'lash-zadar': u('photo-1487412947147-47ceab686ef6'),
  'zen-masaza': u('photo-1544161515-4ab6ce6db874'),
  'masaza-adriatic': u('photo-1519823551278-64ac92734fb1'),
  'wellness-oaza': u('photo-1540555700478-4be289fbecef'),
  'zadar-sun-spa': u('photo-1544161514-218ac50fbb3b'),
  'smooth-depilacija': u('photo-1616394584738-fc581e2f713b'),
  'depilacija-korzo': u('photo-1515377905708-395675ef9acb'),
  'makeup-by-sara': u('photo-1522335783439-791a731e3f2b'),
  'makeup-art-split': u('photo-1596462502278-27bfdc403348'),
  'fizio-centar-zg': u('photo-1576091160399-112ba8d25d1d'),
  'fizio-slavonija': u('photo-1666217924035-071601b960e4'),
  'estetika-rijeka': u('photo-1612349317150-e413f6a5b16d'),
  'estetika-centar-zg': u('photo-1629909615215-6a2b1f6f0b0a'),
  'solar-varazdin': u('photo-1507525428034-b723cf961d3e'),
  'solar-studio-zg': u('photo-1473496163314-42ba6a44ad0c'),
  'ink-rijeka': u('photo-1598371839698-4c3a434731da'),
  'ink-lab-zagreb': u('photo-1611505086850-1aa63afb44ef'),
  'piercing-pula': u('photo-1617039220680-16669eb2fe7d'),
  'piercing-studio-zg': u('photo-1598440944349-43359a6a1f6e'),
  'pula-pets': u('photo-1516734212184-7a14fc8d7298'),
  'pet-groom-zagreb': u('photo-1587300003380-43c1f234fcfd'),
}

export function getSalonImageUrl(salon) {
  if (!salon) return null
  if (SALON_IMAGES[salon.slug]) return SALON_IMAGES[salon.slug]
  const urls = CATEGORY_IMAGES[salon.categorySlug]
  if (!urls?.length) return null
  const idx = salon.imageIndex ?? 0
  return urls[idx % urls.length]
}
