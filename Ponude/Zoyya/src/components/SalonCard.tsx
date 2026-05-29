import { Heart, Star, MapPin } from 'lucide-react'
import type { Salon } from '../types'

interface SalonCardProps {
  salon: Salon
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
  onBook: (salon: Salon) => void
  onClick: (salon: Salon) => void
  variant?: 'grid' | 'list'
}

export default function SalonCard({
  salon,
  isFavorite,
  onToggleFavorite,
  onBook,
  onClick,
  variant = 'grid',
}: SalonCardProps) {
  if (variant === 'list') {
    return (
      <article
        data-testid={`salon-card-${salon.id}`}
        className="flex gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition hover:shadow-md"
      >
        <button type="button" onClick={() => onClick(salon)} className="shrink-0">
          <img
            src={salon.image}
            alt={salon.name}
            className="h-24 w-24 rounded-xl object-cover"
          />
        </button>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-2">
            <button type="button" onClick={() => onClick(salon)} className="text-left">
              <h3 className="font-semibold text-gray-900">{salon.name}</h3>
            </button>
            <button
              type="button"
              data-testid={`favorite-${salon.id}`}
              onClick={(e) => {
                e.stopPropagation()
                onToggleFavorite(salon.id)
              }}
              className="shrink-0 rounded-full p-1.5 transition hover:bg-zoyya-50"
              aria-label={isFavorite ? 'Ukloni iz favorita' : 'Dodaj u favorite'}
            >
              <Heart
                className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-300'}`}
              />
            </button>
          </div>
          <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-gray-700">{salon.rating}</span>
            <span>({salon.reviewCount})</span>
          </div>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
            <MapPin className="h-3 w-3" />
            {salon.neighborhood} • {salon.distance} km
          </p>
          <p className="mt-1 text-xs font-medium text-zoyya-600">
            {salon.featuredService} od {salon.featuredPrice} €
          </p>
          <button
            type="button"
            onClick={() => onBook(salon)}
            className="mt-auto self-start rounded-lg bg-zoyya-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-zoyya-700"
          >
            Rezerviraj
          </button>
        </div>
      </article>
    )
  }

  return (
    <article
      data-testid={`salon-card-${salon.id}`}
      className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative">
        <button type="button" onClick={() => onClick(salon)} className="block w-full">
          <img
            src={salon.image}
            alt={salon.name}
            className="h-44 w-full object-cover transition group-hover:scale-[1.02]"
          />
        </button>
        <button
          type="button"
          data-testid={`favorite-${salon.id}`}
          onClick={() => onToggleFavorite(salon.id)}
          className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-sm backdrop-blur transition hover:bg-white"
          aria-label={isFavorite ? 'Ukloni iz favorita' : 'Dodaj u favorite'}
        >
          <Heart
            className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
          />
        </button>
      </div>

      <div className="p-4">
        <button type="button" onClick={() => onClick(salon)} className="text-left">
          <h3 className="font-semibold text-gray-900">{salon.name}</h3>
        </button>
        <div className="mt-1 flex items-center gap-1 text-sm">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="font-semibold">{salon.rating}</span>
          <span className="text-gray-400">({salon.reviewCount})</span>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          {salon.neighborhood}, Zagreb • {salon.distance} km
        </p>
        <p className="mt-0.5 text-xs font-medium text-zoyya-500">{salon.categoryLabel}</p>
        <p className="mt-2 text-sm text-gray-700">
          {salon.featuredService}{' '}
          <span className="font-semibold">od {salon.featuredPrice} €</span>
        </p>
        <button
          type="button"
          onClick={() => onBook(salon)}
          className="mt-3 w-full rounded-xl bg-zoyya-600 py-2.5 text-sm font-semibold text-white transition hover:bg-zoyya-700"
        >
          Rezerviraj termin
        </button>
      </div>
    </article>
  )
}
