import { Link } from 'react-router-dom'
import { StarIcon } from './icons'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import { SalonCover } from './SalonCover'

export function SalonCard({ salon, onBook, featured = false }) {
  return (
    <article
      className={`group card-elevated-interactive overflow-hidden flex flex-col h-full ${
        featured ? 'ring-1 ring-lime-200/50' : ''
      }`}
    >
      <Link
        to={`/salon/${salon.slug}`}
        className="block relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 focus-visible:ring-inset"
      >
        <SalonCover
          category={salon.category}
          name={salon.name}
          imageUrl={salon.imageUrl}
          imageFallbackSlug={salon.slug}
          className="rounded-none rounded-t-2xl"
        />
        {salon.rating >= 4.8 && (
          <span className="absolute top-3 left-3">
            <Badge variant="lime">Top ocjena</Badge>
          </span>
        )}
      </Link>

      <div className="p-4 sm:p-5 flex flex-col flex-1 gap-3">
        <Link to={`/salon/${salon.slug}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 rounded-lg">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-semibold text-ink truncate group-hover:text-lime-700 transition-colors duration-150">
                {salon.name}
              </h3>
              <p className="text-sm text-ink-muted mt-0.5 truncate">{salon.category}</p>
            </div>
            <div
              className="flex items-center gap-1 shrink-0 bg-slate-50 ring-1 ring-border-subtle px-2.5 py-1 rounded-lg"
              aria-label={`Ocjena ${salon.rating} od 5, ${salon.reviewCount} recenzija`}
            >
              <StarIcon className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-sm font-bold text-ink tabular-nums">{salon.rating}</span>
              <span className="text-xs text-ink-subtle">({salon.reviewCount})</span>
            </div>
          </div>
          <p className="text-sm text-ink-muted mt-2 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-lime-400 shrink-0" aria-hidden />
            {salon.area}, {salon.city}
          </p>
        </Link>

        <div className="flex items-center justify-between gap-2 pt-1 border-t border-border-subtle min-h-[1.75rem]">
          <p className="text-sm text-ink-muted">
            od <span className="text-ink font-bold tabular-nums">{salon.priceFrom} €</span>
          </p>
          <div className="shrink-0">
            {salon.availableToday && <Badge variant="success">Danas</Badge>}
            {salon.onlinePayment && !salon.availableToday && (
              <Badge variant="neutral">Online plaćanje</Badge>
            )}
          </div>
        </div>

        {salon.appointments?.length > 0 && (
          <div
            className="flex flex-wrap gap-1.5 min-h-[2.125rem] content-start"
            role="list"
            aria-label="Dostupni termini"
          >
            {salon.appointments.slice(0, 4).map((time) => (
              <span
                key={time}
                role="listitem"
                className="px-2.5 py-1 text-xs font-semibold tabular-nums bg-lime-50 text-lime-800 rounded-md ring-1 ring-lime-100"
              >
                {time}
              </span>
            ))}
          </div>
        )}

        <Button
          className="w-full mt-auto"
          onClick={(e) => {
            e.preventDefault()
            onBook?.(salon)
          }}
        >
          Rezerviraj
        </Button>
      </div>
    </article>
  )
}
