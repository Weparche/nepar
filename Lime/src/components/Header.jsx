import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from './ui/Button'

const nav = [
  { label: 'Saloni', to: '/saloni/zagreb' },
  { label: 'Djelatnosti', to: '/#kategorije' },
  { label: 'Gradovi', to: '/#gradovi' },
  { label: 'Za salone', to: '/za-salone' },
]

export function Header({ transparent = false }) {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (to) => {
    if (to.startsWith('/#')) return false
    if (to === '/za-salone') return location.pathname === '/za-salone'
    if (to.startsWith('/saloni')) return location.pathname.startsWith('/saloni')
    return location.pathname === to
  }

  return (
    <header
      className={`sticky top-0 z-[var(--z-header)] transition-[background-color,box-shadow,border-color] duration-300 ${
        transparent && isHome
          ? 'bg-white/90 backdrop-blur-lg border-b border-border-subtle'
          : 'bg-white/95 backdrop-blur-lg border-b border-border-subtle shadow-[0_1px_0_rgb(15_23_42/0.04)]'
      }`}
    >
      <div className="page-container">
        <div className="flex items-center justify-between h-[4.25rem]">
          <Link
            to="/"
            className="flex items-center gap-2.5 shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500"
          >
            <img src="/logo.png" alt="Lime Booking" className="h-7 sm:h-8 w-auto" width={120} height={32} />
          </Link>

          <nav className="hidden md:flex items-center gap-0.5" aria-label="Glavna navigacija">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                aria-current={isActive(item.to) ? 'page' : undefined}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                  isActive(item.to)
                    ? 'text-lime-700 bg-lime-50'
                    : 'text-ink-muted hover:text-ink hover:bg-slate-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/za-salone" className="hidden sm:block">
              <Button variant="secondary" size="sm">
                Prijava za salone
              </Button>
            </Link>
            <Link to="/saloni/zagreb" className="hidden lg:block">
              <Button size="sm">Pronađi termin</Button>
            </Link>
            <button
              type="button"
              className="md:hidden p-2.5 text-ink-muted rounded-xl hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-lime-500"
              aria-label={menuOpen ? 'Zatvori izbornik' : 'Otvori izbornik'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <nav
          className="md:hidden border-t border-border-subtle bg-white px-4 py-4 space-y-1"
          aria-label="Mobilna navigacija"
        >
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 text-sm font-medium text-ink rounded-xl hover:bg-lime-50"
            >
              {item.label}
            </Link>
          ))}
          <Link to="/saloni/zagreb" onClick={() => setMenuOpen(false)} className="block pt-2">
            <Button className="w-full">Pronađi termin</Button>
          </Link>
        </nav>
      )}
    </header>
  )
}
