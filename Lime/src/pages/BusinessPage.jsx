import { Link } from 'react-router-dom'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Button } from '../components/ui/Button'
import { TrustBar } from '../components/TrustBar'

const features = [
  {
    title: 'Online rezervacije 24/7',
    desc: 'Klijenti rezerviraju termine kad god žele — bez poziva i poruka.',
  },
  {
    title: 'Kalendar i raspored',
    desc: 'Upravljajte djelatnicima, uslugama i slobodnim terminima na jednom mjestu.',
  },
  {
    title: 'Više novih klijenata',
    desc: 'Budite vidljivi na Lime Booking marketplaceu diljem Hrvatske.',
  },
  {
    title: 'Recenzije i povjerenje',
    desc: 'Skupljajte autentične recenzije i gradite reputaciju salona.',
  },
  {
    title: 'Online plaćanje',
    desc: 'Opcionalno naplaćujte depozit ili puni iznos prije termina.',
  },
  {
    title: 'Statistike',
    desc: 'Pratite popunjenost, popularne usluge i performanse tima.',
  },
]

const plans = [
  { name: 'Start', price: '0', period: 'Prvih 30 dana', features: ['Do 2 djelatnika', 'Online kalendar', 'Osnovni profil'] },
  { name: 'Pro', price: '49', period: 'mjesečno', features: ['Neograničeno djelatnika', 'Marketplace listing', 'SMS podsjetnici', 'Prioritetna podrška'], popular: true },
  { name: 'Premium', price: '89', period: 'mjesečno', features: ['Sve iz Pro', 'Promovirani oglas', 'Online plaćanje', 'API integracije'] },
]

export function BusinessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Header />

      <section className="relative overflow-hidden border-b border-border-subtle">
        <div className="absolute inset-0 bg-gradient-to-b from-lime-50 to-white" />
        <div className="absolute inset-0 hero-grid opacity-60" aria-hidden />
        <div className="relative page-container py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className="section-eyebrow mb-4">Za salone i wellness centre</p>
              <h1 className="heading-display text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12] text-ink">
                Popunite kalendar. Privucite nove klijente.
              </h1>
              <p className="mt-5 text-lg text-ink-muted leading-relaxed">
                Lime Booking povezuje vaš salon s tisućama korisnika koji traže termin u vašem gradu. Jednostavna registracija, bez ugovorne obveze.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button size="lg">Započni besplatno</Button>
                <Button variant="secondary" size="lg">
                  Zakaži demo poziv
                </Button>
              </div>
            </div>
            <div className="card-elevated p-2 overflow-hidden" style={{ boxShadow: 'var(--shadow-search)' }}>
              <div className="bg-surface-muted rounded-xl p-4 border border-border-subtle">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-semibold text-ink-muted">Salon dashboard</span>
                  <span className="ml-auto text-xs text-lime-700 font-medium bg-lime-50 px-2 py-0.5 rounded-md">Live</span>
                </div>
                <div className="grid grid-cols-7 gap-1.5 mb-4">
                  {['P', 'U', 'S', 'Č', 'P', 'S', 'N'].map((d) => (
                    <span key={d} className="text-[10px] font-semibold text-center text-ink-subtle">{d}</span>
                  ))}
                  {Array.from({ length: 28 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-md aspect-square ${
                        [3, 7, 11, 15, 19].includes(i)
                          ? 'bg-lime-500 ring-2 ring-lime-200'
                          : i % 5 === 0
                            ? 'bg-lime-100'
                            : 'bg-white ring-1 ring-border-subtle'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex gap-3 text-center">
                  {[
                    { label: 'Danas', val: '12' },
                    { label: 'Tjedan', val: '48' },
                    { label: 'Ocjena', val: '4.9' },
                  ].map((s) => (
                    <div key={s.label} className="flex-1 bg-white rounded-lg py-2 ring-1 ring-border-subtle">
                      <p className="text-lg font-bold text-ink tabular-nums">{s.val}</p>
                      <p className="text-[10px] text-ink-subtle font-medium uppercase tracking-wide">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative page-container pb-2">
          <TrustBar className="border-t-0" />
        </div>
      </section>

      <section className="page-container py-16 sm:py-20">
        <p className="section-eyebrow text-center mb-2">Prednosti</p>
        <h2 className="heading-display text-2xl sm:text-3xl text-center text-ink mb-12">Zašto Lime Booking?</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div key={f.title} className="card-elevated-interactive p-6 sm:p-7">
              <span className="flex w-10 h-10 items-center justify-center rounded-xl bg-lime-600 text-white text-sm font-bold">
                {i + 1}
              </span>
              <h3 className="font-semibold text-ink mt-4 text-lg">{f.title}</h3>
              <p className="text-sm text-ink-muted mt-2 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface-muted py-16 sm:py-20 border-y border-border-subtle">
        <div className="page-container">
          <p className="section-eyebrow text-center mb-2">Cijene</p>
          <h2 className="heading-display text-2xl sm:text-3xl text-center text-ink mb-12">Paketi za salone</h2>
          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 sm:p-8 bg-white ${
                  plan.popular
                    ? 'ring-2 ring-lime-500 shadow-[var(--shadow-card-hover)]'
                    : 'card-elevated'
                }`}
              >
                {plan.popular && (
                  <span className="text-[11px] font-bold uppercase tracking-wider text-lime-700 bg-lime-50 px-2.5 py-1 rounded-md ring-1 ring-lime-100">
                    Najpopularnije
                  </span>
                )}
                <h3 className="text-xl font-bold text-ink mt-3">{plan.name}</h3>
                <p className="mt-3">
                  <span className="text-4xl font-bold text-ink tabular-nums">{plan.price} €</span>
                  <span className="text-ink-muted text-sm"> / {plan.period}</span>
                </p>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feat) => (
                    <li key={feat} className="text-sm text-ink-muted flex items-start gap-2.5">
                      <svg className="w-5 h-5 text-lime-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feat}
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-8" variant={plan.popular ? 'primary' : 'secondary'}>
                  Odaberi {plan.name}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-container py-16 sm:pb-20">
        <div className="rounded-3xl bg-lime-600 px-8 py-12 sm:px-12 sm:py-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_0%,white/15,transparent_50%)]" aria-hidden />
          <h2 className="heading-display text-2xl sm:text-3xl text-white relative">Spremni za prve online rezervacije?</h2>
          <p className="mt-4 text-lime-100 max-w-lg mx-auto relative text-[0.9375rem] leading-relaxed">
            Registracija traje manje od 10 minuta. Naš tim pomaže pri postavljanju profila i usluga.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center relative">
            <Button size="lg" className="bg-white text-lime-800 hover:bg-lime-50 shadow-lg">
              Registriraj salon
            </Button>
            <Link to="/">
              <Button size="lg" variant="outline">
                Pogledaj marketplace
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
