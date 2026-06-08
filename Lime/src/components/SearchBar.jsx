import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/Button'
import { slugifyCity } from '../utils/filters'

const CATEGORY_OPTIONS = [
  { value: '', label: 'Sve djelatnosti' },
  { value: 'frizeri', label: 'Frizeri' },
  { value: 'barberi', label: 'Barberi' },
  { value: 'nokti', label: 'Nokti' },
  { value: 'kozmetika', label: 'Kozmetika' },
  { value: 'obrve', label: 'Obrve i trepavice' },
  { value: 'masaza', label: 'Masaža' },
  { value: 'wellness', label: 'Wellness' },
  { value: 'depilacija', label: 'Depilacija' },
  { value: 'makeup', label: 'Make-up' },
  { value: 'fizioterapija', label: 'Fizioterapija' },
  { value: 'pet-grooming', label: 'Pet grooming' },
  { value: 'tetoviranje', label: 'Tetoviranje' },
  { value: 'estetski', label: 'Estetski tretmani' },
  { value: 'solariji', label: 'Solariji' },
  { value: 'piercing', label: 'Piercing' },
]

const CITY_OPTIONS = [
  'Zagreb',
  'Split',
  'Rijeka',
  'Osijek',
  'Zadar',
  'Varaždin',
  'Pula',
]

export function SearchBar({
  compact = false,
  initialQuery = '',
  initialCity = 'Zagreb',
  initialCategory = '',
  initialWhen = '',
}) {
  const navigate = useNavigate()
  const [query, setQuery] = useState(initialQuery)
  const [city, setCity] = useState(initialCity)
  const [category, setCategory] = useState(initialCategory)
  const [when, setWhen] = useState(initialWhen)

  function handleSearch(e) {
    e?.preventDefault()
    const citySlug = slugifyCity(city)
    const cat = category || 'sve'
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (when === 'danas') params.set('danas', '1')
    else if (when) params.set('kada', when)
    const qs = params.toString()
    navigate(`/saloni/${citySlug}/${cat}${qs ? `?${qs}` : ''}`)
  }

  if (compact) {
    return (
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2" role="search">
        <label className="sr-only" htmlFor="search-query-compact">Što tražiš</label>
        <input
          id="search-query-compact"
          type="search"
          placeholder="Što tražiš?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input-field flex-1"
        />
        <label className="sr-only" htmlFor="search-city-compact">Grad</label>
        <select
          id="search-city-compact"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="input-field sm:w-40"
        >
          {CITY_OPTIONS.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <Button type="submit" size="md" className="shrink-0">
          Pretraži
        </Button>
      </form>
    )
  }

  return (
    <form
      onSubmit={handleSearch}
      role="search"
      aria-label="Pretraži salone"
      className="bg-white rounded-2xl border border-border-subtle p-1.5 sm:p-2"
      style={{ boxShadow: 'var(--shadow-search)' }}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-0 md:divide-x md:divide-border-subtle">
        <div className="md:col-span-4 p-3 md:py-4">
          <label htmlFor="search-query" className="block text-[11px] font-semibold uppercase tracking-wider text-ink-subtle mb-1.5">
            Što tražiš?
          </label>
          <input
            id="search-query"
            type="search"
            placeholder="Frizer, nokti, masaža..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-[0.9375rem] font-medium text-ink placeholder:text-ink-subtle bg-transparent border-0 p-0 focus:outline-none focus:ring-0"
          />
        </div>
        <div className="md:col-span-3 p-3 md:py-4 border-t md:border-t-0 border-border-subtle">
          <label htmlFor="search-city" className="block text-[11px] font-semibold uppercase tracking-wider text-ink-subtle mb-1.5">
            Gdje?
          </label>
          <select
            id="search-city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full text-[0.9375rem] font-medium text-ink bg-transparent border-0 p-0 focus:outline-none focus:ring-0 cursor-pointer"
          >
            {CITY_OPTIONS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2 p-3 md:py-4 border-t md:border-t-0 border-border-subtle">
          <label htmlFor="search-when" className="block text-[11px] font-semibold uppercase tracking-wider text-ink-subtle mb-1.5">
            Kada?
          </label>
          <select
            id="search-when"
            value={when}
            onChange={(e) => setWhen(e.target.value)}
            className="w-full text-[0.9375rem] font-medium text-ink bg-transparent border-0 p-0 focus:outline-none cursor-pointer"
          >
            <option value="">Bilo kada</option>
            <option value="danas">Danas</option>
            <option value="sutra">Sutra</option>
            <option value="ovaj-tjedan">Ovaj tjedan</option>
          </select>
        </div>
        <div className="hidden lg:block md:col-span-3 p-3 md:py-4 border-t lg:border-t-0 border-border-subtle">
          <label htmlFor="search-category" className="block text-[11px] font-semibold uppercase tracking-wider text-ink-subtle mb-1.5">
            Djelatnost
          </label>
          <select
            id="search-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full text-[0.9375rem] font-medium text-ink bg-transparent border-0 p-0 focus:outline-none cursor-pointer"
          >
            {CATEGORY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 p-2 pt-0 sm:pt-1 sm:items-center sm:justify-between">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Djelatnost"
          className="input-field lg:hidden text-sm"
        >
          {CATEGORY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <Button type="submit" size="lg" className="w-full sm:w-auto sm:ml-auto sm:min-w-[180px]">
          Pronađi termin
        </Button>
      </div>
    </form>
  )
}
