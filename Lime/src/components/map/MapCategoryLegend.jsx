import { CATEGORY_MAP_STYLES } from '../../data/categoryMapStyles'
import { CategoryIcon } from '../CategoryIcon'

export function MapCategoryLegend({ salons, className = '' }) {
  const slugs = [...new Set(salons.map((s) => s.categorySlug).filter(Boolean))]

  if (slugs.length === 0) return null

  return (
    <div
      className={`shrink-0 px-3 py-2 border-t border-border-subtle bg-white ${className}`}
      role="region"
      aria-label="Legenda kategorija na karti"
    >
      <p className="text-[10px] font-bold uppercase tracking-wider text-ink-subtle mb-1.5">
        Legenda
      </p>
      <div className="flex flex-row flex-wrap gap-1" role="list">
        {slugs.map((slug) => {
          const style = CATEGORY_MAP_STYLES[slug]
          if (!style) return null
          return (
            <div
              key={slug}
              role="listitem"
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-50/90 ring-1 ring-border-subtle max-w-full"
              title={style.label}
            >
              <span
                className="w-4 h-4 rounded flex items-center justify-center shrink-0"
                style={{ backgroundColor: style.pinColor, color: style.iconColor }}
                aria-hidden
              >
                <CategoryIcon slug={slug} className="w-2.5 h-2.5" />
              </span>
              <span className="text-[10px] font-semibold text-ink leading-tight">{style.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
