const stats = [
  { value: '500+', label: 'salona u Hrvatskoj' },
  { value: '48k', label: 'rezervacija mjesečno' },
  { value: '4.8', label: 'prosječna ocjena' },
  { value: '7', label: 'gradova' },
]

export function TrustBar({ className = '' }) {
  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-x-8 gap-y-4 py-6 border-y border-border-subtle ${className}`}
      role="region"
      aria-label="Statistike platforme"
    >
      {stats.map((s, i) => (
        <div key={s.label} className="flex items-center gap-8">
          {i > 0 && (
            <div className="hidden sm:block w-px h-8 bg-border" aria-hidden />
          )}
          <div className="text-center sm:text-left">
            <p className="text-lg font-bold text-ink tabular-nums">{s.value}</p>
            <p className="text-xs text-ink-muted font-medium">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
