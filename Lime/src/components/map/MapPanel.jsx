import { Link } from 'react-router-dom'
import { SalonsMap } from './SalonsMap'
import { MapCategoryLegend } from './MapCategoryLegend'
import { getCategoryMapStyle } from '../../data/categoryMapStyles'

export function MapPanel({
  salons,
  citySlug,
  selectedSlug,
  onSelectSalon,
  onClose,
  showClose = false,
  resizeTrigger = 0,
  className = '',
}) {
  return (
    <div
      className={`map-panel grid min-h-0 h-full overflow-hidden bg-white grid-rows-[auto_minmax(0,1fr)_auto] ${className}`}
    >
      <div className="map-panel__header flex items-center justify-between gap-2 px-4 py-2.5 border-b border-border-subtle bg-surface-muted/40">
        <div>
          <h2 className="text-sm font-semibold text-ink">Karta salona</h2>
          <p className="text-xs text-ink-muted tabular-nums">{salons.length} lokacija</p>
        </div>
        {showClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-semibold text-lime-600 hover:text-lime-700 px-2 py-1 rounded-lg hover:bg-lime-50"
          >
            Zatvori
          </button>
        )}
      </div>

      <div className="map-panel__map min-h-[7rem] relative">
        <SalonsMap
          salons={salons}
          citySlug={citySlug}
          selectedSlug={selectedSlug}
          onMarkerClick={onSelectSalon}
          className="absolute inset-0 h-full"
          resizeTrigger={resizeTrigger}
        />
      </div>

      <MapCategoryLegend salons={salons} />
    </div>
  )
}

export function MapSalonPopupContent({ salon }) {
  const style = getCategoryMapStyle(salon.categorySlug)
  return (
    <div className="salon-map-popup min-w-[240px]">
      {salon.imageUrl && (
        <img
          src={salon.imageUrl}
          alt=""
          className="salon-map-popup__thumb w-full h-28 object-cover rounded-xl mb-3 ring-1 ring-border-subtle"
          loading="lazy"
        />
      )}
      <span
        className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md mb-2"
        style={{ backgroundColor: `${style.pinColor}22`, color: style.pinColor }}
      >
        {style.label}
      </span>
      <p className="font-semibold text-ink text-sm leading-snug">{salon.name}</p>
      <p className="text-xs text-ink-muted mt-0.5">{salon.area}, {salon.city}</p>
      <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-border-subtle">
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-sm font-bold tabular-nums bg-lime-600 text-white">
          {salon.rating}
        </span>
        <span className="text-xs text-ink-muted">({salon.reviewCount} recenzija)</span>
        <span className="text-xs font-semibold text-lime-700 ml-auto">od {salon.priceFrom} €</span>
      </div>
      {salon.availableToday && (
        <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wide text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
          Danas slobodno
        </span>
      )}
      <Link
        to={`/salon/${salon.slug}`}
        className="mt-3 block w-full text-center text-xs font-semibold text-white bg-lime-600 hover:bg-lime-700 rounded-lg py-2.5 transition-colors"
      >
        Pogledaj salon
      </Link>
    </div>
  )
}
