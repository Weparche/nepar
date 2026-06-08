import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { BookingModal } from '../components/BookingModal'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { StarIcon, MapPinIcon, ClockIcon } from '../components/icons'
import { SalonCover } from '../components/SalonCover'
import { getSalonBySlug } from '../data/salons'
import { SalonLocationMap } from '../components/map/SalonLocationMap'

export function SalonProfilePage() {
  const { slug } = useParams()
  const salon = getSalonBySlug(slug)
  const [bookingOpen, setBookingOpen] = useState(false)

  if (!salon) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <h1 className="text-xl font-bold text-slate-900">Salon nije pronađen</h1>
            <Link to="/" className="text-lime-600 font-medium mt-2 inline-block">
              Natrag na početnu
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col pb-24 lg:pb-0 bg-surface-muted">
      <Header />

      <div className="relative h-52 sm:h-72 lg:h-80 overflow-hidden">
        <SalonCover
          category={salon.category}
          name={salon.name}
          imageUrl={salon.imageUrl}
          imageFallbackSlug={salon.slug}
          aspect="auto"
          className="absolute inset-0 h-full rounded-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />
      </div>

      <main className="page-container -mt-20 sm:-mt-24 relative z-10">
        <nav aria-label="Breadcrumb" className="text-sm text-white/80 mb-4 drop-shadow-sm">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li><Link to="/" className="hover:text-white transition-colors">Početna</Link></li>
            <li aria-hidden>/</li>
            <li><Link to={`/saloni/${salon.citySlug}`} className="hover:text-white transition-colors">{salon.city}</Link></li>
            <li aria-hidden>/</li>
            <li className="text-white font-medium">{salon.name}</li>
          </ol>
        </nav>
        <div className="card-elevated p-6 sm:p-8 mb-8" style={{ boxShadow: 'var(--shadow-card-hover)' }}>
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="lime">{salon.category}</Badge>
                {salon.availableToday && <Badge variant="success">Danas slobodno</Badge>}
              </div>
              <h1 className="heading-display text-2xl sm:text-3xl text-ink">{salon.name}</h1>
              <p className="flex items-center gap-1.5 text-slate-500 mt-2">
                <MapPinIcon className="w-4 h-4 shrink-0" />
                {salon.area}, {salon.city} · {salon.address}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-lg">
                  <StarIcon className="w-5 h-5 text-amber-400" />
                  <span className="font-bold text-slate-900">{salon.rating}</span>
                  <span className="text-slate-500 text-sm">({salon.reviewCount} recenzija)</span>
                </div>
                <span className="text-slate-400">·</span>
                <span className="text-sm font-medium text-slate-600">
                  od {salon.priceFrom} €
                </span>
              </div>
            </div>
            <Button size="lg" className="hidden lg:inline-flex shrink-0" onClick={() => setBookingOpen(true)}>
              Rezerviraj termin
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="card-elevated p-6 sm:p-7">
              <h2 className="heading-display text-lg text-ink mb-5">Usluge</h2>
              <ul className="divide-y divide-slate-100">
                {salon.services.map((s) => (
                  <li key={s.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                    <div>
                      <p className="font-medium text-slate-900">{s.name}</p>
                      <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                        <ClockIcon className="w-4 h-4" />
                        {s.duration} min
                      </p>
                    </div>
                    <span className="font-semibold text-lime-600 text-lg">{s.price} €</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="card-elevated p-6 sm:p-7">
              <h2 className="heading-display text-lg text-ink mb-5">Dostupni termini</h2>
              <div className="space-y-4">
                {Object.entries(salon.schedule || {}).map(([day, times]) => (
                  <div key={day}>
                    <p className="text-sm font-semibold text-slate-700 mb-2">{day}</p>
                    <div className="flex flex-wrap gap-2">
                      {times.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setBookingOpen(true)}
                          className="px-3.5 py-2 text-sm font-semibold tabular-nums bg-lime-50 text-lime-800 rounded-lg ring-1 ring-lime-100 hover:bg-lime-100 hover:ring-lime-200 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-lime-500"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="card-elevated p-6 sm:p-7">
              <h2 className="heading-display text-lg text-ink mb-5">Djelatnici</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {salon.employees.map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-lime-300 to-lime-100 flex items-center justify-center font-bold text-lime-800">
                      {e.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{e.name}</p>
                      <p className="text-sm text-slate-500">{e.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="card-elevated p-6 sm:p-7">
              <h2 className="heading-display text-lg text-ink mb-3">O salonu</h2>
              <p className="text-ink-muted leading-relaxed text-[0.9375rem]">{salon.about}</p>
            </section>

            <section className="card-elevated overflow-hidden">
              <h2 className="heading-display text-lg text-ink p-6 sm:p-7 pb-0">Lokacija</h2>
              <div className="m-6 sm:m-7 mt-4 rounded-xl ring-1 ring-lime-100 overflow-hidden h-64 sm:h-72">
                <SalonLocationMap salon={salon} className="h-full min-h-[256px]" />
              </div>
              <p className="px-6 sm:px-7 pb-6 sm:pb-7 -mt-2 text-sm text-ink-muted flex items-center gap-1.5">
                <MapPinIcon className="w-4 h-4 text-lime-600 shrink-0" />
                {salon.address}
              </p>
            </section>

            <section className="card-elevated p-6 sm:p-7">
              <h2 className="heading-display text-lg text-ink mb-5">Recenzije</h2>
              <ul className="space-y-4">
                {salon.reviews.map((r) => (
                  <li key={r.id} className="border-b border-slate-50 last:border-0 pb-4 last:pb-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-900">{r.author}</span>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <StarIcon key={i} className="w-4 h-4 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{r.date}</p>
                    <p className="text-slate-600 text-sm mt-2">{r.text}</p>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-[5.5rem] card-elevated p-6">
              <h3 className="font-semibold text-slate-900 mb-3">Brza rezervacija</h3>
              <p className="text-sm text-slate-500 mb-4">
                Odaberi uslugu, djelatnika i termin u nekoliko koraka.
              </p>
              {salon.appointments?.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-slate-500 mb-2">Danas dostupno</p>
                  <div className="flex flex-wrap gap-1.5">
                    {salon.appointments.map((t) => (
                      <span key={t} className="px-2 py-1 text-xs bg-lime-50 text-lime-700 rounded-lg">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <Button className="w-full" size="lg" onClick={() => setBookingOpen(true)}>
                Rezerviraj termin
              </Button>
            </div>
          </aside>
        </div>
      </main>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-border-subtle z-[var(--z-sticky)] shadow-[0_-4px_24px_rgb(15_23_42/0.08)]">
        <Button className="w-full" size="lg" onClick={() => setBookingOpen(true)}>
          Rezerviraj termin
        </Button>
      </div>

      <Footer />
      <BookingModal salon={salon} open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  )
}
