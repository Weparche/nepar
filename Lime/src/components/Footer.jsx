import { Link } from 'react-router-dom'

const logoUrl = `${import.meta.env.BASE_URL}logo.png`

export function Footer() {
  return (
    <footer className="bg-ink text-slate-300 mt-auto">
      <div className="page-container py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          <div className="md:col-span-5">
            <img src={logoUrl} alt="Lime Booking" className="h-8 mb-5 brightness-0 invert opacity-95" width={120} height={32} />
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Hrvatski marketplace za online rezervacije u salonima, barbershopovima i wellness centrima.
            </p>
            <p className="mt-6 text-xs text-slate-500">Pitch prototype · Demo podaci</p>
          </div>
          <div className="md:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">Za korisnike</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/saloni/zagreb" className="hover:text-white transition-colors duration-150">Pronađi salon</Link></li>
              <li><Link to="/#kategorije" className="hover:text-white transition-colors duration-150">Djelatnosti</Link></li>
              <li><Link to="/#gradovi" className="hover:text-white transition-colors duration-150">Gradovi</Link></li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">Za salone</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/za-salone" className="hover:text-white transition-colors duration-150">Registracija</Link></li>
              <li><Link to="/za-salone" className="hover:text-white transition-colors duration-150">Cijene i paketi</Link></li>
            </ul>
          </div>
          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">Kontakt</h4>
            <p className="text-sm">info@limebooking.hr</p>
            <p className="text-sm text-slate-500 mt-1">Ilica 100, 10000 Zagreb</p>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Lime Booking d.o.o.</p>
          <div className="flex gap-6">
            <span>Privatnost</span>
            <span>Uvjeti korištenja</span>
            <span>Kolačići</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
