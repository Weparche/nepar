import type { LucideIcon } from 'lucide-react'

export type CategoryId =
  | 'frizeri'
  | 'barberi'
  | 'nokti'
  | 'masaze'
  | 'skin-care'
  | 'obrve'
  | 'depilacija'
  | 'make-up'
  | 'wellness'

export interface Category {
  id: CategoryId
  label: string
  icon: LucideIcon
}

export interface Service {
  id: string
  name: string
  duration: number
  price: number
}

export interface Review {
  id: string
  author: string
  rating: number
  text: string
  date: string
}

export interface Salon {
  id: string
  name: string
  neighborhood: string
  category: CategoryId
  categoryLabel: string
  rating: number
  reviewCount: number
  distance: number
  address: string
  lat: number
  lng: number
  image: string
  featuredService: string
  featuredPrice: number
  openNow: boolean
  availableToday: boolean
  acceptsCard: boolean
  hasParking: boolean
  hasDeals: boolean
  workingHours: string
  tags: string[]
  gallery: string[]
  services: Service[]
  reviews: Review[]
}

export interface Filters {
  openNow: boolean
  availableToday: boolean
  maxPrice: number
  minRating: number
  cardPayment: boolean
  parking: boolean
  maxDistance: number
}

export type QuickFilterId =
  | 'nearest'
  | 'open-now'
  | 'available-today'
  | 'top-rated'
  | 'deals'

export interface BookingContact {
  name: string
  phone: string
  email: string
  note: string
}

export interface BookingState {
  salonId: string | null
  serviceId: string | null
  slot: string | null
  contact: BookingContact
  step: 1 | 2 | 3 | 'confirmed'
}
