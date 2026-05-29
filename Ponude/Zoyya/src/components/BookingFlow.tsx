import { X, Check, ChevronLeft, Calendar, Clock, User } from 'lucide-react'
import { bookingSlots } from '../data/salons'
import type { BookingContact, BookingState, Salon } from '../types'

interface BookingFlowProps {
  open: boolean
  salon: Salon | null
  booking: BookingState
  onClose: () => void
  onUpdate: (booking: BookingState) => void
  onConfirm: () => void
  onBack: () => void
}

export default function BookingFlow({
  open,
  salon,
  booking,
  onClose,
  onUpdate,
  onConfirm,
  onBack,
}: BookingFlowProps) {
  if (!open || !salon) return null

  const selectedService = salon.services.find((s) => s.id === booking.serviceId)

  return (
    <div
      className="fixed inset-0 z-[110] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      data-testid="booking-flow"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
          {booking.step !== 'confirmed' && booking.step > 1 && (
            <button type="button" onClick={onBack} className="rounded-lg p-1 hover:bg-gray-100">
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          <h2 className="flex-1 text-center text-lg font-bold">
            {booking.step === 'confirmed'
              ? 'Potvrda upita'
              : `Rezervacija — korak ${booking.step}/3`}
          </h2>
          <button type="button" onClick={onClose} className="rounded-lg p-1 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {booking.step !== 'confirmed' && (
            <div className="mb-6 flex gap-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`h-1.5 flex-1 rounded-full ${
                    (typeof booking.step === 'number' && booking.step >= step) ||
                    booking.step === 'confirmed'
                      ? 'bg-zoyya-600'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          )}

          <p className="mb-4 text-sm font-medium text-zoyya-600">{salon.name}</p>

          {booking.step === 1 && (
            <div data-testid="booking-step-1">
              <h3 className="mb-3 font-semibold">Odaberite uslugu</h3>
              <ul className="space-y-2">
                {salon.services.map((service) => (
                  <li key={service.id}>
                    <button
                      type="button"
                      data-testid={`booking-service-${service.id}`}
                      onClick={() =>
                        onUpdate({ ...booking, serviceId: service.id, step: 2 })
                      }
                      className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                        booking.serviceId === service.id
                          ? 'border-zoyya-400 bg-zoyya-50'
                          : 'border-gray-100 hover:border-zoyya-200'
                      }`}
                    >
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-gray-400">{service.duration} min</p>
                      </div>
                      <span className="font-semibold text-zoyya-700">{service.price} €</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {booking.step === 2 && (
            <div data-testid="booking-step-2">
              <h3 className="mb-3 font-semibold">Odaberite datum i vrijeme</h3>
              {selectedService && (
                <p className="mb-4 text-sm text-gray-500">
                  {selectedService.name} — {selectedService.duration} min —{' '}
                  {selectedService.price} €
                </p>
              )}
              <div className="space-y-4">
                {bookingSlots.map(({ day, slots }) => (
                  <div key={day}>
                    <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Calendar className="h-4 w-4 text-zoyya-500" />
                      {day}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {slots.map((slot) => {
                        const value = `${day} ${slot}`
                        const selected = booking.slot === value
                        return (
                          <button
                            key={value}
                            type="button"
                            data-testid={`slot-${day}-${slot}`}
                            onClick={() => onUpdate({ ...booking, slot: value, step: 3 })}
                            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition ${
                              selected
                                ? 'bg-zoyya-600 text-white'
                                : 'bg-zoyya-50 text-zoyya-700 hover:bg-zoyya-100'
                            }`}
                          >
                            <Clock className="h-3.5 w-3.5" />
                            {slot}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {booking.step === 3 && (
            <div data-testid="booking-step-3">
              <h3 className="mb-3 font-semibold">Vaši podaci</h3>
              {selectedService && booking.slot && (
                <div className="mb-4 rounded-xl bg-zoyya-50 p-3 text-sm">
                  <p>
                    <strong>{selectedService.name}</strong> — {selectedService.price} €
                  </p>
                  <p className="text-gray-500">{booking.slot}</p>
                </div>
              )}
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  onConfirm()
                }}
                className="space-y-3"
              >
                <Field
                  label="Ime i prezime"
                  value={booking.contact.name}
                  onChange={(v) =>
                    onUpdate({ ...booking, contact: { ...booking.contact, name: v } })
                  }
                  required
                />
                <Field
                  label="Mobitel"
                  type="tel"
                  value={booking.contact.phone}
                  onChange={(v) =>
                    onUpdate({ ...booking, contact: { ...booking.contact, phone: v } })
                  }
                  required
                />
                <Field
                  label="Email"
                  type="email"
                  value={booking.contact.email}
                  onChange={(v) =>
                    onUpdate({ ...booking, contact: { ...booking.contact, email: v } })
                  }
                  required
                />
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Napomena</label>
                  <textarea
                    value={booking.contact.note}
                    onChange={(e) =>
                      onUpdate({
                        ...booking,
                        contact: { ...booking.contact, note: e.target.value },
                      })
                    }
                    rows={3}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-zoyya-300 focus:ring-2 focus:ring-zoyya-100"
                    placeholder="Opcionalna napomena za salon..."
                  />
                </div>
                <button
                  type="submit"
                  data-testid="confirm-booking"
                  className="mt-2 w-full rounded-xl bg-zoyya-600 py-3.5 text-sm font-semibold text-white transition hover:bg-zoyya-700"
                >
                  Pošalji upit
                </button>
              </form>
            </div>
          )}

          {booking.step === 'confirmed' && (
            <div data-testid="booking-confirmed" className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Upit za termin je poslan salonu.
              </h3>
              <div className="mt-6 space-y-3 rounded-xl bg-zoyya-50 p-4 text-left text-sm">
                <Row label="Salon" value={salon.name} />
                <Row
                  label="Usluga"
                  value={selectedService ? `${selectedService.name} (${selectedService.price} €)` : '—'}
                />
                <Row label="Termin" value={booking.slot ?? '—'} />
                <Row label="Ime" value={booking.contact.name} />
                <Row label="Mobitel" value={booking.contact.phone} />
                <Row label="Email" value={booking.contact.email} />
                {booking.contact.note && (
                  <Row label="Napomena" value={booking.contact.note} />
                )}
              </div>
              <p className="mt-6 rounded-xl border border-zoyya-100 bg-zoyya-50/50 p-4 text-xs leading-relaxed text-gray-500">
                U ovom MVP demo prikazu booking je mock. U produkciji se može spojiti na
                postojeći Zoyya booking sustav, WhatsApp upit ili pravi kalendar salona.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-4 w-full rounded-xl bg-zoyya-600 py-3 text-sm font-semibold text-white"
              >
                Zatvori
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required,
  id,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  required?: boolean
  id?: string
}) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-')
  return (
    <div>
      <label htmlFor={fieldId} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={fieldId}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-zoyya-300 focus:ring-2 focus:ring-zoyya-100"
      />
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <User className="mt-0.5 h-4 w-4 shrink-0 text-zoyya-400" />
      <div>
        <span className="text-gray-400">{label}: </span>
        <span className="font-medium text-gray-800">{value}</span>
      </div>
    </div>
  )
}

export const defaultContact: BookingContact = {
  name: '',
  phone: '',
  email: '',
  note: '',
}

export const defaultBooking = (salonId: string | null = null): BookingState => ({
  salonId,
  serviceId: null,
  slot: null,
  contact: { ...defaultContact },
  step: 1,
})
