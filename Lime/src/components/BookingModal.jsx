import { useState, useEffect } from 'react'
import { CloseIcon, CheckIcon } from './icons'
import { Button } from './ui/Button'

const STEPS = [
  'Odaberi uslugu',
  'Odaberi djelatnika',
  'Odaberi termin',
  'Unesi podatke',
]

export function BookingModal({ salon, open, onClose }) {
  const [step, setStep] = useState(0)
  const [serviceId, setServiceId] = useState(null)
  const [employeeId, setEmployeeId] = useState(null)
  const [slot, setSlot] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    if (open) {
      setStep(0)
      setServiceId(null)
      setEmployeeId(null)
      setSlot(null)
      setForm({ name: '', email: '', phone: '' })
      setConfirmed(false)
    }
  }, [open, salon?.id])

  if (!open || !salon) return null

  const service = salon.services.find((s) => s.id === serviceId)
  const employee = salon.employees.find((e) => e.id === employeeId)
  const allSlots = Object.entries(salon.schedule || {}).flatMap(([day, times]) =>
    times.map((t) => ({ day, time: t })),
  )

  function handleNext() {
    if (step < 3) setStep((s) => s + 1)
    else {
      setConfirmed(true)
    }
  }

  function canProceed() {
    if (step === 0) return !!serviceId
    if (step === 1) return !!employeeId
    if (step === 2) return !!slot
    if (step === 3) return form.name && form.email && form.phone
    return false
  }

  return (
    <div className="fixed inset-0 z-[var(--z-modal)] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-ink/55 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        className="relative w-full max-w-lg max-h-[92vh] sm:max-h-[85vh] bg-white rounded-t-3xl sm:rounded-2xl shadow-[0_24px_64px_rgb(15_23_42/0.2)] flex flex-col overflow-hidden ring-1 ring-border-subtle"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h2 id="booking-title" className="font-semibold text-slate-900">
              {confirmed ? 'Potvrda' : 'Rezervacija'}
            </h2>
            {!confirmed && (
              <p className="text-sm text-slate-500">{salon.name}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-500"
            aria-label="Zatvori"
          >
            <CloseIcon />
          </button>
        </div>

        {confirmed ? (
          <div className="p-8 text-center flex-1 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-lime-100 flex items-center justify-center mb-4">
              <CheckIcon className="w-8 h-8 text-lime-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Termin je rezerviran!</h3>
            <p className="text-slate-500 text-sm max-w-xs mb-6">
              Potvrdu smo poslali na {form.email}. Vidimo se u salonu {salon.name}!
            </p>
            <div className="bg-slate-50 rounded-xl p-4 w-full text-left text-sm space-y-2 mb-6">
              <p><span className="text-slate-500">Usluga:</span> <strong>{service?.name}</strong></p>
              <p><span className="text-slate-500">Djelatnik:</span> <strong>{employee?.name}</strong></p>
              <p><span className="text-slate-500">Termin:</span> <strong>{slot?.day} u {slot?.time}</strong></p>
            </div>
            <Button className="w-full" onClick={onClose}>
              Zatvori
            </Button>
          </div>
        ) : (
          <>
            <div className="px-5 py-3 border-b border-slate-50">
              <div className="flex gap-1">
                {STEPS.map((label, i) => (
                  <div key={label} className="flex-1">
                    <div
                      className={`h-1 rounded-full transition-colors ${
                        i <= step ? 'bg-lime-500' : 'bg-slate-200'
                      }`}
                    />
                    <p className={`text-[10px] mt-1 truncate ${i === step ? 'text-lime-600 font-medium' : 'text-slate-400'}`}>
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {step === 0 && (
                <ul className="space-y-2">
                  {salon.services.map((s) => (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => setServiceId(s.id)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                          serviceId === s.id
                            ? 'border-lime-500 bg-lime-50'
                            : 'border-slate-100 hover:border-lime-200'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-slate-900">{s.name}</span>
                          <span className="font-semibold text-lime-600">{s.price} €</span>
                        </div>
                        <span className="text-sm text-slate-500">{s.duration} min</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {step === 1 && (
                <ul className="space-y-2">
                  {salon.employees.map((e) => (
                    <li key={e.id}>
                      <button
                        type="button"
                        onClick={() => setEmployeeId(e.id)}
                        className={`w-full text-left p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
                          employeeId === e.id
                            ? 'border-lime-500 bg-lime-50'
                            : 'border-slate-100 hover:border-lime-200'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lime-200 to-lime-100 flex items-center justify-center font-semibold text-lime-700">
                          {e.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{e.name}</p>
                          <p className="text-sm text-slate-500">{e.role}</p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  {Object.entries(salon.schedule || {}).map(([day, times]) => (
                    <div key={day}>
                      <p className="text-sm font-medium text-slate-700 mb-2">{day}</p>
                      <div className="flex flex-wrap gap-2">
                        {times.map((time) => {
                          const selected = slot?.day === day && slot?.time === time
                          return (
                            <button
                              key={`${day}-${time}`}
                              type="button"
                              onClick={() => setSlot({ day, time })}
                              className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                                selected
                                  ? 'border-lime-500 bg-lime-500 text-white'
                                  : 'border-slate-200 hover:border-lime-300 text-slate-700'
                              }`}
                            >
                              {time}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                  {allSlots.length === 0 && (
                    <p className="text-slate-500 text-sm">Nema dostupnih termina u demo podacima.</p>
                  )}
                </div>
              )}

              {step === 3 && (
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Ime i prezime</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className="input-field"
                      placeholder="Ana Horvat"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      className="input-field"
                      placeholder="ana@email.hr"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Mobitel</label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      className="input-field"
                      placeholder="+385 91 123 4567"
                    />
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600">
                    <p className="font-medium text-slate-800 mb-1">Sažetak</p>
                    <p>{service?.name} · {employee?.name}</p>
                    <p>{slot ? `${slot.day} u ${slot.time}` : '—'}</p>
                    <p className="text-lime-600 font-semibold mt-1">{service?.price} €</p>
                  </div>
                </form>
              )}
            </div>

            <div className="p-5 border-t border-slate-100 flex gap-2">
              {step > 0 && (
                <Button variant="secondary" className="flex-1" onClick={() => setStep((s) => s - 1)}>
                  Natrag
                </Button>
              )}
              <Button className="flex-1" disabled={!canProceed()} onClick={handleNext}>
                {step === 3 ? 'Potvrdi rezervaciju' : 'Nastavi'}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
