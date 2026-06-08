export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-slate-100 text-ink-muted',
    lime: 'bg-lime-100 text-lime-800 ring-1 ring-lime-200/60',
    success: 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200/80',
    neutral: 'bg-slate-50 text-ink-muted ring-1 ring-border',
  }
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold tracking-wide uppercase ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
