import { MapPin, Clock, Star, Zap, TrendingUp } from 'lucide-react'
import type { QuickFilterId } from '../types'

const quickFilters: {
  id: QuickFilterId
  label: string
  subtitle: string
  icon: typeof MapPin
}[] = [
  { id: 'nearest', label: 'Najbliže meni', subtitle: 'Preporučeno', icon: MapPin },
  { id: 'open-now', label: 'Otvoreno sada', subtitle: '124 salona', icon: Clock },
  { id: 'available-today', label: 'Danas dostupno', subtitle: '89 salona', icon: Star },
  { id: 'top-rated', label: 'Najbolje ocijenjeni', subtitle: 'Top 4+', icon: TrendingUp },
  { id: 'deals', label: 'Akcije i popusti', subtitle: 'Trenutne ponude', icon: Zap },
]

interface QuickFiltersProps {
  active: QuickFilterId | null
  onSelect: (id: QuickFilterId | null) => void
}

export default function QuickFilters({ active, onSelect }: QuickFiltersProps) {
  return (
    <div
      className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide"
      data-testid="quick-filters"
    >
      {quickFilters.map(({ id, label, subtitle, icon: Icon }) => {
        const isActive = active === id
        return (
          <button
            key={id}
            type="button"
            data-testid={`quick-filter-${id}`}
            onClick={() => onSelect(isActive ? null : id)}
            className={`flex min-w-[140px] shrink-0 flex-col rounded-xl border px-4 py-3 text-left transition ${
              isActive
                ? 'border-zoyya-300 bg-zoyya-50 shadow-sm'
                : 'border-gray-100 bg-white hover:border-zoyya-200 hover:shadow-sm'
            }`}
          >
            <Icon className={`mb-2 h-4 w-4 ${isActive ? 'text-zoyya-600' : 'text-zoyya-400'}`} />
            <span className="text-sm font-semibold text-gray-800">{label}</span>
            <span className="text-xs text-gray-400">{subtitle}</span>
          </button>
        )
      })}
    </div>
  )
}
