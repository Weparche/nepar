import { useCallback, useMemo, useState } from 'react'
import { MoreHorizontal } from 'lucide-react'
import Navbar, { MobileHeader } from './components/Navbar'
import CategorySidebar from './components/CategorySidebar'
import MarketplaceMap from './components/MarketplaceMap'
import SalonCard from './components/SalonCard'
import QuickFilters from './components/QuickFilters'
import SearchBar from './components/SearchBar'
import MobileBottomNav, { type NavItem } from './components/MobileBottomNav'
import SalonDetailModal from './components/SalonDetailModal'
import BookingFlow, { defaultBooking } from './components/BookingFlow'
import { mobileCategories } from './data/categories'
import { salons } from './data/salons'
import type { CategoryId, Filters, QuickFilterId, Salon } from './types'

const defaultFilters: Filters = {
  openNow: false,
  availableToday: false,
  maxPrice: 40,
  minRating: 4,
  cardPayment: false,
  parking: false,
  maxDistance: 5,
}

function filterSalons(
  allSalons: Salon[],
  search: string,
  category: CategoryId | null,
  filters: Filters,
  quickFilter: QuickFilterId | null,
): Salon[] {
  let result = [...allSalons]

  if (search.trim()) {
    const q = search.toLowerCase()
    result = result.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.categoryLabel.toLowerCase().includes(q) ||
        s.neighborhood.toLowerCase().includes(q) ||
        s.featuredService.toLowerCase().includes(q) ||
        s.services.some((svc) => svc.name.toLowerCase().includes(q)),
    )
  }

  if (category) {
    result = result.filter((s) => s.category === category)
  }

  if (filters.openNow) result = result.filter((s) => s.openNow)
  if (filters.availableToday) result = result.filter((s) => s.availableToday)
  if (filters.cardPayment) result = result.filter((s) => s.acceptsCard)
  if (filters.parking) result = result.filter((s) => s.hasParking)
  result = result.filter(
    (s) => s.featuredPrice <= filters.maxPrice && s.rating >= filters.minRating && s.distance <= filters.maxDistance,
  )

  switch (quickFilter) {
    case 'nearest':
      result.sort((a, b) => a.distance - b.distance)
      break
    case 'open-now':
      result = result.filter((s) => s.openNow)
      break
    case 'available-today':
      result = result.filter((s) => s.availableToday)
      break
    case 'top-rated':
      result = result.filter((s) => s.rating >= 4.7).sort((a, b) => b.rating - a.rating)
      break
    case 'deals':
      result = result.filter((s) => s.hasDeals)
      break
  }

  return result
}

export default function App() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null)
  const [filters, setFilters] = useState<Filters>(defaultFilters)
  const [quickFilter, setQuickFilter] = useState<QuickFilterId | null>(null)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [booking, setBooking] = useState(defaultBooking())
  const [mobileNav, setMobileNav] = useState<NavItem>('home')
  const [showMobileList, setShowMobileList] = useState(true)

  const filteredSalons = useMemo(
    () => filterSalons(salons, search, selectedCategory, filters, quickFilter),
    [search, selectedCategory, filters, quickFilter],
  )

  const favoriteSalons = useMemo(
    () => salons.filter((s) => favorites.has(s.id)),
    [favorites],
  )

  const displaySalons =
    mobileNav === 'favorites' ? favoriteSalons : filteredSalons

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const openBooking = useCallback((salon: Salon, serviceId?: string) => {
    setSelectedSalon(null)
    setBooking({
      ...defaultBooking(salon.id),
      serviceId: serviceId ?? null,
      step: serviceId ? 2 : 1,
    })
    setBookingOpen(true)
  }, [])

  const resetFilters = () => {
    setFilters(defaultFilters)
    setSelectedCategory(null)
    setQuickFilter(null)
    setSearch('')
  }

  return (
    <div className="min-h-full bg-white" data-testid="zoyya-app">
      {/* Desktop layout */}
      <div className="hidden lg:block" data-testid="desktop-layout">
        <Navbar
          favoriteCount={favorites.size}
          search={search}
          onSearchChange={setSearch}
          onFavoritesClick={() => setQuickFilter(null)}
        />
        <div className="mx-auto flex max-w-[1600px]">
          <CategorySidebar
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            filters={filters}
            onFiltersChange={setFilters}
            onResetFilters={resetFilters}
          />
          <main className="min-w-0 flex-1 p-6">
            <div className="mb-4 lg:hidden">
              <SearchBar value={search} onChange={setSearch} />
            </div>

            <MarketplaceMap
              salons={filteredSalons}
              onSalonClick={setSelectedSalon}
              height="440px"
            />

            <div className="my-5">
              <QuickFilters active={quickFilter} onSelect={setQuickFilter} />
            </div>

            <section data-testid="recommended-salons">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Preporučeni saloni</h2>
                <button type="button" className="text-sm font-semibold text-zoyya-600 hover:underline">
                  Pogledaj sve
                </button>
              </div>

              {filteredSalons.length === 0 ? (
                <EmptyState onReset={resetFilters} />
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {filteredSalons.map((salon) => (
                    <SalonCard
                      key={salon.id}
                      salon={salon}
                      isFavorite={favorites.has(salon.id)}
                      onToggleFavorite={toggleFavorite}
                      onBook={openBooking}
                      onClick={setSelectedSalon}
                    />
                  ))}
                </div>
              )}
            </section>

            <footer className="mt-10 grid gap-4 md:grid-cols-2">
              <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-zoyya-600 to-zoyya-800 p-8 text-white">
                <h3 className="text-xl font-bold">Tvoj savršeni termin, na jednom mjestu.</h3>
                <p className="mt-2 text-sm text-zoyya-100">
                  Otkrij salone, usluge i wellness tretmane u Zagrebu.
                </p>
                <button
                  type="button"
                  className="mt-4 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-zoyya-700"
                >
                  Istraži usluge
                </button>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-zoyya-50 p-8">
                <h3 className="text-xl font-bold text-gray-900">Za salone i stručnjake</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Pridružite se Zoyya marketplaceu i privucite nove klijente.
                </p>
                <button
                  type="button"
                  className="mt-4 rounded-xl border border-zoyya-200 bg-white px-5 py-2.5 text-sm font-semibold text-zoyya-700"
                >
                  Saznaj više
                </button>
              </div>
            </footer>
          </main>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="lg:hidden" data-testid="mobile-layout">
        <MobileHeader />
        <main className="px-4 pb-24 pt-3">
          <SearchBar value={search} onChange={setSearch} className="mb-4" />

          <div className="mb-4 flex gap-3 overflow-x-auto scrollbar-hide">
            {mobileCategories.map(({ id, label, icon: Icon }) => {
              const active = selectedCategory === id
              return (
                <button
                  key={id}
                  type="button"
                  data-testid={`mobile-category-${id}`}
                  onClick={() => setSelectedCategory(active ? null : id)}
                  className="flex shrink-0 flex-col items-center gap-1.5"
                >
                  <span
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl transition ${
                      active
                        ? 'bg-zoyya-600 text-white shadow-md shadow-zoyya-200'
                        : 'bg-zoyya-50 text-zoyya-600'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className={`text-xs font-medium ${active ? 'text-zoyya-700' : 'text-gray-500'}`}>
                    {label}
                  </span>
                </button>
              )
            })}
            <button type="button" className="flex shrink-0 flex-col items-center gap-1.5">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
                <MoreHorizontal className="h-5 w-5" />
              </span>
              <span className="text-xs font-medium text-gray-500">Više</span>
            </button>
          </div>

          {!showMobileList && (
            <div className="mb-4">
              <MarketplaceMap
                salons={displaySalons}
                onSalonClick={setSelectedSalon}
                height="280px"
                showSearchArea={false}
                showListButton
                onShowList={() => setShowMobileList(true)}
              />
            </div>
          )}

          {showMobileList && (
            <>
              <div className="mb-4">
                <MarketplaceMap
                  salons={displaySalons}
                  onSalonClick={setSelectedSalon}
                  height="200px"
                  showSearchArea={false}
                  showListButton
                  onShowList={() => setShowMobileList(false)}
                />
              </div>

              <section data-testid="mobile-salon-list">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-lg font-bold">
                    {mobileNav === 'favorites' ? 'Favoriti' : 'Preporučeni saloni'}
                  </h2>
                  <button type="button" className="text-sm font-semibold text-zoyya-600">
                    Pogledaj sve
                  </button>
                </div>

                {displaySalons.length === 0 ? (
                  <EmptyState onReset={resetFilters} />
                ) : (
                  <div className="space-y-3">
                    {displaySalons.map((salon) => (
                      <SalonCard
                        key={salon.id}
                        salon={salon}
                        variant="list"
                        isFavorite={favorites.has(salon.id)}
                        onToggleFavorite={toggleFavorite}
                        onBook={openBooking}
                        onClick={setSelectedSalon}
                      />
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </main>

        <MobileBottomNav
          active={mobileNav}
          onChange={setMobileNav}
          favoriteCount={favorites.size}
        />
      </div>

      <SalonDetailModal
        salon={selectedSalon}
        isFavorite={selectedSalon ? favorites.has(selectedSalon.id) : false}
        onClose={() => setSelectedSalon(null)}
        onToggleFavorite={toggleFavorite}
        onBook={openBooking}
        onSelectService={(salon, serviceId) => openBooking(salon, serviceId)}
      />

      <BookingFlow
        open={bookingOpen}
        salon={salons.find((s) => s.id === booking.salonId) ?? null}
        booking={booking}
        onClose={() => {
          setBookingOpen(false)
          setBooking(defaultBooking())
        }}
        onUpdate={setBooking}
        onConfirm={() => setBooking((b) => ({ ...b, step: 'confirmed' }))}
        onBack={() =>
          setBooking((b) => ({
            ...b,
            step: b.step === 3 ? 2 : 1,
            ...(b.step === 2 ? { slot: null } : {}),
            ...(b.step === 1 ? { serviceId: null } : {}),
          }))
        }
      />
    </div>
  )
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zoyya-200 bg-zoyya-50/50 py-16 text-center"
      data-testid="empty-state"
    >
      <p className="text-lg font-semibold text-gray-700">Nema salona za prikaz</p>
      <p className="mt-1 text-sm text-gray-500">Pokušajte promijeniti filtere ili pretragu.</p>
      <button
        type="button"
        onClick={onReset}
        className="mt-4 rounded-xl bg-zoyya-600 px-5 py-2 text-sm font-semibold text-white"
      >
        Poništi filtre
      </button>
    </div>
  )
}
