import { X, Star, MapPin, Clock, Heart } from 'lucide-react'
import { MiniMap } from './MarketplaceMap'
import type { Salon } from '../types'

interface SalonDetailModalProps {
  salon: Salon | null
  isFavorite: boolean
  onClose: () => void
  onToggleFavorite: (id: string) => void
  onBook: (salon: Salon) => void
  onSelectService: (salon: Salon, serviceId: string) => void
}

export default function SalonDetailModal({
  salon,
  isFavorite,
  onClose,
  onToggleFavorite,
  onBook,
  onSelectService,
}: SalonDetailModalProps) {
  if (!salon) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
      data-testid="salon-detail-modal"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 shadow-md transition hover:bg-white"
          aria-label="Zatvori"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>

        <div className="relative h-56 sm:h-64">
          <img src={salon.image} alt={salon.name} className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => onToggleFavorite(salon.id)}
            className="absolute left-4 top-4 rounded-full bg-white/90 p-2.5 shadow-md"
          >
            <Heart
              className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
            />
          </button>
        </div>

        <div className="p-6 pb-24">
          <h2 className="text-2xl font-bold text-gray-900">{salon.name}</h2>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
            <span className="flex items-center gap-1 font-semibold">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              {salon.rating} ({salon.reviewCount} recenzija)
            </span>
            <span className="flex items-center gap-1 text-gray-500">
              <MapPin className="h-4 w-4" />
              {salon.address}
            </span>
            <span className="text-zoyya-600">{salon.distance} km</span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {salon.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-zoyya-50 px-3 py-1 text-xs font-medium text-zoyya-700"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4 text-zoyya-500" />
            {salon.workingHours}
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-gray-100">
            <MiniMap salon={salon} />
          </div>

          <h3 className="mt-6 text-lg font-semibold">Galerija</h3>
          <div className="mt-2 flex gap-2 overflow-x-auto scrollbar-hide">
            {salon.gallery.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                className="h-20 w-28 shrink-0 rounded-lg object-cover"
              />
            ))}
          </div>

          <h3 className="mt-6 text-lg font-semibold">Usluge</h3>
          <ul className="mt-3 space-y-2">
            {salon.services.map((service) => (
              <li
                key={service.id}
                className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-gray-900">{service.name}</p>
                  <p className="text-sm text-gray-400">{service.duration} min</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-zoyya-700">{service.price} €</span>
                  <button
                    type="button"
                    data-testid={`select-service-${service.id}`}
                    onClick={() => onSelectService(salon, service.id)}
                    className="rounded-lg bg-zoyya-100 px-3 py-1.5 text-sm font-semibold text-zoyya-700 transition hover:bg-zoyya-200"
                  >
                    Odaberi
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <h3 className="mt-6 text-lg font-semibold">Recenzije</h3>
          <div className="mt-3 space-y-3">
            {salon.reviews.map((review) => (
              <div key={review.id} className="rounded-xl bg-zoyya-50/50 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{review.author}</span>
                  <span className="flex items-center gap-1 text-sm">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {review.rating}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600">{review.text}</p>
                <p className="mt-1 text-xs text-gray-400">{review.date}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 border-t border-gray-100 bg-white p-4 sm:static sm:rounded-b-3xl">
          <button
            type="button"
            data-testid="book-from-detail"
            onClick={() => onBook(salon)}
            className="w-full rounded-xl bg-zoyya-600 py-3.5 text-sm font-semibold text-white transition hover:bg-zoyya-700"
          >
            Rezerviraj termin
          </button>
        </div>
      </div>
    </div>
  )
}
