import { CATEGORY_SLUG_TO_FULL } from '../data/categories'

export function filterSalons(salons, filters) {
  let result = [...salons]

  if (filters.city) {
    result = result.filter((s) => s.citySlug === filters.city)
  }

  if (filters.category) {
    const full = CATEGORY_SLUG_TO_FULL[filters.category] || filters.category
    result = result.filter(
      (s) => s.categorySlug === filters.category || s.category === full,
    )
  }

  if (filters.query) {
    const q = filters.query.toLowerCase()
    result = result.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.area.toLowerCase().includes(q),
    )
  }

  if (filters.availableToday) {
    result = result.filter((s) => s.availableToday)
  }

  if (filters.minRating) {
    result = result.filter((s) => s.rating >= filters.minRating)
  }

  if (filters.onlinePayment) {
    result = result.filter((s) => s.onlinePayment)
  }

  if (filters.maxPrice) {
    result = result.filter((s) => s.priceFrom <= filters.maxPrice)
  }

  return result
}

export function slugifyCity(name) {
  const map = {
    Zagreb: 'zagreb',
    Split: 'split',
    Rijeka: 'rijeka',
    Osijek: 'osijek',
    Zadar: 'zadar',
    Varaždin: 'varazdin',
    Pula: 'pula',
  }
  return map[name] || name.toLowerCase().replace(/ž/g, 'z')
}
