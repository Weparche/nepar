import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { SearchBar } from '../components/SearchBar'
import { SalonCard } from '../components/SalonCard'
import { BookingModal } from '../components/BookingModal'
import { TrustBar } from '../components/TrustBar'
import { HowItWorks } from '../components/HowItWorks'
import { CategoryIcon } from '../components/CategoryIcon'
import { SectionHeader } from '../components/ui/SectionHeader'
import { Button } from '../components/ui/Button'
import { CATEGORIES, CITIES } from '../data/categories'
import { getPopularSalons, getTodayAvailableInCity, getSalonCountByCity } from '../data/salons'

const CITY_GRADIENTS = {
  zagreb: 'from-slate-700 to-slate-900',
  split: 'from-cyan-800 to-teal-900',
  rijeka: 'from-indigo-800 to-slate-900',
  osijek: 'from-amber-800 to-orange-900',
  zadar: 'from-sky-800 to-blue-900',
  varazdin: 'from-rose-800 to-red-900',
  pula: 'from-emerald-800 to-green-900',
}

export function HomePage() {
  const [bookingSalon, setBookingSalon] = useState(null)
  const todayZagreb = getTodayAvailableInCity('zagreb', 4)
  const popular = getPopularSalons(6)

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Header transparent />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border-subtle">
          <div className="absolute inset-0 bg-gradient-to-b from-lime-50/90 via-white to-white" />
          <div className="absolute inset-0 hero-grid opacity-80" aria-hidden />
          <div className="absolute top-20 right-0 w-[min(480px,50vw)] h-[min(480px,50vw)] bg-lime-300/15 rounded-full blur-3xl -translate-y-1/4 translate-x-1/4 motion-reduce:blur-xl" aria-hidden />

          <div className="relative page-container pt-14 pb-12 sm:pt-20 sm:pb-16 lg:pt-24 lg:pb-20">
            <div className="max-w-3xl mx-auto text-center">
              <p className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white ring-1 ring-lime-200/80 text-lime-800 text-xs font-semibold mb-6 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-60 motion-reduce:animate-none" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500" />
                </span>
                Najveći booking marketplace u Hrvatskoj
              </p>
              <h1 className="heading-display text-[2rem] sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15] text-ink">
                Pronađi slobodan termin u salonu blizu sebe
              </h1>
              <p className="mt-5 text-base sm:text-lg text-ink-muted max-w-2xl mx-auto leading-relaxed">
                Frizeri, nokti, masaže, obrve, barber i wellness — rezerviraj termin online u par klikova.
              </p>
            </div>

            <div className="max-w-4xl mx-auto mt-10 sm:mt-12">
              <SearchBar />
              <p className="text-center text-xs text-ink-subtle mt-4">
                Popularno:{' '}
                {['Frizer Zagreb', 'Nokti Split', 'Masaža'].map((t, i) => (
                  <span key={t}>
                    {i > 0 && ' · '}
                    <Link to="/saloni/zagreb/frizeri" className="text-lime-600 hover:text-lime-700 font-medium">
                      {t}
                    </Link>
                  </span>
                ))}
              </p>
            </div>
          </div>

          <div className="relative page-container pb-4">
            <TrustBar />
          </div>
        </section>

        <section id="kategorije" className="page-container py-14 sm:py-18">
          <SectionHeader
            eyebrow="Djelatnosti"
            title="Popularne kategorije"
            description="Od frizera do wellnessa — sve na jednoj platformi."
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                to={`/saloni/zagreb/${cat.slug}`}
                className="card-elevated-interactive flex flex-col items-start gap-3 p-4 sm:p-5 group"
              >
                <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-lime-50 text-lime-700 ring-1 ring-lime-100 group-hover:bg-lime-100 transition-colors duration-150">
                  <CategoryIcon slug={cat.slug} className="w-5 h-5" />
                </span>
                <span className="text-sm font-semibold text-ink group-hover:text-lime-700 transition-colors leading-snug">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-surface-muted border-y border-border-subtle py-14 sm:py-18">
          <div className="page-container">
            <SectionHeader
              eyebrow="Dostupno danas"
              title="Danas slobodno u Zagrebu"
              description="Termini koje možete rezervirati odmah — bez čekanja."
              actionLabel="Vidi sve salone"
              actionTo="/saloni/zagreb?danas=1"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {todayZagreb.map((salon) => (
                <SalonCard key={salon.id} salon={salon} onBook={setBookingSalon} featured />
              ))}
            </div>
          </div>
        </section>

        <section className="page-container py-14 sm:py-18">
          <SectionHeader
            eyebrow="Preporučeno"
            title="Najpopularniji saloni"
            description="Najviše ocjenjeni saloni s najvećim brojem zadovoljnih klijenata."
            actionLabel="Pregledaj sve"
            actionTo="/saloni/zagreb"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {popular.map((salon) => (
              <SalonCard key={salon.id} salon={salon} onBook={setBookingSalon} />
            ))}
          </div>
        </section>

        <HowItWorks />

        <section id="gradovi" className="page-container py-14 sm:py-18">
          <SectionHeader
            eyebrow="Lokacije"
            title="Istraži po gradovima"
            description="Rastuća mreža partnerskih salona diljem Hrvatske."
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {CITIES.filter((city) => getSalonCountByCity(city.slug) > 0).map((city) => (
              <Link
                key={city.slug}
                to={`/saloni/${city.slug}`}
                className={`group relative overflow-hidden rounded-2xl min-h-[120px] sm:min-h-[140px] bg-gradient-to-br ${CITY_GRADIENTS[city.slug] || CITY_GRADIENTS.zagreb} p-5 sm:p-6 flex flex-col justify-end card-elevated-interactive`}
              >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
                <div className="absolute top-4 right-4 text-5xl font-bold text-white/10 select-none" aria-hidden>
                  {city.name.slice(0, 2).toUpperCase()}
                </div>
                <p className="relative text-lg font-bold text-white">{city.name}</p>
                <p className="relative text-sm text-white/75 mt-0.5">
                  {getSalonCountByCity(city.slug)} partnera
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="page-container pb-16 sm:pb-20">
          <div className="relative overflow-hidden rounded-3xl bg-ink">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgb(79_168_114/0.35),transparent_55%)]" aria-hidden />
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/40 to-transparent" aria-hidden />
            <div className="relative px-6 py-12 sm:px-12 sm:py-16 lg:flex lg:items-center lg:justify-between gap-10">
              <div className="max-w-lg">
                <p className="section-eyebrow text-lime-300 mb-3">Za poslovne korisnike</p>
                <h2 className="heading-display text-2xl sm:text-3xl text-white">Vodite salon?</h2>
                <p className="mt-4 text-slate-300 leading-relaxed text-[0.9375rem]">
                  Pridružite se Lime Booking platformi i privucite nove klijente. Online rezervacije, kalendar i recenzije — sve na jednom mjestu.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-8 lg:mt-0 shrink-0">
                <Link to="/za-salone">
                  <Button size="lg" className="w-full sm:w-auto min-w-[200px]">
                    Saznaj više za salone
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Besplatna demonstracija
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <BookingModal salon={bookingSalon} open={!!bookingSalon} onClose={() => setBookingSalon(null)} />
    </div>
  )
}
