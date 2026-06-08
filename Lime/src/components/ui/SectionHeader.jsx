import { Link } from 'react-router-dom'

export function SectionHeader({
  eyebrow,
  title,
  description,
  actionLabel,
  actionTo,
  className = '',
}) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 ${className}`}>
      <div>
        {eyebrow && <p className="section-eyebrow mb-2">{eyebrow}</p>}
        <h2 className="heading-display text-2xl sm:text-[1.75rem] text-ink">{title}</h2>
        {description && (
          <p className="mt-2 text-ink-muted text-[0.9375rem] max-w-xl leading-relaxed">{description}</p>
        )}
      </div>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-lime-600 hover:text-lime-700 transition-colors shrink-0 group"
        >
          {actionLabel}
          <span className="transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden>
            →
          </span>
        </Link>
      )}
    </div>
  )
}
