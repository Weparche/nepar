import { Heart } from 'lucide-react'
import SearchBar, { CitySelector } from './SearchBar'

interface NavbarProps {
  favoriteCount: number
  search: string
  onSearchChange: (value: string) => void
  onFavoritesClick?: () => void
}

export default function Navbar({
  favoriteCount,
  search,
  onSearchChange,
  onFavoritesClick,
}: NavbarProps) {
  const links = ['Početna', 'Usluge', 'Saloni', 'Pokloni', 'Za salone']

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-6 px-6">
        <a href="#" className="shrink-0 text-2xl font-extrabold tracking-tight text-zoyya-600">
          zoyya
        </a>

        <nav className="hidden items-center gap-5 xl:flex">
          {links.map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm font-medium text-gray-600 transition hover:text-zoyya-600"
            >
              {link}
            </a>
          ))}
        </nav>

        <div className="hidden flex-1 lg:block">
          <SearchBar value={search} onChange={onSearchChange} className="max-w-md" />
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden sm:block">
            <CitySelector />
          </div>
          <button
            type="button"
            onClick={onFavoritesClick}
            className="relative flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-gray-600 transition hover:bg-zoyya-50 hover:text-zoyya-600"
          >
            <Heart className="h-4 w-4" />
            <span className="hidden md:inline">Favoriti</span>
            {favoriteCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-zoyya-600 text-[10px] font-bold text-white">
                {favoriteCount}
              </span>
            )}
          </button>
          <button
            type="button"
            className="rounded-xl bg-zoyya-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-zoyya-200 transition hover:bg-zoyya-700"
          >
            Prijava / Registracija
          </button>
        </div>
      </div>
    </header>
  )
}

export function MobileHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white px-4 py-3">
      <div className="flex items-center justify-between">
        <span className="text-xl font-extrabold text-zoyya-600">zoyya</span>
        <div className="flex items-center gap-2">
          <CitySelector compact />
          <button
            type="button"
            className="relative rounded-lg p-2 text-gray-600 hover:bg-zoyya-50"
            aria-label="Obavijesti"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
          </button>
          <button
            type="button"
            className="rounded-lg p-2 text-gray-600 hover:bg-zoyya-50"
            aria-label="Izbornik"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
