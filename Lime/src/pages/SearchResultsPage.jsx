import { useState, useMemo, useEffect, useCallback } from 'react'
import { useSearchResultsScroll } from '../hooks/useSearchResultsScroll'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { SearchBar } from '../components/SearchBar'
import { SalonCard } from '../components/SalonCard'
import { BookingModal } from '../components/BookingModal'
import { SearchFiltersSidebar } from '../components/search/SearchFiltersSidebar'
import { MapPanel } from '../components/map/MapPanel'
import { salons } from '../data/salons'
import { CATEGORY_SLUG_TO_FULL, CITIES } from '../data/categories'
import { filterSalons } from '../utils/filters'

const CITY_NAMES = Object.fromEntries(CITIES.map((c) => [c.slug, c.name]))

export function SearchResultsPage() {
  const { city = 'zagreb', category = 'sve' } = useParams()
  const [searchParams] = useSearchParams()
  const [bookingSalon, setBookingSalon] = useState(null)
  const [showMap, setShowMap] = useState(false)
  const [selectedMapSlug, setSelectedMapSlug] = useState(null)
  const [filters, setFilters] = useState({
    availableToday: searchParams.get('danas') === '1' || searchParams.get('kada') === 'danas',
    minRating: false,
    onlinePayment: false,
    maxPrice: null,
  })

  const query = searchParams.get('q') || ''

  useEffect(() => {
    setSelectedMapSlug(null)
  }, [city, category, query, filters])

  const filtered = useMemo(() => {
    return filterSalons(salons, {
      city: city === 'sve' ? null : city,
      category: category === 'sve' ? null : category,
      query,
      availableToday: filters.availableToday,
      minRating: filters.minRating ? 4.5 : null,
      onlinePayment: filters.onlinePayment,
      maxPrice: filters.maxPrice,
    })
  }, [city, category, query, filters])

  useSearchResultsScroll({ city, category, query })

  const cityName = CITY_NAMES[city] || 'Hrvatska'
  const categoryName =
    category === 'sve' ? 'Svi saloni' : CATEGORY_SLUG_TO_FULL[category] || category

  function toggleFilter(key) {
    setFilters((f) => ({ ...f, [key]: !f[key] }))
  }

  const handleSelectSalon = useCallback((salon) => {
    setSelectedMapSlug(salon.slug)
    document.getElementById(`salon-card-${salon.slug}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    })
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-surface-muted">
      <Header />
      <div className="bg-white border-b border-border-subtle py-4 shrink-0">
        <div className="page-container">
          <SearchBar
            compact
            initialCity={cityName}
            initialCategory={category === 'sve' ? '' : category}
            initialQuery={query}
          />
        </div>
      </div>

      <main className="flex-1 page-container py-5 lg:py-6 flex flex-col">
        <nav aria-label="Breadcrumb" className="text-sm text-ink-subtle mb-3 shrink-0">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link to="/" className="hover:text-lime-600 transition-colors">
                Početna
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link to={`/saloni/${city}`} className="hover:text-lime-600 transition-colors">
                {cityName}
              </Link>
            </li>
            {category !== 'sve' && (
              <>
                <li aria-hidden>/</li>
                <li className="text-ink font-medium">{categoryName}</li>
              </>
            )}
          </ol>
        </nav>

        <div
          id="search-results-heading"
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4 shrink-0 scroll-mt-[5.5rem]"
        >
          <div>
            <h1 className="heading-display text-2xl sm:text-3xl text-ink">
              {categoryName} u {cityName}
            </h1>
            <p className="text-sm text-ink-muted mt-1">
              <span className="font-semibold text-ink tabular-nums">{filtered.length}</span> salona
              pronađeno
            </p>
          </div>
          <label className="flex items-center gap-2 text-sm shrink-0">
            <span className="text-ink-muted font-medium">Sortiraj:</span>
            <select
              className="input-field py-2 w-auto min-w-[160px] text-sm"
              defaultValue="popular"
              aria-label="Sortiranje rezultata"
            >
              <option value="popular">Najpopularnije</option>
              <option value="rating">Najbolja ocjena</option>
              <option value="price">Najniža cijena</option>
            </select>
          </label>
        </div>

        <div className="lg:hidden flex gap-2 overflow-x-auto pb-3 -mx-1 px-1 shrink-0">
          <FilterChip active={filters.availableToday} onClick={() => toggleFilter('availableToday')}>
            Danas slobodno
          </FilterChip>
          <FilterChip active={filters.minRating} onClick={() => toggleFilter('minRating')}>
            4.5+
          </FilterChip>
          <FilterChip active={filters.onlinePayment} onClick={() => toggleFilter('onlinePayment')}>
            Online plaćanje
          </FilterChip>
        </div>

        <div className="search-results-layout flex flex-col lg:flex-row lg:items-stretch gap-5 lg:gap-6">
          <SearchFiltersSidebar
            city={city}
            category={category}
            filters={filters}
            onToggleFilter={toggleFilter}
            onMaxPriceChange={(maxPrice) => setFilters((f) => ({ ...f, maxPrice }))}
            resultCount={filtered.length}
          />

          <div className="flex-1 min-w-0 lg:pr-1">
            {filtered.length === 0 ? (
              <div className="card-elevated p-12 sm:p-16 text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-lime-50 flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-lime-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="font-semibold text-ink">Nema salona za odabrane filtre</p>
                <p className="text-sm text-ink-muted mt-1">Pokušajte proširiti pretragu ili ukloniti filtre.</p>
                <Link
                  to={`/saloni/${city}/sve`}
                  className="inline-flex mt-4 text-sm font-semibold text-lime-600 hover:text-lime-700"
                >
                  Poništi filtre →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5 pb-6 items-stretch">
                {filtered.map((salon) => (
                  <div
                    key={salon.id}
                    id={`salon-card-${salon.slug}`}
                    className={`flex flex-col min-h-0 transition-shadow duration-200 rounded-2xl ${
                      selectedMapSlug === salon.slug
                        ? 'ring-2 ring-lime-500 ring-offset-2 shadow-md'
                        : ''
                    }`}
                  >
                    <SalonCard salon={salon} onBook={setBookingSalon} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <aside
            className={`lg:block w-full lg:w-[22rem] xl:w-[24rem] shrink-0 self-stretch ${
              showMap ? 'fixed inset-0 z-[var(--z-overlay)] lg:relative lg:inset-auto' : 'hidden lg:block'
            }`}
          >
            {showMap && (
              <div
                className="lg:hidden absolute inset-0 bg-ink/50 backdrop-blur-sm"
                onClick={() => setShowMap(false)}
                aria-hidden
              />
            )}
            <div
              className={`${
                showMap
                  ? 'fixed inset-x-0 bottom-0 top-16 lg:static lg:inset-auto flex flex-col'
                  : ''
              } lg:sticky lg:top-[4.25rem] lg:self-start z-10 lg:py-6`}
            >
              <div
                className={`card-elevated overflow-hidden flex flex-col m-0 h-[calc(100vh-4.25rem-3rem)] max-h-[calc(100vh-4.25rem-3rem)] ${
                  showMap ? 'rounded-t-2xl lg:rounded-2xl flex-1 min-h-0' : 'rounded-2xl'
                }`}
              >
                <MapPanel
                  salons={filtered}
                  citySlug={city}
                  selectedSlug={selectedMapSlug}
                  onSelectSalon={handleSelectSalon}
                  onClose={() => setShowMap(false)}
                  showClose={showMap}
                  resizeTrigger={showMap ? 1 : 0}
                  className="flex-1 min-h-0"
                />
              </div>
            </div>
          </aside>
        </div>
      </main>

      <button
        type="button"
        onClick={() => setShowMap(true)}
        className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[var(--z-sticky)] px-6 py-3.5 bg-ink text-white font-semibold rounded-full shadow-[0_8px_24px_rgb(15_23_42/0.35)] flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-lime-500 focus-visible:ring-offset-2"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        Prikaži mapu
      </button>

      <Footer />
      <BookingModal salon={bookingSalon} open={!!bookingSalon} onClose={() => setBookingSalon(null)} />
    </div>
  )
}

function FilterChip({ children, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-lime-500 ${
        active
          ? 'bg-lime-600 text-white border-lime-600'
          : 'bg-white text-ink-muted border-border hover:border-lime-200'
      }`}
    >
      {children}
    </button>
  )
}
