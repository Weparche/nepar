const steps = [
  {
    step: '01',
    title: 'Pretraži i usporedi',
    desc: 'Pronađi salone po gradu, djelatnosti i dostupnim terminima već danas.',
  },
  {
    step: '02',
    title: 'Odaberi termin',
    desc: 'Usluga, djelatnik i točan sat — bez telefonskih poziva i čekanja.',
  },
  {
    step: '03',
    title: 'Potvrdi rezervaciju',
    desc: 'Instant potvrda na e-mail. Podsjetnik prije termina.',
  },
]

export function HowItWorks() {
  return (
    <section className="py-16 sm:py-20 bg-surface-muted" aria-labelledby="how-it-works">
      <div className="page-container">
        <p className="section-eyebrow text-center mb-2">Kako funkcionira</p>
        <h2 id="how-it-works" className="heading-display text-2xl sm:text-3xl text-center text-ink mb-12">
          Rezervacija u tri koraka
        </h2>
        <ol className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((s) => (
            <li key={s.step} className="card-elevated p-6 sm:p-8 relative">
              <span className="text-4xl font-bold text-lime-100 absolute top-6 right-6 select-none" aria-hidden>
                {s.step}
              </span>
              <span className="inline-flex w-10 h-10 items-center justify-center rounded-xl bg-lime-600 text-white text-sm font-bold mb-4">
                {s.step.slice(1)}
              </span>
              <h3 className="font-semibold text-lg text-ink mb-2">{s.title}</h3>
              <p className="text-sm text-ink-muted leading-relaxed">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
