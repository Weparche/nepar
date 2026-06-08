import { Link } from 'react-router-dom'
import { CATEGORIES, CITIES } from '../../data/categories'
import { CategoryIcon } from '../CategoryIcon'
import { getCategoryMapStyle } from '../../data/categoryMapStyles'
import { scrollToResultsHeadingBeforeFilter } from '../../utils/searchResultsScroll'

export function SearchFiltersSidebar({
  city,
  category,
  filters,
  onToggleFilter,
  onMaxPriceChange,
  resultCount,
}) {
  return (
    <aside className="hidden lg:block w-[17.5rem] shrink-0 self-stretch">
      <div className="lg:sticky lg:top-[4.25rem] lg:self-start z-10 lg:py-6">
        <div className="search-filters-panel card-elevated flex flex-col h-[calc(100vh-4.25rem-3rem)] max-h-[calc(100vh-4.25rem-3rem)] overflow-hidden">
        <div className="shrink-0 px-4 pt-4 pb-3 border-b border-border-subtle bg-surface-muted/50">
          <h3 className="font-semibold text-ink text-sm">Filtri</h3>
          <p className="text-xs text-ink-muted mt-0.5 tabular-nums">{resultCount} rezultata</p>
        </div>

        <div className="shrink-0 px-4 py-4 space-y-4 border-b border-border-subtle">
          <div className="space-y-2.5">
            <FilterCheck
              label="Danas slobodno"
              checked={filters.availableToday}
              onChange={() => onToggleFilter('availableToday')}
            />
            <FilterCheck
              label="Ocjena 4.5+"
              checked={filters.minRating}
              onChange={() => onToggleFilter('minRating')}
            />
            <FilterCheck label="Najbliže meni" checked={false} onChange={() => {}} disabled />
            <FilterCheck
              label="Online plaćanje"
              checked={filters.onlinePayment}
              onChange={() => onToggleFilter('onlinePayment')}
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
              Cijena (max)
            </label>
            <select
              className="input-field mt-1.5 py-2 text-sm w-full"
              value={filters.maxPrice || ''}
              onChange={(e) => onMaxPriceChange(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">Bilo koja</option>
              <option value="30">Do 30 €</option>
              <option value="50">Do 50 €</option>
              <option value="80">Do 80 €</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
              Grad
            </label>
            <select className="input-field mt-1.5 py-2 text-sm w-full" value={city} disabled>
              {CITIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col flex-1 min-h-0">
          <p className="shrink-0 px-4 pt-3 pb-2 text-xs font-semibold uppercase tracking-wider text-ink-subtle">
            Kategorija
          </p>
          <nav
            className="search-filters-categories flex-1 min-h-0 overflow-y-auto overscroll-contain px-2 pb-3"
            aria-label="Kategorije"
          >
            <Link
              to={`/saloni/${city}/sve`}
              onClick={scrollToResultsHeadingBeforeFilter}
              className={`search-filter-category ${category === 'sve' ? 'is-active' : ''}`}
            >
              <span className="search-filter-category__icon search-filter-category__icon--all">∞</span>
              <span className="flex-1 min-w-0">
                <span className="block font-medium text-sm">Sve djelatnosti</span>
              </span>
            </Link>
            {CATEGORIES.map((c) => {
              const style = getCategoryMapStyle(c.slug)
              return (
                <Link
                  key={c.slug}
                  to={`/saloni/${city}/${c.slug}`}
                  onClick={scrollToResultsHeadingBeforeFilter}
                  className={`search-filter-category ${category === c.slug ? 'is-active' : ''}`}
                >
                  <span
                    className="search-filter-category__icon"
                    style={{ backgroundColor: style.pinColor, color: style.iconColor }}
                  >
                    <CategoryIcon slug={c.slug} className="w-3.5 h-3.5" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-medium text-sm truncate">{c.name}</span>
                  </span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
      </div>
    </aside>
  )
}

function FilterCheck({ label, checked, onChange, disabled }) {
  return (
    <label
      className={`flex items-center gap-2.5 text-sm py-0.5 ${disabled ? 'opacity-50' : 'cursor-pointer group'}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="rounded border-border text-lime-600 focus:ring-lime-500 w-4 h-4"
      />
      <span className="text-ink-muted group-hover:text-ink transition-colors">{label}</span>
    </label>
  )
}
