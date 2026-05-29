import { MapPin, Navigation, CreditCard, ParkingCircle } from 'lucide-react'
import { categories } from '../data/categories'
import type { CategoryId, Filters } from '../types'

interface CategorySidebarProps {
  selectedCategory: CategoryId | null
  onCategorySelect: (id: CategoryId | null) => void
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  onResetFilters: () => void
}

export default function CategorySidebar({
  selectedCategory,
  onCategorySelect,
  filters,
  onFiltersChange,
  onResetFilters,
}: CategorySidebarProps) {
  const toggle = (key: keyof Filters) => {
    onFiltersChange({ ...filters, [key]: !filters[key] })
  }

  return (
    <aside className="hidden w-64 shrink-0 border-r border-gray-100 bg-white lg:block xl:w-72">
      <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto p-5">
        <h2 className="mb-4 text-xs font-bold tracking-wider text-gray-400">
          ŠTO TRAŽITE?
        </h2>
        <ul className="space-y-1">
          {categories.map(({ id, label, icon: Icon }) => {
            const active = selectedCategory === id
            return (
              <li key={id}>
                <button
                  type="button"
                  data-testid={`category-${id}`}
                  onClick={() => onCategorySelect(active ? null : id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                    active
                      ? 'bg-zoyya-100 text-zoyya-700'
                      : 'text-gray-600 hover:bg-zoyya-50 hover:text-zoyya-600'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? 'text-zoyya-600' : 'text-zoyya-400'}`} />
                  {label}
                </button>
              </li>
            )
          })}
        </ul>

        <h2 className="mb-4 mt-8 text-xs font-bold tracking-wider text-gray-400">
          FILTRI
        </h2>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-500">Lokacija</label>
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:border-zoyya-200"
            >
              <Navigation className="h-4 w-4 text-zoyya-500" />
              Moja lokacija
            </button>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-500">Udaljenost</label>
            <select
              value={filters.maxDistance}
              onChange={(e) =>
                onFiltersChange({ ...filters, maxDistance: Number(e.target.value) })
              }
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-zoyya-300"
            >
              <option value={2}>Do 2 km</option>
              <option value={5}>Do 5 km</option>
              <option value={10}>Do 10 km</option>
              <option value={100}>Cijeli Zagreb</option>
            </select>
          </div>

          <FilterToggle
            label="Otvoreno sada"
            checked={filters.openNow}
            onChange={() => toggle('openNow')}
          />
          <FilterToggle
            label="Danas dostupno"
            checked={filters.availableToday}
            onChange={() => toggle('availableToday')}
          />

          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-500">
              Cijena: Do {filters.maxPrice} €
            </label>
            <input
              type="range"
              min={10}
              max={100}
              step={5}
              value={filters.maxPrice}
              onChange={(e) =>
                onFiltersChange({ ...filters, maxPrice: Number(e.target.value) })
              }
              className="w-full accent-zoyya-600"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-500">
              Ocjena: {filters.minRating}+
            </label>
            <input
              type="range"
              min={3}
              max={5}
              step={0.5}
              value={filters.minRating}
              onChange={(e) =>
                onFiltersChange({ ...filters, minRating: Number(e.target.value) })
              }
              className="w-full accent-zoyya-600"
            />
          </div>

          <FilterToggle
            label="Plaćanje karticom"
            checked={filters.cardPayment}
            onChange={() => toggle('cardPayment')}
            icon={CreditCard}
          />
          <FilterToggle
            label="Parking"
            checked={filters.parking}
            onChange={() => toggle('parking')}
            icon={ParkingCircle}
          />

          <button
            type="button"
            onClick={onResetFilters}
            className="w-full rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-600 transition hover:border-zoyya-200 hover:text-zoyya-600"
          >
            Poništi filtre
          </button>
        </div>
      </div>
    </aside>
  )
}

function FilterToggle({
  label,
  checked,
  onChange,
  icon: Icon,
}: {
  label: string
  checked: boolean
  onChange: () => void
  icon?: typeof MapPin
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between">
      <span className="flex items-center gap-2 text-sm text-gray-700">
        {Icon && <Icon className="h-4 w-4 text-zoyya-400" />}
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative h-6 w-11 rounded-full transition ${
          checked ? 'bg-zoyya-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
            checked ? 'translate-x-5' : ''
          }`}
        />
      </button>
    </label>
  )
}
